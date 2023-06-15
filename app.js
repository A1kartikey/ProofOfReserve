const express = require('express');
const { MerkleTree } = require('merkletreejs') ;
const crypto = require('crypto') ;
const bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var User = require('./models/userModel.js');
const Leafhash = require('./models/leaf_hash-model.js')
const merkle_tree = require('./models/merkletree-model.js')
const Assert = require('./controllers/assetExchangeController.js')
const Solvency = require('./controllers/solvency.js')

const Wallet= require('./controllers/assetWalletController.js')
//var bodyParser = require('body-parser');
var jsonwebtoken = require("jsonwebtoken");
const { Leaf } = require('merkletreejs/dist/MerkleSumTree.js');
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
    res.json({"message": "Welcome to POR application."});
});


require('./routes/note.routes.js')(app);
// var routes = require('./routes/userRoutes');
// routes(app);


//getassettype

app.get('/totalassetamount',async (req,res)=>{
try {
  

                //const a = req.body.asset;
                var exchange_name= req.query.exchange_name;
                console.log("s",exchange_name)
                var date= req.query.date;
                console.log("eeee",date)
                var data = await Assert.getassettype(exchange_name,date);
                if( data == null){ 
                  throw "dates not found" 
                }
                //console.log(data.assetType)
                let a = data.assetType
                 var final = [];
                for(let i=0; i<a.length;i++){
                  //console.log(a[i])
                  //console.log(exchange_name)
                  var asset = a[i];
                var result =  await Assert.total(exchange_name,date,asset)
                if (result == null){
                  throw "balance not found"
                }
                final.push(result)

                //console.log(result)
                }

                res.send(final);
                //res.send("scucess")
              } catch (error) {
                 res.status(404).send(error)
              }

})


// Wallet

app.get('/totalwalletamount',async (req,res)=>{
  try {
    
  
                  //const a = req.body.asset;
                  var exchange_name= req.query.exchange_name;
                  console.log("s",exchange_name)
                  var date= req.query.date;
                  console.log("eeee",date)
                  var data = await Wallet.getassettype(exchange_name,date);
                  if( data == null){ 
                    throw "dates not found" 
                  }
                  //console.log(data.assetType)
                  let a = data.assetType
                   var final = [];
                  for(let i=0; i<a.length;i++){
                    //console.log(a[i])
                    //console.log(exchange_name)
                    var asset = a[i];
                  var result =  await Wallet.total(exchange_name,date,asset)
                  if (result == null){
                    throw "balance not found"
                  }
                  final.push(result)
  
                  //console.log(result)
                  }
  
                  res.send(final);
                  //res.send("scucess")
                } catch (error) {
                   res.status(404).send(error)
                }
  
  })


//
app.get("/solvency-liabilities",async(req,res)=>{


      try {
            var exchange_name= req.query.exchange_name;
            var dates = await Assert.get_dates(exchange_name);
          if (dates == null){
            throw "dates not found"
          }
            let finalresult=[] ;
            for ( let i=0; i<dates.length;i++){

              var data = await Assert.getassettype(exchange_name,dates[i]);
              if (data == null){
                throw "assettype not found"
              }
                console.log(dates[i])
                let a = data.assetType;
                var final = [];
                    for(let j=0; j<a.length;j++){
                      console.log(a[j])
                      //console.log(exchange_name)
                      var asset = a[j];
                    var result =  await Assert.total(exchange_name,dates[i],asset);
                    final.push(result)

                    //console.log(result)
                    }
                    console.log("final",final)

                    let r = {
                      date: dates[i],
                      result: final
                    }
                   finalresult.push(r)
      }

      const aa= {
        name: "solvency-liabilities",
        result: finalresult
      }
  res.status(200).send(aa)
} catch (error) {
  res.status(404).send(error)
}
})

app.get("/solvency-wallet",async(req,res)=>{


  try {
        var exchange_name= req.query.exchange_name;
        var dates = await Wallet.get_dates(exchange_name);
      if (dates == null){
        throw "dates not found"
      }
        let finalresult=[] ;
        for ( let i=0; i<dates.length;i++){

          var data = await Wallet.getassettype(exchange_name,dates[i]);
          if (data == null){
            throw "assettype not found"
          }
            console.log(dates[i])
            let a = data.assetType;
            var final = [];
                for(let j=0; j<a.length;j++){
                  console.log(a[j])
                  //console.log(exchange_name)
                  var asset = a[j];
                var result =  await Wallet.total(exchange_name,dates[i],asset);
                final.push(result)

                //console.log(result)
                }
                console.log("final",final)

                let r = {
                  date: dates[i],
                  result: final
                }
               finalresult.push(r)
  }
  const aa= {
    name: "solvency-wallet",
    result: finalresult
  }


res.status(200).send(aa)
} catch (error) {
res.status(404).send(error)
}
})


app.post('/generateleafhash',async (req,res)=>{
  try {
    
  
                  //const a = req.body.asset;
                  var exchange_name= req.body.exchange_name;
                  //console.log("s",exchange_name)
                  var date= req.body.date;
                 // console.log("eeee",date)
                  var data = await Assert.getassettype(exchange_name,date);
                  if( data == null){ 
                    throw "coustmer_id not found" 
                  }
                  //console.log(data.coustmer_id)
                  let c = data.coustmer_id;
                  console.log(c)
                  let dataaaa;
                  let result = [];
                 for (let i=0; i<c.length; i++){

                 let id = c[i]
                 dataaaa = await Assert.get_liabilities(exchange_name,date,id)
                result.push(dataaaa)

                }
                  console.log("259",result[0])
                const leaf_hash = new Leafhash({
                  // date: new Date().valueOf(),
                   date: req.body.date,
                  exchange_name: req.body.exchange_name , 
                  //dynamic number: exchangename+fourdigitid
                  leafhash: result
              });
          // Save por in the database
          //console.log("ressss",result)
          console.log("269")
              const dd =  await leaf_hash.save();
              console.log("270000000000000000000")
                  res.send(dd);
                  //res.send("scucess")
                } catch (error) {
                   res.status(404).send(error)
                }
  
  })


app.get('/getleafhash',async(req,res)=>{

      const data = await Leafhash.findOne({
        exchange_name: req.query.exchange_name,
        date: req.query.date
      });
console.log("data285",data)
    res.send(data)
})  


app.get('/solvency',async(req,res)=>{

  const exchange_name = req.query.exchange_name;
  //const date = req.query.date
   var start_date = req.query.start_date;
   var end_date= req.query.end_date;
  const a = await Solvency.solvency_liabilities(exchange_name)
 //console.log("29888888888888888888",a.result)
 const data = a.result;
 var ed = new Date(end_date).getTime();
 var  sd = new Date(start_date).getTime();

 solvency_liabilities = data.filter(d => {var time = new Date(d.date).getTime();
 return (sd <= time && time <= ed);
 });
 //console.log("3066666",solvency_liabilities)

  const b = await Solvency.solvency_reserves(exchange_name)

  const data2 = b.result;
  var ed = new Date(end_date).getTime();
  var  sd = new Date(start_date).getTime();
 
  solvency_reserves = data2.filter(d => {var time = new Date(d.date).getTime();
  return (sd <= time && time <= ed);
  });

   var result = {
    solvency_liabilities,
    solvency_reserves
   }
  res.json(result).status(200)
})




app.post('/generate_Merkletree',async (req,res)=>{
       try {
                    //const a = req.body.asset;
                  var exchange_name= req.body.exchange_name;
                  //console.log("s",exchange_name)
                  var date= req.body.date;
                  var tree = 0 ;
                 // console.log("eeee",date)
                  var data = await Assert.getassettype(exchange_name,date);
                  if( data == null){ 
                    throw "coustmer_id not found" 
                  }
                  //console.log(data.coustmer_id)
                  let c = data.coustmer_id;
                  //console.log(c)
                  let dataaaa;
                  let result = [];
                 for (let i=0; i<c.length; i++){

                 let id = c[i]
                 dataaaa = await Assert.get_liabilities(exchange_name,date,id)
                result.push(dataaaa)

                }
                 console.log("259",result[0])
                  var concatResult = [] ; 
                  var Tree = { } ;
                  result.forEach(element => {

                    concatResult.push( element.ID + element.Total + element.asofdate );
                  });
               //console.log("35999999999",concatResult)
               var hashArray = [] ;
               var hashOfElement ;
               concatResult.forEach(element => { 
               
                 const h = crypto.createHash('sha256').update(element).digest('hex');
               
                 hashArray.push(h) ;
               })
               tree = new MerkleTree(hashArray) ;
               var arry = [] ; 
               var foo =1 ;
               
               tree.layers.forEach(element => {
                   arry = [] ;
                   element.forEach( x  => {        
                       arry.push(x.toString('hex'));
                   })
               
                   Tree['level'+ `${foo}` ]  = arry ;
                   foo++ ;
                   
               });
               //console.log('Tree: ',Tree) ;

          // Save merkle_tree in the database
          const mt =  new merkle_tree({
            // date: new Date().valueOf(),
             date: req.body.date,
            exchange_name: req.body.exchange_name , 
            //dynamic number: exchangename+fourdigitid
            merkletree: Tree
        });
    // Save por in the database
    console.log("Save por in the database")
         const dd =  await mt.save();
         console.log("39899")
        res.send(dd);
                  //res.send("scucess")
                } catch (error) {
                   res.status(404).send(error)
                }
  
  })

  app.get('/get_Merkletree',async(req,res)=>{

    const data = await merkle_tree.findOne({
      exchange_name: req.query.exchange_name,
      date: req.query.date
    });
//console.log("data285",data)
  res.send(data)
})  

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});