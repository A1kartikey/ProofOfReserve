const express = require("express");
const { MerkleTree } = require("merkletreejs");
const crypto = require("crypto");
const bodyParser = require("body-parser");
var cors = require("cors");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
var User = require("./models/userModel.js");
const Leafhash = require("./models/leaf_hash-model.js");
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

    const dataleaf = await Leafhash.findOne({
      exchange_name: exchange_name,
      date: date,
    });

    if (dataleaf != null) {
      throw "leafhash with date already exist";
    }

    var data = await Assert.getassettype(exchange_name, date);
    if (data == null) {
      throw "data not found";
    }

    var jsonarr = data.totalsum;
    //console.log("22",jsonarr)
    var final = [];
    for (let i = 0; i < jsonarr.length; i++) {
      const h = jsonarr[i].Customer_ID;
      const dd = parseFloat(jsonarr[i].sum);
      let dat = jsonarr[i].date;

      const k = h + dd + date + salting;
      console.log("kkk", k);
      const g = crypto.createHash("sha256").update(k).digest("hex");
      var result = {
        ID: h,
        hash: g,
        asofdate: date,
      };
      final.push(result);
    }
    const leaf_hash = new Leafhash({
      date: req.body.date,
      exchange_name: req.body.exchange_name,
      Salting: salting,
      //dynamic number: exchangename+fourdigitid
      leafhash: final,
    });
    // Save por in the database

    const dd = await leaf_hash.save();

    let ressult = {
      message: "exchange coustmers leaf generated",
    };
    res.status(200).send(ressult);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/getleafhash", async (req, res) => {
  const data = await Leafhash.findOne({
    exchange_name: req.query.exchange_name,
    date: req.query.date,
  });

  res.send(data);
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

    const dataMK = await merkle_tree.findOne({
      exchange_name: exchange_name,
      date: date,
    });

    if (dataMK != null) {
      throw "merkletree with date already exist";
    }
    const data = await Leafhash.findOne({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "coustmer_id not found";
    }

    const leafs = data.leafhash;

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

    // Save merkle_tree in the database
    const mt = new merkle_tree({
      date: req.body.date,
      exchange_name: req.body.exchange_name,

      merkletree: Tree,
      Root_hash: root,
    });
    // Save por in the database

    const dd = await mt.save();

    let ressult = {
      message: "exchange coustmers merkletree generated",
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
