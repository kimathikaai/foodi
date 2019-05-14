const express = require('express');
const port = 3000;
const app = express();

app.get('/', (req,res) => res.send('Hello World'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/* Running:
  Instantiate server by runnin the file in the command line via node <app>.js
  Open a browser and enter url: http://localhost:<port>/
