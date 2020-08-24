const express = require("express");
const app = express();
const port = 5000;

//mongoDB(웹사이트에서 링크코드 가져옴) & mongoose 연결
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://JunSehwan:wjstpghks2!@cluster0.lg7bj.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
