const csv = require("csvtojson");
const crypto = require("crypto");
// var mongoose = require("mongoose");

// var Schema = mongoose.Schema;

// var assettype = new Schema({},{ "strict":false})

// var Assettype = mongoose.model( "Asset", assettype)
const Assettype = require("../models/asset-type");

const Exchange_liabilities = require("../models/new-exchange-liabilities");
const Total_liabilities = require("../models/liablities-total")
exports.new_exchange = async (req, res) => {
  // upload csv
  try {
    var exchange_name = req.body.exchange_name;
    var date = req.body.date;

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

    var filepath = "uploads/" + req.file.filename;

    let jsonArray = await csv().fromFile(filepath);
    if (jsonArray.length == 0) {
      throw "CSV file was empty"
    }

    var jsonarray = jsonArray.map((v) => ({
      ...v,
      exchange_name: exchange_name,
      ASOFDATE: date,
      date: date,
    }));
    const first = jsonArray[0];

    var bb = Object.keys(first);

    const cryptoasset = bb.includes("Cryptoasset");

    const customer_ID = bb.includes("Customer_ID");

    const balance = bb.includes("Balance");

    if (!(cryptoasset && customer_ID && balance)) {
      throw "CSV file ROW values are in correct ";
    }

    const aaa = jsonArray[0];

    var value = Object.values(aaa);

    for (var i = 0; i < value.length; i++) {
      if (value[i] === "") {
        throw " csv values are empty"
      }
    }
    var a = jsonArray.map((value) => value.Cryptoasset);

    const assettype = [...new Set(a)];

    // let obj = {};
    // let newa = [];
    // let newd = jsonArray;

    // newd.forEach((element, j) => {
    //   var TotalBalance = 0;
    //   var Customer_IDToCheck = element.Customer_ID;
    //   //var newdate = element.ASOFDATE;
    //   newd.forEach((element, i) => {
    //     if (Customer_IDToCheck == element.Customer_ID) {
    //       TotalBalance += parseFloat(element.Balance);

    //       delete newd[i];
    //     }
    //   });
    //   obj = {
    //     Customer_ID: Customer_IDToCheck,
    //     sum: Math.round(TotalBalance * 100000000) / 100000000,
    //     date: date,
    //   };
    //   newa.push(obj);
    // });

    const output = {};
    
    let newd = jsonArray;
    
    console.log("108,108")
    
    for (const { Customer_ID, Balance } of newd) {
    

      output[Customer_ID] ??= 0;
    
      output[Customer_ID] += parseFloat(Balance);

    }
    
    console.log("117,117")
    
    //console.log(output)
    
    const newa = []
    
    Object.entries(output).map((val) =>
      newa.push({
                Customer_ID: val[0],
                sum: Math.round(val[1] * 100000000) / 100000000,
                date: req.body.date,
                exchange_name: req.body.exchange_name,
      })
    );
    
     console.log("127,127")

    // saving cryptoasset types in new schema
    const asset = new Assettype({
      // date: new Date().valueOf(),
      date: req.body.date,
      exchange_name: req.body.exchange_name,

      assetType: assettype,
    });
   
    // Save por in the database
    //console.log("33", asset);
    const dd = await asset.save();
    if (dd == null) {
      throw new Error("assettype not saved");
    }
 console.log("137,137");

    const ddd = await Total_liabilities.insertMany(newa);
   if (ddd == null) {
     throw new Error("totoal sum not saved");
   }

 console.log("151,151");
    const d = await Exchange_liabilities.insertMany(jsonarray);
    console.log("data uploaded ");
    if (!d) {
      throw "data not uploaded";
    }
    res.status(200).send("scucess uploaded libabilities in db");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getexchange_list = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  console.log("hello")
  try {
    const limitValue = req.query.limit || 10;
    const skipValue = req.query.skip || 0;

    if (req.query.exchange_name === undefined || req.query.date === undefined) {
      throw "exchange_name && date fileds are required";
    }
    const data2 = await Exchange_liabilities.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
    var totallenght = data2.length;
    //console.log("111",data2.length)
    const data = await Exchange_liabilities.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    })
      .limit(limitValue)
      .skip(skipValue);

    if (data == null) {
      throw "data not found";
    }

    var ress = {
      totallenght: totallenght,
      result: data
    }

    res.status(200).json(ress);
  } catch (error) {
    //console.log(error);
    res.status(500).send(error);
  }
};

// without pagination
exports.get_exchange_list = async (req, res) => {
  // Por.findOne(req.body.exchange_name)

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
  } catch (error) {
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
        sum = sum + parseFloat(d[i].Balance);
        dat = d[i].ASOFDATE;
      }
    }
    const h = id;
    const dd = sum;

    const k = h + dd + dat;

    const g = crypto.createHash("sha256").update(k).digest("hex");

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
      var assettype = req.query.asset;

      let b = parseInt(a[i][assettype]);
      sum = sum + b;
    }

    var result = {
      Asset: assettype,
      Total: sum,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
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

    return data;
  } catch (error) {
    return error;
  }
};


exports.gettotalsum = async (req, res) => {
  // Por.findOne(req.body.exchange_name)
  try {
    const data = await Total_liabilities.find({
      exchange_name: req.query.exchange_name,
      date: req.query.date,
    });
console.log("data gattered")
    if (data == null) {
      throw "data not found";
    }

    res.status(200).send(data);
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
        sum = sum + parseFloat(d[i].Balance);
      }
    }

    var result = {
      Asset: asset,
      Total: Math.round(sum * 100000000) / 100000000,
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
