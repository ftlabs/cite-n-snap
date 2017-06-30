const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();
app.use(express.static(path.resolve(__dirname + "/public")));

app.get('/', function(req, res){
	res.sendFile(path.resolve(__dirname +'/index.html'));
});

app.listen(2017);