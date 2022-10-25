const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');

const app = express();
const port = 3000;

// connect mongoose

mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//temp engine
app.set('view engine', 'ejs');
//Mıddlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use(express.static('public'));
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', {
    photos,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
