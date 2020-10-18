var con = require('./connect');
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "000000",
    multipleStatements: true
})

const Sql = 'CREATE DATABASE IF NOT EXISTS hypertube';

const usersql = `CREATE TABLE IF NOT EXISTS user(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(255),
    verify VARCHAR(3),
    image VARCHAR(255)
)`;

const videosql = `CREATE TABLE IF NOT EXISTS video(
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  video_id int(11),
  title VARCHAR(255),
  name VARCHAR(255),
  externtion VARCHAR(255),
  videosize VARCHAR(255),
  hash VARCHAR(255),
  status VARCHAR(255),
  views int(42) default 0
)`

const commentsql = `CREATE TABLE IF NOT EXISTS comment(
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  video_id int(11),
  comment VARCHAR(255)
)`


const createDB = () => {
    return new Promise((resolve, reject) => {
      conn.query(Sql,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          console.info('Database created');
          return resolve(result[0]);
        });
    });
  }
  
  const createTB = () => {
    return new Promise((resolve, reject) => {
      con.query(
        `${usersql};
        ${videosql};
        ${commentsql};`,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          console.info('Tables created');
          return resolve(result[0]);
        });
    });
  }
  
  
  const seedDB = () => {
    return new Promise((resolve, reject) => {
      con.query(`${seedInterests}${seedUsers}`,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          console.info('DB seeded');
          return resolve(result[0]);
        });
    });
  }
  

  
  const connection = () => {
    return new Promise((resolve, reject) => {
      conn.connect((connectErr) => {
        if (connectErr) {
          return reject(connectErr);
        }
        resolve();
      })
    })
  }
  
  const setupAPP = async () => {
    try {
      // await connection()
      await createDB()
      await createTB()
      await seedDB()
    } catch (error) {
      console.error(error.message);
    }
  }
  
  setupAPP()