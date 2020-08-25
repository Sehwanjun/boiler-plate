const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");
// bodyparser: 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게끔 하는 장치
// application/x-www-form-urlencoded 형태를 분석해서 가져올 수 있게금
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형태를 분석해서 가져올 수 있게끔
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/api/users/register", (req, res) => {
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

//로그인 기능 구현
app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 존재하는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      // console.log('err',err)
      // console.log('isMatch',isMatch)
      //비밀번호까지 맞다면 토큰을 생성하기.(400: 에러)
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키 or 로컬스토리지/ 쿠키에 저장
        res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

// 회원가입 인증시 토큰을 통해 사용자 검토
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말
  //사용자 인증이 된다면 전달해줄 data들
  res.status(200).json({
    _id: req.user._id,
    // role 1 어드민 role 2 특정 부서 어드민 등 상황따라 달라짐
    // 여기는 role 0-> 일반유저 role 0이 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃 라우터 만들기
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
