const path = require("path");
const express = require("express");
const app = express();
const bp = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const { Connection, Request } = require("tedious");

const router = express.Router();
app.use("/", router); // Register the router
const  bodyParser = require('body-parser');
var cors = require('cors');
router.use(cors());
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }));

router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// function authUser (x){
   
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const jwt = require("jsonwebtoken")

const mysql = require("mysql2");

const config = {
  authentication: {
    options: {
      userName: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    },
    type: 'default',
  },
  server: process.env.MYSQL_HOST,
  options: {
    database: process.env.MYSQL_DATABASE,
    encrypt: true,
  }
};

var connection = new Connection(config);

connection.on('connect', (err) => {
  if (err) console.log(err.message);
  console.log(`Database connected: ${process.env.MYSQL_HOST}`);
});

connection.connect();

// var connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected DB: " + process.env.MYSQL_DATABASE);
// });

app.use(express.static(path.join(__dirname, "public")));

router.get("/", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/Homepage.html"));
});
router.get("/Home", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/Homepage.html"));
});
router.get("/result", function (req, res) {
  // console.log(req.query.search2);
  var se = req.query.search2;
  // res.render(__dirname + "/result.html", {search:se});
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/result.html"),{search:se});
});
router.get("/search", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/Search.html"));
});
router.get("/about", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/About.html"));
});
router.get("/CheckInOut", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/CheckInOut.html"));
});
router.get("/login", function (req, res) {
  
  console.log("req login")
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/login.html"));
});
router.get("/register", function (req, res) {
  console.log("Send a form");
  res.sendFile(path.join(__dirname + "/register.html"));
});
router.get("/admin", function (req, res) {
  
  if(req.session.loggedin){
    res.status(200).sendFile(path.join(__dirname + "/admin.html"));
  }
  else{
    res.send("Please login")
  }
  
});
router.get("/adminPro", function (req, res) {
  // console.log("Send a form");
  res.sendFile(path.join(__dirname + "/adminProduct.html"));
});
router.get("/adminUser", function (req, res) {
  // console.log("Send a form");
  res.sendFile(path.join(__dirname + "/adminUser.html"));
});

router.post('/sentLogin', function(req, res) {
  
	var username = req.body.Username;
	var password = req.body.Password;
  console.log("Username: "+username+" Password: "+password)
  console.log("Access")
	if (username && password) {
		connection.query('SELECT * FROM tbUSer WHERE User_Username = ? AND User_Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				res.redirect('/Home');
			} else {
        connection.query('SELECT * FROM Administrators WHERE Admin_Username = ? AND Admin_Password = ?', [username, password], function(error, results2, fields) {
           if(results2.length > 0){
              
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect('/admin');
              // res.send({ error: false, data: results2, message: 'Acess user ' });
           }
           else{
            // console.log("kuy")
            res.redirect('/login');
           }
        });
			}			
			// res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		// res.end();
	}
});

// router.get("/login/check", function (req, res) {
//   connection.query("SELECT * FROM tbUser ", function (error, results) {
//     if (error) throw error;
//     console.log("Connect");
//     // console.log(results)
//     return res.send({
//       error: false,
//       data: results,
//       message: "tbUser retrieved",
//     });
//   });
// });

// router.get("/login/ad", function (req, res) {
//   connection.query("SELECT * FROM Administrators ", function (error, results) {
//     if (error) throw error;
//     console.log("Connect");
//     // console.log(results)
//     return res.send({
//       error: false,
//       data: results,
//       message: "tbUser retrieved",
//     });
//   });
// });
router.get('/login/:us/:ps',function (req, res){
  var username = req.params.us
  var  password = req.params.ps 
  console.log(username+password+"")
  connection.query('SELECT * FROM tbUser WHERE User_Username = ? AND User_Password = ?', [username, password], function (error, results) {
    if (results.length > 0) {
      return res.send({ error: false, data: results, message: 'U' });
    }
    else{
      connection.query('SELECT * FROM Administrators WHERE Admin_Username = ? AND Admin_Password = ?', [username, password], function (error, results2) {
        if (results2.length > 0) {
          return res.send({ error: false, data: results2, message: 'A' });
        }
      });
    }
    
    
});
});

router.get('/result_all',cors(), function (req, res) {
  connection.query('SELECT rooms_Name,rooms_Description,rooms_Price,rooms_Stock,rooms_Image FROM rooms', function (error, results) {
      if (error) throw error;
      console.log(results);
      return res.send({ error: false, data: results, message: 'Select all rooms ' });
  });
});

router.get('/result/:name',cors(), function (req, res) {
  let product_name = req.params.name;
  console.log(product_name);
  if (!product_name) {
      return res.status(400).send({ error: true, message: 'Please provide product name' });
  }
  connection.query(`SELECT * FROM rooms where rooms_Name LIKE '%${product_name}%' or rooms_Description LIKE '%${product_name}%'`, function (error, results) {
      if (error) throw error;
      console.log(results);
      if (results.length > 0) {
          return res.send({ error: false, data: results, message: 'Result of rooms' });
      }
      else {
          connection.query('SELECT * FROM rooms', function (error, results) {
              if (error) throw error;
              console.log("Juakuy");
              console.log(results);
              return res.send({ error: false, data: results, message: 'No product' });
          });
      }
  });
});


router.get('/all', function (req, res) {
  connection.query('SELECT * FROM product', function (error, results) {
      if (error) throw error;
      // console.log(results)
      // console.log(results);
      // console.log('products')
      return res.send({ error: false, data: results, message: 'Student list.' });
  });
});

router.get('/allUser', function (req, res) {
  connection.query('SELECT * FROM tbUser', function (error, results) {
      if (error) throw error;
      // console.log(results)
      // console.log(results);
      return res.send({ error: false, data: results, message: ' list.' });
  });
});


router.delete('/delete', function (req, res) {
  let product_id = req.body.product_Id;
  if (!product_id) {
      return res.status(400).send({ error: true, message: 'Please provide productID' });
  }
  console.log("deleted")
  connection.query('DELETE FROM product WHERE product_Id = ?', [product_id], function (error, results) {
      if (error) throw error;
      console.log('delete')
      return res.send({
          error: false, data: results.affectedRows, message: 'Student has been deleted successfully.'
      });
  });
});
router.delete('/deleteUser', function (req, res) {
  let User_Id = req.body.User_Id;
  if (!User_Id) {
      return res.status(400).send({ error: true, message: 'Please provide StudentID' });
  }
  connection.query('DELETE FROM tbUser WHERE User_Id = ?', [User_Id], function (error, results) {
      if (error) throw error;
      return res.send({
          error: false, data: results.affectedRows, message: 'User has been deleted successfully.'
      });
  });
});

router.get('/all/:product_Id', function (req, res) {
  let product_Id = req.params.product_Id;
  console.log(product_Id);
  if (!product_Id) {
      return res.status(400).send({ error: true, message: 'Please provide student id.' });
  }
  connection.query('SELECT * FROM product where product_Id=?', product_Id, function (error, results) {
      if (error) throw error;
      console.log(results)
      return res.send({ error: false, data: results[0], message: 'product retrieved' });
  });
});

router.get('/allUser/:User_Id', function (req, res) {
  let User_Id = req.params.User_Id;
  console.log(User_Id);
  if (!User_Id) {
      return res.status(400).send({ error: true, message: 'Please provide User id.' });
  }
  connection.query('SELECT * FROM tbUser where User_Id=?', User_Id, function (error, results) {
      if (error) throw error;
      
      return res.send({ error: false, data: results[0], message: 'User retrieved' });
  });
});

router.post('/insert', function (req, res) {
  let product = req.body.product;
  // console.log(student);
  if (!product) {
      return res.status(400).send({ error: true, message: 'Please provide studentinformation' });
  }
  connection.query("INSERT INTO product SET ? ", product, function (error, results) {
      if (error) throw error;
      console.log("Yes")
      return res.send({ error: false, data: results.affectedRows, message: 'New product has beencreated successfully.' });
  });
});

router.post('/insertUser', function (req, res) {
  let user = req.body.user;
  // console.log(student);
  if (!user) {
      return res.status(400).send({ error: true, message: 'Please provide studentinformation' });
  }
  connection.query("INSERT INTO tbUser SET ? ", user, function (error, results) {
      if (error) throw error;
      return res.send({ error: false, data: results.affectedRows, message: 'New User has beencreated successfully.' });
  });
});

router.put('/update', function (req, res) {
  let product_id = req.body.product.product_Id;
  let product = req.body.product;
  if (!product_id|| !product) {
      return res.status(400).send({ error: student, message: 'Please provide student information' });
  }
  connection.query("UPDATE product SET ? WHERE product_id = ?", [product, product_id], function (error,
      results) {
      if (error) throw error;
      return res.send({ error: false, data: results.affectedRows, message: 'Student has been updated successfully.' })
  });
});
router.put('/updateUser', function (req, res) {
  let User_Id = req.body.user.User_Id;
  let user = req.body.user;
  if (!User_Id|| !user) {
      return res.status(400).send({ error: student, message: 'Please provide student information' });
  }
  connection.query("UPDATE tbUser SET ? WHERE User_Id = ?", [user, User_Id], function (error,
      results) {
      if (error) throw error;
      return res.send({ error: false, data: results.affectedRows, message: 'Student has been updated successfully.' })
  });
});
router.get('/detail/:name', cors(), function (req, res) {
  let id = req.params.name;
  console.log(id);
  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide product name' });
  }
  connection.query(`SELECT * FROM product where product_Id = '${id}'`,
    function (error, results) {
      if (error) throw error;
      console.log(results)
      return res.send({ error: false, data: results, message: 'Detail of the product' });
    });
});
app.listen(process.env.PORT, function () {
  console.log("Server listening at Port " + process.env.PORT);
});
