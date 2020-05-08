const express = require('express');
const mysql = require('mysql');
const app = express();
const connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'b8f42ab6d518ec',
  password: '1e743467',
  database: 'heroku_9c9df56d1e6e09d'
});

dateNull = (date) => {
  if (date) {
    return date;
  }
  else {
    return null;
  }
};

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// app.get('/', (req, res) => {
//   connection.query(
//     'SELECT * FROM food',
//     (error, results) => {
//       res.render('top.ejs', {items: results, url: req.url});
//     }
//   );
// });

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM food ORDER BY expirationType IS NULL ASC, expirationType ASC, expirationDate ASC',
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

app.listen(process.env.PORT || 3000);