//express
const express = require('express');//paquete instalado
const router = express.Router();
const axios = require('axios');//paquete instalado

//mysql
const mysqlConnection = require('./database'); //Connects to the database

//JWT Tokens
const jwt = require('express-jwt'); //auth JWTs token middleware
const jwt_decode = require('jwt-decode'); //read JWT token
var fs = require('fs');
var privateKey = fs.readFileSync('private.key');

//Upload Files
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
  })
   
  var upload = multer({ storage: storage })


//auth middleware line to add to the routes
//jwt({ secret: 'secret', algorithms: ['RS256'], }), 

 
//Get newer posts
router.get('/posts', (req, res) =>{
    mysqlConnection.query('SELECT posts.*, users.user_name FROM posts LEFT JOIN users ON posts.user_id = users.id', (error, rows, fields) => {
        if (error) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

//Get especific post with the user_name and his comments
router.get('/post/:postId', jwt({ secret: privateKey, algorithms: ['RS256'], }), (req, res) =>{
    const {postId} = req.params;
    const object = {};
    mysqlConnection.query('SELECT posts.*, users.user_name FROM posts LEFT JOIN users ON posts.user_id = users.id WHERE posts.id = ?', [postId], (error, rows, fields) => {
        if (error) {
            console.log(error);
        } else {
            this.object = rows[0];
            //res.json(rows);
            mysqlConnection.query('SELECT comments.*, users.user_name FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE post_id = ?', [postId], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    this.object.comments = rows;
                    res.json(this.object);
                }
            });
        }
    });
});

//Get especific post with the user_name and his comments
router.post('/post/:postId/postComment', jwt({ secret: privateKey, algorithms: ['RS256'], }), (req, res) =>{
    //var token = req.headers.authorization;
    //var decodedToken = jwt_decode(token);
    const { postId } = req.params;
    const { comment } = req.body;
    const token = req.headers.authorization;
    const decodedToken = jwt_decode(token);
    mysqlConnection.query(`INSERT INTO comments (comment, post_id, user_id) VALUES ('${comment}', '${postId}', '${decodedToken.id}')`, (error, rows, fields) => {
        if (error) {
            console.log(error);
        } else {
            res.send({ status: 1, rows });
        }
    });
    
});

//Upload a new picture and create a new post
router.post('/post/create', jwt({ secret: privateKey, algorithms: ['RS256'], }),
upload.fields([{ name: 'image', maxCount: 1 }, { name: 'description', maxCount: 8 }]), (req, res) =>{

    const uploadedFile = req.files['image'];
    //IMPORTANT: when multer intercept non file fields passes it to the body
    const description = req.body.description;
    const token = req.headers.authorization;
    const decodedToken = jwt_decode(token);
    const dateMilisec = Date.now();
    const filename = req.files['image'][0].filename;
    
    //posting the created file into the databese posts
    mysqlConnection.query(`INSERT INTO posts (img_url, description, user_id) VALUES ('${'../uploads/'+filename}','${description}', '${decodedToken.id}')`, (error, rows, fields) => {
        if (error) {
            console.log(error); 
        } else {
            res.send({ status: 1, rows });
        }
    });

});

//Get user posts
router.get('/user/:userName', jwt({ secret: privateKey, algorithms: ['RS256'], }), (req, res) => {
    const {userName} = req.params;
    mysqlConnection.query('SELECT * FROM users LEFT JOIN posts ON users.id = posts.user_id WHERE user_name = ?', [userName], (error, rows, fields) => {
        if (error) {
            console.log(error);
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;

/*
//create user
router.post('/users', (req, res) =>{
    const { id, user_name, real_name, email, password } = req.body;
    mysqlConnection.query(`CALL processAddOrEditUser(?, ?, ?, ?, ?)`, [id, user_name, real_name, email, password], (error, rows, fields) => {
        if (error){
            console.log(error);
        } else {
            res.json({Status: 'User Saved'});
        }
    });
});

//modify user
router.put('/users/:id', (req, res) =>{
    const {id} = req.params;
    const { user_name, real_name, email, password } = req.body;
    mysqlConnection.query(`CALL processAddOrEditUser(?, ?, ?, ?, ?)`, [id, user_name, real_name, email, password], (error, rows, fields) => {
        if (error){
            console.log(error);
        } else {
            res.json({Status: 'User Updated'});
        }
    });
});

//user delete
router.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM employees WHERE id=?', [id], (error, rows, fields) => {
        if (error){
            console.log(error);
        } else {
            res.json({Status: 'User Deleted'});
        }
    });
});
*/