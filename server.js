const express = require('express'); // express라는 상수에 require 함수로 express라이브러리를 가져와서 저장

const app=express(); //app이라는 상수에 express함수를 저장

const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://admin:PYg1wVmsBJkKUMWQ@yubinkim.vdjthal.mongodb.net/?retryWrites=true&w=majority&appName=yubinKim'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080,()=>{
    console.log("서버 연결됨");
  })
}).catch((err)=>{
  console.log(err)
})
//PYg1wVmsBJkKUMWQ
app.use(express.static(__dirname + '/public'));



app.get('/',(요청, 응답)=>{
    응답.sendFile(__dirname + '/index.html');
});

app.get('/home',(요청, 응답)=>{
    응답.sendFile(__dirname + '/home.html');
});

app.get('/signup',(요청, 응답)=>{
    응답.sendFile(__dirname + '/signUp.html');
})
app.get('/news',(요청, 응답)=>{
    db.collection('post').insertOne({title : '어쩌구'})
    응답.send('오늘 비옴 ㅅㄱ');
})