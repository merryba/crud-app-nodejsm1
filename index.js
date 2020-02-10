//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');

const multer = require('multer');
//use mysql database
const mysql = require('mysql');
const app = express();
const fs = require('fs-extra');

const winston = require('winston')


const mime    =   require('mime');
const port =process.env.PORT || 8000;

//Create Connection
const conn = mysql.createConnection({
  host: 'us-iron-auto-dca-05-b.cleardb.net',
  user: 'baa26e88cf9895',
  password: '7c9a2eb7',
  database: 'heroku_91a42d1f73b62f7'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

let UPLOAD_LOCATION = path.join(__dirname, 'images');
fs.mkdirsSync(UPLOAD_LOCATION); 
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, UPLOAD_LOCATION);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
  }
});

let upload = multer({storage: storage});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

//route for insert data
app.post('/save',upload.single('userPic'),(req, res) => {




//const upload = multer({ storage : storage }).array('userPic');
//winston.log('info', 'Hello log files!', {
//  path: req.file.filename, product_name: req.body.product_name, product_price: req.body
//})
var imageData = fs.readFileSync(req.userPic.path);
  let data = {product_name: req.body.product_name, product_price: req.body.product_price, image :imageData};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});



//server listening
app.listen(port, () => {
  console.log('Server is running at port 8000');
});
