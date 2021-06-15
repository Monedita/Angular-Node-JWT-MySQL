var express = require('express');
var bodyParser  = require("body-parser");
var router = express.Router();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var privateKey = fs.readFileSync('private.key');

const mysqlConnection = require('./database');


router.post('/login', async function (req, res, next) {
    try {
        let { email, password } = req.body;
        const hashed_password = md5(password.toString())
        const sql = `SELECT * FROM users WHERE email = ?`
        mysqlConnection.query(sql, [email],
        function(err, result, fields){
            if(err){
                res.send({ status: 0, data: err });
            } else {
                if (result.length > 0) {
                    if (hashed_password == result[0].password) {
                        const payload = {
                            algorithm: 'RS256',
                            expiresIn: 300,
                            id: result[0].id,
                            user_name: result[0].user_name,
                            };
                        let token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
                        res.send({ status: 200, payload, token: token });
                    }
                    else {
                        res.send({ status: 401, error: err }); 
                    }
                }
                else {
                    res.send({ status: 401, error: err }); 
                }
            }    
        })
    } catch (error) {
        res.send({ status: 401, error: err });
    }
});

router.post('/register', async function (req, res, next) {
    try {
        let { email, real_name, user_name, password } = req.body;
        const hashed_password = md5(password.toString())
        const checkEmail = `Select * FROM users WHERE email = "${email}"`;
        mysqlConnection.query(checkEmail, (err, result, fields) => {
            if (result.length > 0){
                console.log('el usuario YA esta registrado');
            } else {
                console.log('el usuario NO esta registrado, entonces lo registro');
                const sql = `Insert Into users (email, real_name, user_name, password) VALUES ( ?, ?, ?, ? )`;
                mysqlConnection.query(sql, [email, real_name, user_name, hashed_password],(err, result, fields) =>{
                    if(err){
                        res.send({ status: 0, data: err });
                    }else{
                        const payload = {
                            algorithm: 'RS256',
                            expiresIn: 300,
                            id: result.insertId,
                            user_name: user_name,
                           };
                        let token = jwt.sign(payload, privateKey, { algorithm: 'RS256' })
                        res.send({ status: 1, payload, token : token });
                    }
                })
            }
        });
    } catch (error) {
        res.send({ status: 0, error: error });
    }
});

module.exports = router;