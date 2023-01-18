const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors')
const sessions = require('express-session')
const { PythonShell } = require('python-shell')
const app = express();
const port = 5000;
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
  const password = req.body.password;
  
  connection.query(`SELECT * FROM ${persons_table} WHERE username=?`,
  [username],
  (err, results)=> {
    console.log(results)
      try {
          if ( results == [] ) {
              res.json({message: "Username doesn't exists"});
          } else {
              bcrypt.compare(password, results[0].password, function(err, result) {
                  if ( err ) throw err;
                  if ( result == true ) {
                    session = req.session;
                    session.logged_in = true;
                    session.username = username;
                    console.log(`current session =  ${session.logged_in}`);   
                    res.json({message: 'Success'});  
                  } else {
                      res.json({message: 'Wrong Password', comment: 'Wrong password'});
                  }
              })
          }
      } catch {
          res.json({message: "Username doesn't exist.", comment: err});
      }
  });
});

// User Reset Password
app.post('/post-resetpass', async(req, res)=> {
  const username = session.username;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  console.log(new_password)
  
  connection.query(`SELECT * FROM ${persons_table} WHERE username=?`,
  [username],
  (err, results)=> {
      try {
          if ( results == [] ) {
              res.json({message: "Username doesn't exists"});
          } else {
            // Check if user password was correct
            bcrypt.compare(old_password, results[0].password, function(err, result) {
              if ( err ) throw err;
              if ( result == true ) {
                // If user password was correct, hash the new password and update to database
                bcrypt.hash(new_password, saltRounds, function(err, hash) {
                  connection.query(`UPDATE ${persons_table} SET password=? WHERE username=?;`,
                  [hash, username],
                  (err, result)=> {
                    try {
                      res.json({ message: 'Success' });
                    } catch {
                      res.json({ error_code: err.code, message: "Try again." });
                    }
                  });
                });
              } else {
                  res.json({message: 'Wrong Password', comment: 'Wrong password'});
              }
            });
      }
          
      } catch {
          res.json({message: 'Error', comment: err});
      }
  });
});

// Save datetime and image to database
app.post('/post-motion', (req, res)=> {
  // get the request json
  var { captured_on, captured_image } = req.body;

  // save datetime, imgfile, into the db
  connection.query(`INSERT INTO ${captures_table} (captured_on, captured_image) VALUES (?, ?);`,
  [captured_on, captured_image],
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

app.get('/', (req, res)=> {
  if ( session == undefined ) {
    res.json({is_logged_in: false});
  } else if ( session != undefined ) {
    res.json({is_logged_in: true});
  }
});

app.get('/signup', (req, res)=> {
  console.log(session)
  if ( session == undefined ) {
    res.json({is_logged_in: false});
  } else if ( session != undefined ) {
    res.json({is_logged_in: true});
  }
});

app.get('/home', (req, res)=> {
  if ( session == undefined ) {
    res.json({is_logged_in: false});
  } else if ( session != undefined ) {
    res.json({is_logged_in: true});
  }
});

app.get('/resetpass', (req, res)=> {
  if ( session == undefined ) {
    res.json({is_logged_in: false});
  } else if ( session != undefined ) {
    res.json({is_logged_in: true});
  }
});

app.get('/motion', (req, res)=> {
  if ( session == undefined ) {
    res.json({is_logged_in: false});
  } else if ( session != undefined ) {
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
  }
});

app.get('/logout', (req, res)=> {
  session = undefined;
  res.redirect('http://localhost:3000');
});

// Fetch data
app.get('/motion', (req, res)=> {
  let pyshell = new PythonShell('../camera/app.py')
  pyshell.kill()

  PythonShell.run('../camera/app.py', null, function (err) {
    if (err) {
      throw err
    }
    console.log('Motion Detector Terminated');
  });
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
        res.json(null);
      }
      } catch {
          res.json({ message: err });
      }
  });
});