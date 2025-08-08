const express = require('express')
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
require('dotenv').config()
const AdminRoute = require("./routes/admin/index.route.js");
const database = require("./config/database.js");
const app = express()
const port = process.env.PORT;
const systemConfig = require("./config/system.js");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require('path');
const moment = require('moment');
const http = require("http");
const { Server } = require("socket.io");



//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//ENd TinyMCE

database.connect();

app.set("views",`${__dirname}/views`);
app.set('view engine','pug')

//Flash
app.use(cookieParser("LHNASDASDAD"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// END Flash

app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

//Route
// route(app); // Commented out client routes
AdminRoute(app);
app.get("*", (req, res) => {
  res.status(404).send("404 Not Found - Admin Panel Only");
});
//End Route

// SocketIO - Commented out client socket
// const server = http.createServer(app);
// const io = new Server(server);
// global._io = io;
// require("./sockets/client/chat.socket")(io);

//Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
//End Variables

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

app.listen(port, () => {
  console.log(`Admin Panel listening on port ${port}`)
})