const app = require("./app.js");

// config
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
