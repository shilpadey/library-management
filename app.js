const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const libRoutes = require('./routes/libRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use("/", libRoutes);


/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});*/


sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})

