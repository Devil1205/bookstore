const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const cookierParser = require('cookie-parser');
const { connect } = require('./db/db');

//connecting mongodb
connect();

//cors fix
app.use(cors());

//middlewares
app.use(express.json());
app.use(cookierParser());

// //routes
app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1", require("./routes/bookRoute"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})