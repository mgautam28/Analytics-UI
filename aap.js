const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require(".db")

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  db.query ("SELECT * FROM i3_app_user ")
    
  res.render("user-stats", { data: getUserStats() });
});

function getUserStats() {
  return {
    monthlyUsers: [100, 500, 200, 300, 100, 50, 600, 150, 400, 300, 200, 100],
    userAnalytics: {
      totalUsers: 1000,
      subscription: 800,
      trial: 200,
      unlimited: 150,
    },
  };
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
