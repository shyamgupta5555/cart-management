const express = require("express");
const connect = require("./config/db");
const router = require("./routes/routes");
const app = express();
require("dotenv").config();

app.use(express.json());

connect();

function myMiddleware(req, res, next) {
  const start = Date.now();
  const route = `${req.method} ${req.url}`;
  const originalEnd = res.end;

  res.end = function (...args) {
    const statusCode = res.statusCode;
    const duration = Date.now() - start;
    console.log(`${route} ${statusCode} - ${duration}ms`);
    originalEnd.apply(res, args);
  };
  
  next();
}

app.use(myMiddleware);


app.use("/api", router);


let PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`);
});
