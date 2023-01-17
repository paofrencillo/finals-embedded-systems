const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors')
const sessions = require('express-session')
const cookieParser = require("cookie-parser");
const app = express();
const port = 4000;
const persons_table = "persons";
const captures_table = "captures"
var session;

// listen to port
app.listen(port);

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "finals_cpet17", //change this into custom database name
});

// throw error if connection failed
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use cors
app.use(cors());

// cookie parser middleware
app.use(cookieParser());

// app session 
app.use(sessions({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000 },
}))

// User Registration
app.post('/post-register', async(req, res)=> {
    const username = req.body.username
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        connection.query(`INSERT INTO ${persons_table} (username, password) VALUES (?, ?);`,
        [username, hash],
        (err, result)=> {
            console.log(result)
            try {
                res.json({ username: req.body.username });
            } catch {
                res.json({ error_code: err.code, message: "Username has already been registered" });
            }
          }
        )  
    });
});

// User Login
app.post('/post-login', async(req, res)=> {
    const username = req.body.username;
    console.log(username)
    const password = req.body.password;

    connection.query(`SELECT * FROM ${persons_table} WHERE username=?`,
    [username],
    (err, results)=> {
        try {
            if ( results == [] ) {
                res.json({message: "Username doesn't exists"});
            } else {
                bcrypt.compare(password, results[0].password, function(err, result) {
                    if ( err ) throw err;
                    if ( result == true ) {
                        session = req.session;
                        session.loggedin = true;
				        session.username = username;
                        console.log(`${req.session.username} ?????????`)
                        console.log(session)
                        
                        res.json({message: 'Success'});
                    } else {
                        res.json({message: 'Wrong Password', comment: 'Wrong password'});
                    }
                })
            }
        } catch {
            res.json({message: 'Error', comment: err});
        }
    });
});

app.get('/', (req, res)=> {
    if ( session == undefined ) {
        res.json({redirect_home: "no"});
        res.end()
    } 

    if ( session != undefined ) {
        res.redirect("http://localhost:3000/home")
    }
        
    
    // if ( session.loggedin == true ) {
    //     
    // } else {
    //     res.json({redirect_home: "no"});
    // }

    // res.send("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	// // If the user is loggedin
    // console.log(req.session.loggedin)
	// if (req.session.loggedin) {
	// 	// Output username
		// res.json('Welcome back, ' + req.session.username + '!');
	// } else {
	// 	// Not logged in
	// 	res.json('Please login to view this page!');
	// }
});


// Save datetime and image to database
app.post('/capture', (req, res)=> {
  // get the request json
  var { dateTime, path } = req.body;

  // save datetime, imgfile, into the db
  connection.query(`INSERT INTO ${db_table} (date_time, img) VALUES (?, ?);`,
  [dateTime, path],
  (err, result)=> {
    try {
      if (result.affectedRows > 0) {
        res.json({ data: "Success" });
      } else {
        res.json({ message: "Something went wrong." });
      }
    } catch {
      res.json({ message: err });
    }
  })
})

// Fetch data
app.get('/show-images', (req, res)=> {
  // Select the last entry from the db
  let array = [];
  connection.query(`SELECT * FROM ${db_table} ORDER BY id DESC LIMIT 10;`,
  (err, results)=> {
      try {
          if (results.length > 0) {
            for ( i=0; i<results.length; i++ ) {
              array.unshift(results[i])
            }
            // send a json response containg the image data (blob)
            res.json({'imgData': array});
      } else {
        res.json({ message: "Something went wrong." });
      }
      } catch {
          res.json({ message: err });
      }
  })
})