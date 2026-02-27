const http = require("http");
const app = require("./app");

const port = process.env.PORT || 5050;

const srv = http.createServer(app);

srv.listen(port, "0.0.0.0", () => {
  console.log("Server Up on port:", port);
});