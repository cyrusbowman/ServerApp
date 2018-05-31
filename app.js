/**Declaring Fields*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jp = bodyParser.json();
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'mywayxchange.c6a9uahoc7um.us-east-1.rds.amazonaws.com',
    user : 'kyle',
    password : 'kyletest',
    database : 'myway_kyle'
  },
  pool: {min: 0, max: 7}
});

/**Using bodyParser*/
app.use(jp);

/**Home Endpoint*/
app.get('/', (req, res) => {
  //Sending response
  res.send("This is the home page");
});

/**Inventory Endpoint*/
app.get('/inventory', (req, res) => {
  //Checking array
  return checkDatabase().then((result) => {
    if (result === false){
      //Sending response
      res.send("The inventory is empty!");
    } else {
      //Getting database rows
      /*
        Kyle,
        Must return the knex promise here so function doesn't return before getting
        the rows from the database.
      */
      return knex.select().from('inventory').then((rows) => {
        res.send(rows);
      });
    }
  });
});

/**Inventory Post Endpoint*/
app.post('/inventory', (req, res) => {
  //Posting to database
  knex('inventory').insert({
    ID: '1',
    VIN: req.body.vin,
    Style: req.body.style,
    Make: req.body.make,
    Model: req.body.model,
    Year: req.body.year,
    Miles: req.body.miles,
    Color: req.body.color
  }).then(
    () => {
      //Sending response
      res.send("Vehicle added to database");
    }
  );
});

/**Listening on Port 3000*/
app.listen(3000, () => console.log("Listening on port 3000!"));

/**checkDatabase Function*/
checkDatabase = () => {
  //Getting database
  /*
    Kyle, all knex methods return promises, so in order to
  */
  return knex.select().from('inventory').then((rows) => {
    if (rows.length === 0) {
      //Returning false
      return false;
    } else {
      //Returning true
      return true;
    }
  });
}
