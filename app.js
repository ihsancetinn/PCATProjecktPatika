const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

//temp engine
app.set('view engine', 'ejs');
//Mıddlewares
//Routes
app.use(express.static('public'));
app.get('/', (req, res) => {
 
  res.render('index');
});
app.get('/about', (req, res) => {
 
  res.render('about');
});
app.get('/add', (req, res) => {
 
  res.render('add');
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
