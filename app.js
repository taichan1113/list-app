const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('port', (process.env.PORT || 3000));

var db_config = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bbd7861425ff0a',
  password: 'ddb27741',
  database: 'heroku_304847af8f42339'
};
var connection;

handleDisconnect = ()=> {
  console.log('INFO.CONNECTION_DB: ');
  connection = mysql.createConnection(db_config);

  connection.connect((err) => {
    if (err) {
      console.log('ERROR.CONNECTION_DB: ', err);
      setTimeout(handleDisconnect, 1000);
    }
  });

  connection.on('error', (err) => {
    console.log('ERROR.DB: ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('ERROR.CONNECTION_LOST: ', err);
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// connection = mysql.createConnection(db_config);
// connection.connect();


dateNull = (date) => {
  if (date) {
    return date;
  }
  else {
    return null;
  }
};


app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM food ORDER BY expirationDate ASC, expirationType IS NULL ASC, expirationType ASC',
    (error, results) => {
      res.render('top.ejs', {items: results, url: req.url});
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'delete from food where id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
});

app.post('/add', (req, res) => {
  connection.query(
    'insert into food (name, purchaseDate, expirationDate, expirationType) values (?, ?, ?, ?)',
    [req.body.itemName, dateNull(req.body.itemPurchaseDate), dateNull(req.body.itemExpirationDate), req.body.itemType],
    (error, results) => {
      res.redirect('/');
    }
  );
});

app.listen(app.get('port'));