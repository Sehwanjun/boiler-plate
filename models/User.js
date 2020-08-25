const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// salt를 먼저 생성 & 몇자리인지 정한다.
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //기입란의 공백 제거해주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    //토큰은 유효성 관리를 위한
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// user모델에 user정보를 저장하기 전에 function을 처리한다.
// 그 담에 index.js로..
userSchema.pre("save", function (next) {
  // 상단의 user정보를 가리킨다
  var user = this;
  //다른 값말고 password가 변경될 때만 암호화 적용
  if (user.isModified("password")) {
    //salt를 이용해서 비밀번호를 암호화 시킨다.(bcrypt 적용)
    //hash: 암호화된 비밀번호
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
        // Store hash in your password DB.
      });
    });
  } else {
    next();
  }
});

//로그인기능 구현을 위해 이메일주소에 따른 비번매칭위한 메서드 (cb: callback fnt)
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567 암호화된 비밀번호: $2aienoa~~ 이 두개를 체크
  //암호화해서 확인해야할 것임
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기 - 문서참조
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  // user._id + 'secretToken' = token
  // ->
  // 'secretToken' -> user._id
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // user._id + ''  = token
  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
