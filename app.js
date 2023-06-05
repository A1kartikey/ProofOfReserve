const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var User = require('./models/userModel.js');
const Assert = require('./controllers/assetExchangeController.js')
//var bodyParser = require('body-parser');
var jsonwebtoken = require("jsonwebtoken");
mongoose.Promise = global.Promise;
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors());
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });
// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});


require('./routes/note.routes.js')(app);
// var routes = require('./routes/userRoutes');
// routes(app);


//getassettype

app.post('/totalassetamount',async (req,res)=>{

                //const a = req.body.asset;
                var exchange_name= req.body.exchange_name;
                var date= req.body.date;
                
                var data = await Assert.getassettype(exchange_name,date);
                console.log(data.assetType)
                 let a = data.assetType;
                var final = [];
                for(let i=1; i<a.length;i++){
                  console.log(a[i])
                  //console.log(exchange_name)
                  var asset = a[i];
                var result =  await Assert.total(exchange_name,date,asset)
                final.push(result)

                //console.log(result)
                }

                res.send(final)

})






// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});