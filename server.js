const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const { MongoClient } = require('mongodb'); // MongoClient를 가져옴
const { Script } = require('vm');

// MongoDB 연결 설정
mongoose.connect('mongodb+srv://admin:PYg1wVmsBJkKUMWQ@yubinkim.vdjthal.mongodb.net/yourDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 스키마 및 모델 정의
const postSchema = new mongoose.Schema({
  name: String,
  title: String,
  timestamp: Date,
  category: String,
  content: String,
  images: [String],
  attachments: [String]
});

const Post = mongoose.model('Post', postSchema);

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// 파일 업로드 경로
app.post('/add', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'attachments', maxCount: 10 }]), (req, res) => {
  const { name, title, timestamp, category, content } = req.body;

  const images = req.files['image'] ? req.files['image'].map(file => file.filename) : [];
  const attachments = req.files['attachments'] ? req.files['attachments'].map(file => file.filename) : [];

  const newPost = new Post({
      name,
      title,
      timestamp,
      category,
      content,
      images,
      attachments
  });

  newPost.save()
      .then(() => res.send("<script>alert('신청완료되었습니다');location.href='/home';</script>"))
      
      .catch(err => res.status(400).send('Error saving post: ' + err));
});

// MongoDB 연결 설정
let db;
const url = 'mongodb+srv://admin:PYg1wVmsBJkKUMWQ@yubinkim.vdjthal.mongodb.net/yourDB?retryWrites=true&w=majority';
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('DB 연결 성공');
    db = client.db('forum');
    app.listen(8080, () => {
      console.log("서버 연결됨");
    });
  })
  .catch(err => {
    console.log(err);
  });

// 라우팅 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/home', async (req, res) => {
  let result = await db.collection('post').find().toArray();
  res.render('list.ejs', { 글목록: result });
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});
app.post('/signup', (req,res)=>{
  const {username, phone, email, password}=req.body;
  console.log(req.body)
})




app.get('/request', (req, res) => {
  res.render('request.ejs');
});
