console.log("server.js");
console.log("02.03.2019");

const PORT = process.env.PORT || 1234;
const fs = require("fs");
const connect = require("connect");

//const http = require("http");

let app = connect()
  .use("/writeLog", (req, res, next) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    let body = [];
    req
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        let str = body.trim();

        if (str) {
          const newOne = JSON.parse(str);

          const path = "./db/events.json";
          fs.readFile(path, { encoding: "utf8" }, (err, data) => {
            if (err) throw err;
            let eventObj = JSON.parse(data);
            eventObj[newOne["date"]] = newOne;

            fs.writeFile(path, JSON.stringify(eventObj), function(err) {
              if (err) {
                return console.log(err);
              }

              console.log("The file was saved!");
              res.end("Writing is done.");
            });
          });
        }

        res.end("Writing is done.");
      });
  })
  .use("/getHistory", (req, res, next) => {
    fs.readFile("./db/events.json", { encoding: "utf8" }, (err, data) => {
      if (err) throw err;

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.end(data);
    });
  })
  .use("/", (req, res, next) => {
    res.end("");
  })
  .listen(PORT);

//http.createServer(app)

console.log("listening to: " + PORT);
