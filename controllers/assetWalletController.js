const csv = require("csvtojson");
//const WalletSchema = require('../models/asset-wallet');
const axios = require("axios");
const Exchange_Wallets = require("../models/new-exchange-wallet");
const Wallet_Assettype = require("../models/new-asset-wallet");




// updated above api
exports.walletcsv = async (req, res) => {
  // upload csv
  try {
    var exchange_name = req.body.exchange_name;
    var date = req.body.date;
    if (exchange_name === undefined || date === undefined) {
      throw "exchange_name && date fileds are required";
    }

    // checking if same data is exist throw error
    const data = await Exchange_Wallets.find({
      exchange_name: exchange_name,
      date: date,
    });

    if (data.length != 0) {
      throw "reserve with date already exist";
    }

    var filepath = "uploads/" + req.file.filename;

    let jsonArray = await csv().fromFile(filepath);
    if (jsonArray.length == 0 ){
      throw "CSV file was empty"
     }

    const first = jsonArray[0];

    var bb = Object.keys(first);

    const cryptoasset = bb.includes("CRYPTOASSET");

    const walletaddress = bb.includes("WALLETADDRESS");


    if (!(cryptoasset && walletaddress )) {
      throw "CSV file ROW values are in correct ";
    }
    const aaa = jsonArray[0];
    var value = Object.values(aaa);

    
   
    for(var i=0; i<value.length; i++) {
     if(value[i] === "") {
       throw " csv values are empty"
     }
   }

    const jsonarray = jsonArray.map((v) => ({
      ...v,
      exchange_name: exchange_name,
      date: date,
      ASOFDATE: date,
      VERIFIED_OWNERSHIP: "",
      VERIFIED_DATE: "",
    }));
 
    const a = jsonArray.map((value) => value.CRYPTOASSET);

    const assettype = [...new Set(a)];

    const asset = new Wallet_Assettype({
      date: req.body.date,
      exchange_name: req.body.exchange_name,

      assetType: assettype,
    });
    const dd = await asset.save();
    if (dd == null) {
      throw new Error("assettype not saved");
    }

   

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < jsonarray.length; i++) {
      if (i != 0 && i % 12 == 0) {
        await delay(6000);
      }
    
      var WALLETADDRESS = jsonarray[i].WALLETADDRESS;
      var CRYPTOASSET = jsonarray[i].CRYPTOASSET;
    
      try {
        const response = await axios.get(
          "https://api.coinmetrics.io/v4/blockchain-v2/" +
            CRYPTOASSET +
            "/accounts?accounts=" +
            WALLETADDRESS +
            "&pretty=true&api_key=6oZAdNZcdtwAeLWAP4yG&end_time=" +
            date
        );
    
        var aa = response.data.data[0].balance;
       
        jsonarray[i].BALANCE = aa;
      } catch (error) {
 
        throw "Error due to incorrect credentails or too manny request";
      }
    }

    const d = await Exchange_Wallets.insertMany(jsonarray);
    if (!d) {
      throw "data not uploaded";
    }
    res.status(200).send("scucess uploaded reserves in db");
  
  } catch (error) {
  
    res.status(500).send(error);
  }
};

exports.updateowner = async (req, res) => {
  try {
    const filter = {
      WALLETADDRESS: req.body.wallet_address,
      exchange_name: req.body.exchange_name,
      date: req.body.date,
    };
    const update = {
      VERIFIED_OWNERSHIP: req.body.verification,
      VERIFIED_DATE: req.body.verification_date,
    };
    const opts = { new: true };

    let doc = await Exchange_Wallets.findOneAndUpdate(filter, update, opts);

    if (doc == null) {
      throw "data not found";
    }
    res.status(200).send("Fields updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.exchange_wallet_find = async (req, res) => {
  try {
    const limitValue = req.query.limit || 10;
    const skipValue = req.query.skip || 0;
    const data = await Exchange_Wallets.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    })
      .limit(limitValue)
      .skip(skipValue);

    if (data == null) {
      throw "data not found";
    }

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

//without pagination
exports.get_exchange_wallet_find = async (req, res) => {
  try {
    const data = await Exchange_Wallets.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    if (data == null) {
      throw "data not found";
    }

    let final = [];
    for (let i = 0; i < data.length; i++) {
      let a = {
        CRYPTOASSET: data[i].CRYPTOASSET,
        WALLETADDRESS: data[i].WALLETADDRESS,
        BALANCE: data[i].BALANCE,
        ASOFDATE: data[i].ASOFDATE,
        VERIFIED_OWNERSHIP: data[i].VERIFIED_OWNERSHIP,
        VERIFIED_DATE: data[i].VERIFIED_DATE,
      };
      final.push(a);
    }

    res.status(200).send(final);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getassettype = async (exchange_name, date) => {
  try {
    const data = await Wallet_Assettype.findOne({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }
  
    return data;
  } catch (error) {
    return error;
  }
};

exports.get_dates = async (exchange_name) => {
  try {
    const data = await Wallet_Assettype.find({
      exchange_name: exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];

    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    return final;
  } catch (error) {
    return error;
  }
};

exports.total = async (exchange_name, date, asset) => {
  try {
    const data = await Exchange_Wallets.find({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }
    let d = data;
    var sum = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i].CRYPTOASSET == asset) {
        sum = sum + parseFloat(d[i].BALANCE);
      }
    }

    var result = {
      Asset: asset,
      Total: Math.round(sum * 1000000000000) / 1000000000000,
    };
    return result;
  } catch (error) {
    return error;
  }
};

exports.getdates = async (req, res) => {
  try {
    const data = await Wallet_Assettype.find({
      exchange_name: req.query.exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];

    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    var a = {
      name: "Exchange_reserves",
      result: final,
    };
    res.status(200).json(a);
  } catch (error) {
    res.status(500).send(error);
  }
};
