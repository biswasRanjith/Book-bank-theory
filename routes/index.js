var express = require('express');
var router = express.Router();
var http = require("http");
var app = express();
var bodyParser = require('body-parser');
var express = require('cookie-parser');
var session = require('express-session');
var con = require('../model/db_connect');
var buffer = require('buffer');


router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

    cookie: {
        maxAge: 600000
    }
}));

/* GET home page. */
router.get('/', (req, res) => {
    console.log('heloooo')
    var sql = "Select * from book order by BookId desc limit 30";
    con.query(sql, (err, rows) => {
        console.log(rows);
        if (err) throw err;
        res.render('home', { data: rows});
    });
});

router.get('/index', (req, res) => {
    if (req.session.UserId) {
        var sql = "Select * from book order by BookId desc limit 30";

        con.query(sql, (err, rows) => {
            if (err) throw err;

            res.render('index', { data: rows });
        });
    }
});

router.get('/allbooks', (req, res) => {
        var sql = "Select * from book";

        con.query(sql, (err, rows) => {
            if (err) throw err;
            res.render('allbooks', { data: rows });
        });
});

router.get('/categories', (req, res) => {
    var sql = "Select distinct BookCategory from book";

    con.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('categories', { data: rows });
    });
});

router.get('/admin', (req, res) => {
    console.log('heloooo')
    var sql = "Select * from book b, user u where b.BookId=u.UserId";
    var sql1 = "Select * from user";
    con.query(sql, sql1, (err, rows) => {
        console.log('heloooo')
        console.log(rows);
        if (err) throw err;
        res.render('home')
    });
});

router.get('/adminlogin', function(req, res, next) {
    res.render('adminlogin');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});


router.get('/logout', function(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

router.get('/yourbook', function(req, res, next) {
    if (req.session.UserId) {
        userId = req.session.UserId;
        var sql = "Select * from book where UserId =  " + userId;
        con.query(sql, (err, rows) => {
            console.log(rows);
            if (err) throw err;
            res.render('yourbook', { data: rows })
        });
    } else {
        res.render('login');
    }
});

router.get('/register', function(req, res, next) {
    if (req.session.UserId) {
        res.render('logout');
    } else {
        res.render('register');
    }

});

router.get('/sellbook', function(req, res, next) {
    if (req.session.UserId) {
        res.render('sellbook', { data: req.session.UserId });
    } else {
        res.render('login');
    }
});

router.get('/wishlist', function(req, res, next) {
    if (req.session.UserId) {
        var UserId = req.session.UserId;
        console.log('heloooo')
        var sql = "SELECT BookId, BookName, BookAuthor, BookPrice FROM book WHERE BookId IN (SELECT BookID FROM wishlist WHERE UserID = ?)";

        con.query(sql, UserId, (err, rows) => {
            console.log(rows);
            console.log("ok...");
            if (err) throw err;
            res.render('wishlist', { data: rows })
        });

    } else {
        res.render('login');
    }
});
router.get('/product:BookId', function(req, res) {

    if (req.session.UserId) {
        con.query('select * from book where BookId=?', [req.params.BookId], function(err, result) {
            if (err) throw err;
            else {
                res.render('product', { data: result[0] });
            }
        });
    } else {
        res.render('login');
    }
});

router.get('/category:BookCategory', function(req, res) {

        con.query('select * from book where BookCategory=?', [req.params.BookCategory], function(err, result) {
            if (err) throw err;
            else {
                res.render('booksbycategory', { data: result });
            }
        });
    
});

router.get('/profile', function(req, res, next) {
    if (req.session.UserId) {
        userId = req.session.UserId;
        var sql = "Select * from user where UserId =  " + userId;
        con.query(sql, (err, rows) => {
            console.log(rows);
            if (err) throw err;
            res.render('profile', { data: rows });
        });
    } else {
        res.render('login');
    }
});

router.get('/about', function(req, res, next) {
    res.render('about');
});

router.get('/contact', function(req, res, next) {
    res.render('contact');
});

// router.get('/showUserDetails:BookId', showdataRouter);

// function showdataRouter(req, res, next) {
//     console.log('hellooooooo');
//     // if (req.session.UserId) {
//     //     userId = req.session.UserId;

//     console.log('inside Router');
//     console.log(req.body);
//     con.getConnection(function(err) {
//         console.log('stage1----' + req.body)
//             // var arrval = [req.body.FirstName, req.body.LastName, req.body.MobileNumber, req.body.EmailId, req.body.Password, req.body.Address, ]
//             // var sql = "UPDATE user SET ? where UserId=" + userId;

//         con.query('SELECT FirstName, LastName, MobileNumber, Address from user where UserId = ( SELECT UserId from book where BookId = ? )', [req.body.BookId], function(err, results, fields) {
//             if (err) throw err;
//             console.log("updated");
//             res.send({
//                 "status": 201,
//                 "body": results
//             })

//         });
//     });

// }

router.get('/showUserDetails:BookId', function(req, res) {
    if (req.session.UserId) {
        con.query('SELECT FirstName, LastName, MobileNumber, Address from user where UserId = ( SELECT UserId from book where BookId = ? )', [req.params.BookId], function(err, result) {
            if (err) throw err;
            else {
                res.render('product', { data: result[0] });
            }
        });
    } else {
        res.render('login');
    }
});




module.exports = router;