const express = require("express");
const FileSystem = require("fs");
const { MerkleTree } = require("merkletreejs");
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerJsDocs = YAML.load("./api.yaml")
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
var cors = require("cors");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
var User = require("./models/userModel.js");
const Leafhash = require("./models/leaf_hash-model.js");

const Total_liabilities = require('./models/liablities-total.js')
const merkle_tree = require("./models/merkletree-model.js");
const Assert = require("./controllers/assetExchangeController.js");
const Solvency = require("./controllers/solvency.js");

const Wallet = require("./controllers/assetWalletController.js");
//var bodyParser = require('body-parser');
var jsonwebtoken = require("jsonwebtoken");
const { Leaf } = require("merkletreejs/dist/MerkleSumTree.js");
mongoose.Promise = global.Promise;
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());
mongoose.set("autoIndex", true);
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});
// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to POR application." });
});

require("./routes/routes.js")(app);

app.get("/totalassetamount", async (req, res) => {
  try {
    //const a = req.body.asset;

    var exchange_name = req.query.exchange_name;

    var date = req.query.date;

    var data = await Assert.getassettype(exchange_name, date);

    if (data == null) {
      throw "dates not found";
    }

    let a = data.assetType;

    var final = [];
    for (let i = 0; i < a.length; i++) {
      var asset = a[i];
      var result = await Assert.total(exchange_name, date, asset);

      if (result == null) {
        throw "balance not found";
      }
      final.push(result);
    }

    res.status(200).send(final);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Wallet

app.get("/totalwalletamount", async (req, res) => {
  try {
    //const a = req.body.asset;
    var exchange_name = req.query.exchange_name;

    var date = req.query.date;
    console.log("1111");
    var data = await Wallet.getassettype(exchange_name, date);
    if (data == null) {
      throw "dates not found";
    }

    let a = data.assetType;
    var final = [];
    for (let i = 0; i < a.length; i++) {
      var asset = a[i];
      var result = await Wallet.total(exchange_name, date, asset);
      if (result == null) {
        throw "balance not found";
      }
      final.push(result);
    }

    res.status(200).send(final);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/test", async (req, res) => {
  var exchange_name = req.body.exchange_name;

  var date = req.body.date;

  var data = await Assert.getassettype(exchange_name, date);

  res.send(data);
});
//

app.post("/generateleafhash", async (req, res) => {
  try {
    //const a = req.body.asset;

    var exchange_name = req.body.exchange_name;
    var salting = req.body.salting;
    var date = req.body.date;

    if (
      exchange_name === undefined ||
      date === undefined ||
      salting === undefined
    ) {
      throw "exchange_name && date fileds are required";
    }
console.log("164,164")
    const dataleaf = await Leafhash.findOne({
      exchange_name: exchange_name,
      date: date,
    });
console.log("169,169")
    if (dataleaf != null) {
      throw "leafhash with date already exist";
    }
console.log("173,173")
   const totoaldata = await Total_liabilities.find({
     exchange_name: exchange_name,
     date: date,
   });
       if (data = null) {
         throw "total sum not exist";
       }
console.log("data got")
    var jsonarr = totoaldata;
    console.log(jsonarr[0])
    //console.log("22",jsonarr)
    var final = [];
    for (let i = 0; i < jsonarr.length; i++) {
      const h = jsonarr[i].Customer_ID;
      const dd = parseFloat(jsonarr[i].sum);
      let dat = jsonarr[i].date;

      const k = h + dd + date + salting;
      // console.log("kkk", k);
      const g = crypto.createHash("sha256").update(k).digest("hex");
      var result = {
        ID: h,
        hash: g,
        asofdate: date,
        date: req.body.date,
        exchange_name: req.body.exchange_name,
        Salting: salting,
      };
      final.push(result);
    }
    console.log("197,197",final[0])
    // const leaf_hash = new Leafhash({
      
    //   Salting: salting,
    //   //dynamic number: exchangename+fourdigitid
    //   leafhash: final,
    // });
    // Save por in the database

    // const dd = await leaf_hash.save();
    const dd = await Leafhash.insertMany(final);
    if (dd == null) {
      throw new Error("leaf hashes not saved");
    }
    let ressult = {
      message: "exchange coustmers leaf generated",
    };
    res.status(200).send(ressult);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/getleafhash", async (req, res) => {
  const data = await Leafhash.find({
    exchange_name: req.query.exchange_name,
    date: req.query.date,
  });
console.log(data[0],data[1])
  res.status(200).send(data);
});

app.get("/solvency", async (req, res) => {
  const exchange_name = req.query.exchange_name;
  //const date = req.query.date
  var start_date = req.query.start_date;

  var end_date = req.query.end_date;

  const a = await Solvency.solvency_liabilities(
    exchange_name,
    start_date,
    end_date
  );

  const solvency_liabilities = a.result;

  const b = await Solvency.solvency_reserves(
    exchange_name,
    start_date,
    end_date
  );

  const solvency_reserves = b.result;

  var result = {
    solvency_liabilities,
    solvency_reserves,
  };
  res.json(result).status(200);
});

app.post("/generate_Merkletree", async (req, res) => {
  try {
    var exchange_name = req.body.exchange_name;

    var date = req.body.date;
    var tree = 0;

    // const dataMK = await merkle_tree.findOne({
    //   exchange_name: exchange_name,
    //   date: date,
    // });

    // if (dataMK != null) {
    //   throw "merkletree with date already exist";
    // }
    console.log("1111")
    const data = await Leafhash.find({
      exchange_name: exchange_name,
      date: date,
    });
   // console.log(data)
    if (data == null) {
      throw "coustmer_id not found";
    }

    const leafs = data;
console.log("290,290",data[0])
    let hashArray = [];

    leafs.forEach((element) => {
    
      hashArray.push(element.hash);
    });

    var Tree = {};

    tree = new MerkleTree(hashArray);
    var arry = [];
    var foo = 1;

    tree.layers.forEach((element) => {
      arry = [];
      element.forEach((x) => {
        arry.push(x.toString("hex"));
      });

      Tree["level" + `${foo}`] = arry;
      foo++;
    });

    var root = tree.getRoot().toString("hex");

    //var roothash = await new MerkleTree(level)
console.log("316,316")
    // Save merkle_tree in the database
   // console.log(Tree);
   var filename = exchange_name + date + "-d.json"

     FileSystem.writeFile(filename, JSON.stringify(Tree), (error) => {
       if (error) throw error;
     });
 console.log("317,317")
// const client = new MongoClient(
//   "mongodb://por-test:portmvp@localhost:27017/new-por?authSource=admin"
// );
//      console.log("clinet-----------")
var db = mongoose.connections[0].db;
bucket = new mongoose.mongo.GridFSBucket(db, {
  bucketName: "MT-bucket",
});
console.log(bucket);
    
var result = fs.createReadStream(filename).pipe(
  bucket.openUploadStream(filename, {
    ChunkSizeBytes : 64512,
    metadata: { field: "exchange", value: exchange },
  })
);

    let ressult = {
      message: "exchange coustmers merkletree generated",
      result: result
    };
    res.status(200).send(ressult);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/get_Merkletree", async (req, res) => {
  const data = await merkle_tree.findOne({
    exchange_name: req.query.exchange_name,
    date: req.query.date,
  });

  res.send(data);
});

app.get("/VerifyleafProof", async (req, res) => {
  try {
    const leaf = req.query.leaf;

    const data = await merkle_tree.findOne({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    if (data == null) {
      throw "data not found";
    }
    const root = data.Root_hash;
    var level = data.merkletree.level1;

    var tree = await new MerkleTree(level);

    const proof = await tree.getProof(leaf);

    proof.forEach((x) => {
      x.data = x.data.toString("hex");
    });

    const verify = await tree.verify(proof, leaf, root);

    if (verify)
      res.send("Proof validation successfully !! Thanks ").status(200);
    else res.send("Proof validation unsuccessfully !! Try Again").status(404);
  } catch (err) {
    res.send(err).status(404);
  }
});

// listen for requests
app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
