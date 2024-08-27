require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./connection");
const router = require("./routes/user");
const cookieParser = require("cookie-parser");
const expenseRoute = require("./routes/expense");
const app = express();

const PORT = process.env.PORT;

const mongoPath = process.env.MONGO_URL;

connectToDatabase(mongoPath).then(() => {
  console.log("connected to data base");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "https://borrowbuddyclient.onrender.com"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

app.use("/", router);
app.use("/expense", expenseRoute);

app.listen(PORT, () => {
  console.log(`App started on port : ${PORT}`);
});
