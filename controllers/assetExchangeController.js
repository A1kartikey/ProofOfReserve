const csv = require("csvtojson");
const crypto = require("crypto");
const Assettype = require("../models/asset-type");
const Exchange_liabilities = require("../models/new-exchange-liabilities");


exports.new_exchange = async (req, res) => {
  // upload csv
  try {
    var exchange_name = req.body.exchange_name;
    var date = req.body.date;
    console.log("2222", req.body.exchange_name);
    console.log("2222", req.body.date);

    if (exchange_name === undefined || date === undefined) {
      throw "exchange_name && date fileds are required";
    }

    // checking if same data is exist throw error
    const data = await Exchange_liabilities.find({
      exchange_name: exchange_name,
      date: date,
    });

    if (data.length != 0) {
      throw "exchange with date already exist";
    }
    //console.log("dataaaaa",data)
    // console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    //console.log("@@@@@@",req.file.filename)

    let jsonArray = await csv().fromFile(filepath);
    var test = jsonArray[0];
  
    var jsonarray = jsonArray.map((v) => ({
      ...v,
      exchange_name: exchange_name,
      date: date,
    }));
    var a = jsonArray.map((value) => value.Cryptoasset);
    var aa = jsonArray.map((value) => value.Customer_ID);

    const assettype = [...new Set(a)];
    const coustmerid = [...new Set(aa)];
    // const date = jsonArray[0].date;
    // saving cryptoasset types in new schema
    const asset = new Assettype({
      // date: new Date().valueOf(),
      date: req.body.date,
      exchange_name: req.body.exchange_name,
      //dynamic number: exchangename+fourdigitid
      assetType: assettype,
      coustmer_id: coustmerid,
    });
    // Save por in the database
    const dd = await asset.save();
    if (dd == null) {
      throw new Error("assettype not saved");
    }
    //console.log("22222222222222222222")
    const d = await Exchange_liabilities.insertMany(jsonarray);

    //console.log(jsonArray)
    res.status(200).send(d);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getexchange_list = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  console.log("aaaaa", req.query.exchange_name);
  console.log("bbbbbb", req.query.date);
  try {
    const limitValue = req.query.limit || 10;
    const skipValue = req.query.skip || 0;

    if (req.query.exchange_name === undefined || req.query.date === undefined) {
      throw "exchange_name && date fileds are required";
    }
    const data = await Exchange_liabilities.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    })
      .limit(limitValue)
      .skip(skipValue);

    if (data == null) {
      throw "data not found";
    }

    res.status(200).send(data);
    //console.log("dddd",data)
  } catch (error) {
    //console.log(error);
    res.status(500).send(error);
  }
};

// without pagination
exports.get_exchange_list = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  console.log("aaaaa", req.query.exchange_name);
  console.log("bbbbbb", req.query.date);
  try {
    if (req.query.exchange_name === undefined || req.query.date === undefined) {
      throw "exchange_name && date fileds are required";
    }
    const data = await Exchange_liabilities.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    if (data == null) {
      throw "data not found";
    }
    const final = [];
    for (let i = 0; i < data.length; i++) {
      let a = {
        Customer_ID: data[i].Customer_ID,
        Cryptoasset: data[i].Cryptoasset,
        Balance: data[i].Balance,
        ASOFDATE: data[i].ASOFDATE,
      };
      final.push(a);
    }

    res.status(200).send(final);
    //console.log("dddd",data[0])
  } catch (error) {
    //console.log(error);
    res.status(500).send(error);
  }
};

exports.get_liabilities = async (exchange_name, date, id) => {
  try {
    const data = await Exchange_liabilities.find({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }

    let d = data;
    var sum = 0;
    let dat = "";
    for (let i = 0; i < d.length; i++) {
      if (d[i].Customer_ID == id) {
        //console.log(d[i])
        sum = sum + parseFloat(d[i].Balance);
        dat = d[i].ASOFDATE;
      }
    }
    const h = id;
    const dd = sum;
    //console.log("ddfgdfgdfg",dat)
    const k = h + dd + dat;
    //console.log("174",k)
    const g = crypto.createHash("sha256").update(k).digest("hex");

    //console.log("aaaa",sum)
    var result = {
      ID: id,
      Total: sum,
      hash: g,
      asofdate: dat,
      Date: date,
    };
    return result;
  } catch (error) {
    return error;
  }
};

exports.totalbalance = async (req, res) => {
  //
  try {
    const data = await Exchange_liabilities.findOne({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    if (data == null) {
      throw "data not found";
    }
    const a = data.exchange_list;
    var sum = 0;
    for (let i = 0; i < a.length; i++) {
      // console.log(a[i].Eth)
      var assettype = req.query.asset;
      // const a = a[i]
      let b = parseInt(a[i][assettype]);
      sum = sum + b;
    }
    //console.log("aaaa",sum)
    var result = {
      Asset: assettype,
      Total: sum,
    };
    res.status(200).send(result);
  } catch (error) {
    res.send(error);
  }
};

exports.getassettype = async (exchange_name, date) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Assettype.findOne({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }
    //console.log("data",data)
    return data;
  } catch (error) {
    return error;
  }
};

exports.total = async (exchange_name, date, asset) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Exchange_liabilities.find({
      exchange_name: exchange_name,
      date: date,
    });
    if (data == null) {
      throw "data not found";
    }
    let d = data;
    var sum = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i].Cryptoasset == asset) {
        //console.log(d[i])
        sum = sum + parseFloat(d[i].Balance);
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

exports.get_dates = async (exchange_name) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Assettype.find({
      exchange_name: exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];
    //console.log("data",data)
    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    return final;
  } catch (error) {
    return error;
  }
};

exports.liabilities_getdates = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Assettype.find({
      exchange_name: req.query.exchange_name,
    });
    if (data == null) {
      throw "data not found";
    }
    var final = [];
    //console.log("data",data)
    for (let i = 0; i < data.length; i++) {
      final.push(data[i].date);
    }

    var a = {
      name: "Exchange_liabilities",
      result: final,
    };
    res.status(200).json(a);
  } catch (error) {
    res.status(500).send(error);
  }
};
