const mysql = require("mysql2");
const PlayerStat = require("./PlayerStat");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    database: "seabattle",
    password: "password"
})

module.exports.getByUsername = function getByUsername(username) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM stat WHERE username = '${username}'`,
            (err, result, fields) => {
                    console.log(result[0])
                    let res = new PlayerStat(result[0]?.username, result[0]?.win_count, result[0]?.lose_count)
                    resolve(res)
                })
    })
}

module.exports.insertNewUser = function insertNewUser(username) {
    connection.query(`INSERT INTO stat(username) VALUES ('${username}')`,(err, result, fields) =>{
        console.log("inserted user: " + username)
        return true
    })
}

module.exports.incrementWin = function incrementWin(username) {
    connection.query(`UPDATE stat SET win_count = win_count + 1 WHERE username = '${username}'`,(err, result, fields) =>{
        console.log("updated user: " + username)
        return true
    })
}

module.exports.incrementLose = function incrementLose(username) {
    connection.query(`UPDATE stat SET lose_count = lose_count + 1 WHERE username = '${username}'`,(err, result, fields) =>{
        console.log("updated user: " + username)
        return true
    })
}