const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/../client/dist'))

// An api endpoint that returns a short list of items
// app.get('/api/test', (req, res) => {
//     const list = ["item1", "item2", "item3"];
//     res.json(list);
// });

// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname + '/../client/dist/404.html'));
// });

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port));