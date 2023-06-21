const csv = require("csvtojson");
//const WalletSchema = require('../models/asset-wallet');

const Exchange_Wallets = require("../models/new-exchange-wallet");
const Wallet_Assettype = require("../models/new-asset-wallet");

exports.walletcsv = async (req, res) => {
  // upload csv
  try {
    // console.log("sdsd",req)
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

    //console.log("22222222222222",req.file)

    // console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    //console.log("@@@@@@",req.file.filename)

    let jsonArray = await csv().fromFile(filepath);

    const jsonarray = jsonArray.map((v) => ({
      ...v,
      exchange_name: exchange_name,
      date: date,
      VERIFIED_OWNERSHIP: "",
      VERIFIED_DATE: "",
    }));

    const a = jsonArray.map((value) => value.CRYPTOASSET);
   //console.log("44",a)
    const assettype = [...new Set(a)];
    //console.log("46",assettype)
    const asset = new Wallet_Assettype({
      // date: new Date().valueOf(),
      date: req.body.date,
      exchange_name: req.body.exchange_name,
      //dynamic number: exchangename+fourdigitid
      assetType: assettype,
    });
    const dd = await asset.save();
    if (dd == null) {
      throw new Error("assettype not saved");
    }

    const d = await Exchange_Wallets.insertMany(jsonarray);

    //console.log(jsonArray)
    res.status(200).send(d);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateowner = async (req, res) => {
  try {
    //  console.log(req.body)
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
    //console.log("data",doc)
    if (doc == null) {
      throw "data not found";
    }
    res.status(200).send(doc);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.exchange_wallet_find = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  //console.log("aaaaa",req.query.exchange_name);
  //console.log("bbbbbb",req.query.Last_Updated);

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
  // Por.findOne(req.body.exchange_name)
  //console.log("aaaaa",req.query.exchange_name);
  //console.log("bbbbbb",req.query.Last_Updated);

  try {
    const data = await Exchange_Wallets.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    if (data == null) {
      throw "data not found";
    }
    //console.log("ssssssssssss",data[0])
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
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Wallet_Assettype.findOne({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }
    console.log("data",data)
    return data;
  } catch (error) {
    return error;
  }
};

exports.get_dates = async (exchange_name) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Wallet_Assettype.find({
      exchange_name: exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];
    //console.log("data--get_dates",data)
    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    return final;
  } catch (error) {
    return error;
  }
};

exports.total = async (exchange_name, date, asset) => {
  // Por.findOne(req.body.exchange_name)
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
        //console.log(d[i])
        sum = sum + parseFloat(d[i].BALANCE);
      }
    }
    //console.log("aaaa",sum)
    var result = {
      Asset: asset,
      Total: sum,
    };
    return result;
  } catch (error) {
    return error;
  }
};

exports.getdates = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Wallet_Assettype.find({
      exchange_name: req.query.exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];
    //console.log("data--get_dates",data)
    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    var a = {
      name: "Exchange_reserves",
      result: final,
    };
    res.status(200).json(a);
  } catch (error) {
    //console.log(error);
    res.status(500).send(error);
  }
};
