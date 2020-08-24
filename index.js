const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");
// bodyparser: 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게끔 하는 장치
// application/x-www-form-urlencoded 형태를 분석해서 가져올 수 있게금
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형태를 분석해서 가져올 수 있게끔
app.use(bodyParser.json());

//mongoDB(웹사이트에서 링크코드 가져옴) & mongoose 연결
const mongoose = require("mongoose");
// config.mongoURI는 보안을 위해(git공개 등) 설정
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  // 회원가입할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  // {
  //   id: "hello",
  //   password: "123"
  // } 이런 식으로 req.body 구성

  const user = new User(req.body);

  user.save((err, userInfo) => {
    // 실패시 유저에게 에러가 있다고 전달하는 것
    if (err)
      return res.json({
        success: false,
        err,
      });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
