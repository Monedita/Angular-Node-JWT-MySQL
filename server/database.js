const mysql = require('mysql');
const faker = require('faker');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

console.log(__dirname);

const ownDataBase = "instagon";

const ownTables = `CREATE TABLE users (
	id int primary key auto_increment,
	user_name varchar(255) not null,
	real_name varchar(255) not null,
	email varchar(255) UNIQUE not null,
	password varchar(255) not null
);
CREATE TABLE posts (
	id int primary key auto_increment,
	img_url varchar(255) not null,
	description text null,
	user_id INT not null,
	CONSTRAINT FK_user_post FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE comments (
	id INT PRIMARY KEY NOT null AUTO_INCREMENT,
	comment TEXT NULL,
	post_id INT(11) NOT NULL,
	user_id INT(11) NOT NULL,
	CONSTRAINT FK_post_coment FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
	CONSTRAINT FK_user_coment FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

//checking folder to upload photos
//it gets arrased when angular gets compiled
if (fs.existsSync(path.join(__dirname, '../uploads'))){
    console.log('Uploads folder exists.');
    } else {
        fs.mkdir(path.join(__dirname, '../uploads'), {}, function(err){
                if(err) throw err;
            console.log('Uploads folder created.');
        });
    } 

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    multipleStatements: true,
});

mysqlConnection.connect(function (err) {
    if(err) {
        console.log(err);
        return;
    } else {
        console.log("connection with mysql database successful.");
    }
});

mysqlConnection.query(`USE ${ownDataBase}`, (error) => {
    if(error) {
        if(error.errno == 1049){
            console.log(`${ownDataBase} database does not exist, so we create it ...`);
            mysqlConnection.query(`CREATE DATABASE ${ownDataBase}`, (error) => {
                if(error) {
                    console.log(error);
                 } else {
                    console.log(`the ${ownDataBase} database was created.`);
                    mysqlConnection.query(`USE ${ownDataBase}`, (error) => {
                        if(error) {
                            console.log(error);
                        } else {
                            console.log(`${ownDataBase} DB was selected, creating tables...`);
                            mysqlConnection.query(ownTables, (error) => {
                                if (error){
                                    console.log(error);
                                } else {
                                    console.log("successfully created tables. Creating testing data...");
                                    //generating 10 fakes users
                                    for(i = 0; i < 20; i++) {
                                        //because some faker user names has ' on it I have to remove before sending the value.
                                        let firstName = faker.name.firstName();
                                        let lastName = faker.name.lastName(); //i did not use lastname for the same reason
                                        let fullName = `${firstName} ${lastName}`;
                                        let nickName = firstName;
                                        nickName = nickName.slice(0,4);
                                        nickName += "_";
                                        nickName += faker.datatype.number({'min': 1,'max': 20});
                                        mysqlConnection.query(`INSERT INTO users (user_name, real_name, email, password) VALUES ("${nickName}", "${fullName}", "${faker.internet.email()}", "${faker.internet.password()}")`);
                                    }
                                    //generating 50 fakes images post
                                    for(i = 0; i < 50; i++) {
                                        let imagePath = path.join(__dirname, '../uploads', `${i}.jpg`);
                                            axios({method: 'get', url: faker.image.imageUrl(), responseType: 'stream',})
                                                .then((response) => {
                                                response.data.pipe(fs.createWriteStream(imagePath));
                                                });

                                        mysqlConnection.query(`INSERT INTO posts (img_url, description, user_id) VALUES ('../uploads/${i}.jpg', '${faker.lorem.sentence()}', '${faker.datatype.number({'min': 1,'max': 20})}')`);
                                    }
                                    //generation 150 fake comments to the image posts
                                    for(i = 0; i < 150; i++) {                                      
                                        mysqlConnection.query(`INSERT INTO comments (comment, post_id, user_id) VALUES ('${faker.lorem.paragraph()}', '${faker.datatype.number({'min': 1,'max': 50})}', '${faker.datatype.number({'min': 1,'max': 20})}')`);
                                    }
                                    console.log("successfully created testing data, enjoy...");
                                }
                            });
                        }
                    });
                 }
            });
        }
        else{
            console.log(error);
        }
        
    } else { 
        console.log(`${ownDataBase} DB was selected`);
    }
});

console.log(`Everything is okey with ${ownDataBase} DB was selected`);
module.exports = mysqlConnection;