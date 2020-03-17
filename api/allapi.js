var express = require('express');
var router = express.Router();
var http = require("http");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var con = require('../model/db_connect');

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

    cookie: {
        maxAge: 6000000
    }
}));

/* REGISTER API */
router.post('/register', registerRouter);

function registerRouter(req, res, next) {
    console.log('inside registerrouter');
    console.log(req);
    con.getConnection(function(err) {
        console.log('stage1----' + req.body)
        var arrval = [req.body.FirstName, req.body.LastName, req.body.MobileNumber, req.body.EmailId, req.body.Password, req.body.Address, ]
        var sql = "INSERT INTO user(FirstName,LastName,MobileNumber,EmailId,Password,Address) VALUES (?,?,?,?,?,?);";
        // if (err) throw err;

        con.query(sql, arrval, function(err, result) {
            if (err) throw err;
            console.log("Record added");
            console.log(res);
            res.send({
                "status": 201,
                "body": result
            });
        });
    });
}


router.post('/login', loginRouter);

function loginRouter(req, res, next) {
    console.log('login------')
    console.log(req.body)

    //session 
    //exports.login = function(req,res){
    var emailId = JSON.stringify(req.body.EmailId);
    req.session.EmailId = req.body.EmailId;
    var Password = req.body.Password;
    console.log(emailId)
    var sql = 'SELECT * FROM user WHERE EmailId = ' + emailId;
    con.query(sql, function(error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('The solution is: ', results);
            if (results.length > 0) {
                if (results[0].Password == Password) {
                    console.log(results[0].UserId);
                    req.session.UserId = results[0].UserId;

                    console.log("session details", req.session);

                    res.send({
                        "UserId": req.session.UserId,
                        "EmailId": req.session.EmailId,
                        "status": 200,
                        "message": "login sucessfull"
                    });
                } else {
                    res.send({
                        "status": 204,
                        "message": "username and password does not match"
                    });
                }
            } else {
                res.send({
                    "status": 204,
                    "message": " Invalid"
                });
            }
        }
    });
}



router.post('/sellbook', sellbookRouter);

function sellbookRouter(req, res, next) {
    if (req.session.UserId) {

        console.log('inside sellbookrouter');
        console.log(req);
        con.getConnection(function(err) {
            console.log('stage1----' + req.body)
            var arrval = [req.body.BookName, req.body.BookAuthor, req.body.BookCategory, req.body.BookDescription, req.body.BookPrice, req.body.BookMrp, req.body.BookImage1, req.body.UserId]
            var sql = "INSERT INTO book(BookName,BookAuthor,BookCategory,BookDescription,BookPrice,BookMrp,BookImage1,UserId) VALUES (?,?,?,?,?,?,?,?);";
            // if (err) throw err;

            con.query(sql, arrval, function(err, result) {
                if (err) throw err;
                console.log("Record added");
                console.log(res);
                res.send({
                    "status": 201,
                    "body": result
                });
            });
        });
    } else {
        res.render('login')
    }
}

router.post('/wishlist', wishlistRouter);

function wishlistRouter(req, res, next) {
    if (req.session.UserId) {

        console.log('inside Wishlistrouter');
        console.log(req);

        con.getConnection(function(err) {
            console.log('stage1----' + req.body)
            var arrval = [req.body.BookId, req.session.UserId]
            var sql = "INSERT INTO wishlist(BookId, UserId) VALUES (?,?);";
            // if (err) throw err;

            con.query(sql, arrval, function(err, result) {
                if (err) throw err;
                else {
                    console.log("Record added wishlist");
                    console.log(res);
                    res.send({
                        "status": 201,
                        "body": result
                    });
                }
            });
        });
    } else {
        res.render('login')
    }
}


router.put('/updateUser', updateUserRouter);

function updateUserRouter(req, res, next) {
    console.log('hellooooooo');
    if (req.session.UserId) {
        userId = req.session.UserId;
        console.log('inside updateUserRouter');
        console.log(req.body);
        con.getConnection(function(err) {
            console.log('stage1----' + req.body)
                // var arrval = [req.body.FirstName, req.body.LastName, req.body.MobileNumber, req.body.EmailId, req.body.Password, req.body.Address, ]
                // var sql = "UPDATE user SET ? where UserId=" + userId;

            con.query('UPDATE user SET `FirstName`=?,`LastName`=?,`MobileNumber`=?,`EmailId`=?,`Password`=?,`Address`=? where `UserId`=?', [req.body.FirstName, req.body.LastName, req.body.MobileNumber, req.body.EmailId, req.body.Password, req.body.Address, req.session.UserId], function(err, results, fields) {
                if (err) throw err;
                console.log("updated");
                res.send({
                    "status": 201,
                    "body": results
                })

            });
        });
    } else {
        res.render('login')
    }
}



//delete

router.delete('/remove', deleteyourbook);

function deleteyourbook(req, res, next) {
    if (req.session.UserId) {
        con.getConnection(function(err) {
            console.log('stage1----' + req.body.BookId)

            con.query('DELETE FROM `book` WHERE `BookId`=?', [req.body.BookId], function(err, results, fields) {
                if (err) throw err;
                console.log("deleted");
                console.log(results);
                res.send({
                    "status": 201,
                    "body": results
                })

            });
        });
    } else {
        res.render('login')
    }
}

router.delete('/removeWishlist', deletebook);

function deletebook(req, res, next) {
    if (req.session.UserId) {
        userId = req.session.UserId;
        console.log('inside removeWishlistRouter');
        console.log(req);
        con.getConnection(function(err) {
            console.log('stage1----' + req.body)

            con.query('DELETE FROM `wishlist` WHERE `BookId`=? AND `UserId`=?', [req.body.BookId, userId], function(err, results, fields) {
                if (err) throw err;
                console.log("deleted");
                res.send({
                    "status": 201,
                    "body": results
                })

            });
        });
    } else {
        res.render('login')
    }
}




module.exports = router;