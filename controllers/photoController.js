const photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  // console.log(req.query.page);
  const page = req.query.page || 1; // Başlangıç sayfamız veya ilk sayfamız.
  const photosPerPage = 3; // Her sayfada bulunan fotoğraf sayısı
  const totalPhotos = await photo.find().countDocuments(); // Toplam fotoğraf sayısı
  // console.log(totalPhotos);
  const photos = await photo
    .find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhotoPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('photo', { photo: foundedPhoto });
};

exports.getEditPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('edit', { photo: foundedPhoto });
};

exports.photoUpdate = async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  // Yeni fotoğrafı upload et
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
};

exports.photoUpload = async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err); // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
};

exports.photoDelete = async (req, res) => {
  const foundedPhoto = await photo.findOne({ _id: req.params.photo_id });
  const imagepath = __dirname + '/../public' + foundedPhoto.image;
  fs.unlinkSync(imagepath);
  await photo.findByIdAndDelete(req.params.photo_id);
  res.redirect('/');
};
