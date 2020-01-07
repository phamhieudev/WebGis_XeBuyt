var express = require ("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var pg= require('pg');

var config = {
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: '5432',
    database: 'test',
    max: 10,
    idleTimeoutMillis: 3000,
  };
  
  var pool = new pg.Pool(config);
  

//tram là sinh viên
app.get("/tram/list", function(req, res){
    pool.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT * FROM tramxebus_font_point ORDER BY id ASC', (err, result) => {
          release()
          if (err) {
              res.end();
            return console.error('Error executing query', err.stack)
          }
          // console.log(result.rows);
          res.render("tram_list.ejs",{danhsach:result});        
        });
      });
      // res.render("tram_list.ejs");
   
});

/// THÊM ///
app.get("/tram/them", function(req, res){
  res.render("tram_insert.ejs");

});
app.post("/tram/them", urlencodedParser, function(req, res){
  //txttram txtghichu  txttoado
  // var tram = res.body.txttram;
  // var tram = res.body.txtghichu;
  // var tram = res.body.txttoado;

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var tram = req.body.txttram;
    var ghichu = req.body.txtghichu;
    var tdx = req.body.txttoadox;
    var tdy = req.body.txttoadoy;
    client.query("insert into tramxebus_font_point (geom,tentram,ghichu) values ('SRID=4326;POINT("+tdx+" "+tdy+")','"+tram+"','"+ghichu+"')", (err, result) => {
      release()
      if (err) {
          res.end();
        return console.error('Error executing query', err.stack)
      }
      // console.log(result.rows);
      //res.render("tram_list.ejs",{danhsach:result});
      
      // res.send("Insert Thành Công");  
      // alert("Thêm thành công");  
      res.redirect("../tram/list");

    });
  });

  //res.send("Insert Thành Công");
});

/// SỬA ///
app.get("/tram/sua/:id",function(req, res){
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var id=req.params.id;
    client.query("SELECT id, ST_X(geom::geometry), ST_Y(geom::geometry),tentram,ghichu FROM tramxebus_font_point where id='"+id+"'", (err, result) => {
      release()
      if (err) {
          res.end();
        return console.error('Error executing query', err.stack)
      }
      // console.log(result.rows[0]);
       res.render("tram_edit.ejs",{tram:result.rows[0]});        
    });
  });
  // res.render("tram_edit.ejs");
});

app.post("/tram/sua",urlencodedParser, function(req, res){

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var id=  req.body.txtid;
    var tram = req.body.txttram;
    var ghichu = req.body.txtghichu;
    var tdx = req.body.txttoadox;
    var tdy = req.body.txttoadoy;
    client.query("UPDATE tramxebus_font_point SET geom='SRID=4326;POINT("+tdx+" "+tdy+")', tentram='"+tram+"', ghichu='"+ghichu+"' WHERE id='"+id+"'", (err, result) => {
      release()
      if (err) {
          res.end();
        return console.error('Error executing query', err.stack)
      }
      // console.log(result.rows);
      //res.render("tram_list.ejs",{danhsach:result});
      
      // res.send("Insert Thành Công");  
      // alert("Thêm thành công");  
      res.redirect("../tram/list");

    });
  });

  //res.send("Insert Thành Công");
});

app.get("/tram/xoa/:id", function(req, res){
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    var id=  req.params.id;
    client.query("DELETE FROM tramxebus_font_point WHERE id='"+id+"'", (err, result) => {
      release()
      if (err) {
          res.end();
        return console.error('Error executing query', err.stack)
      }
     
      res.redirect("../../tram/list");

    });
  });
});
app.get("/", function(req, res){
    res.send("Hello");
});