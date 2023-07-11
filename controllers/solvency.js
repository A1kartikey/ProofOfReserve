const Assert = require("./assetExchangeController.js");

const Wallet = require("./assetWalletController.js");

exports.solvency_liabilities = async (exchange_name) => {
  try {
    //var exchange_name= req.query.exchange_name;
    var dates = await Assert.get_dates(exchange_name);
    //console.log("dates",dates)
    if (dates == null) {
      throw "dates not found";
    }
    let finalresult = [];
    for (let i = 0; i < dates.length; i++) {
      var data = await Assert.getassettype(exchange_name, dates[i]);
      if (data == null) {
        throw "assettype not found";
      }

      let a = data.assetType;
      var final = [];
      for (let j = 0; j < a.length; j++) {
        var asset = a[j];
        var result = await Assert.total(exchange_name, dates[i], asset);
        console.log("dates",dates[i])
       console.log("result",result)
        final.push(result);
      }

      let r = {
        date: dates[i],
        result: final,
      };
      finalresult.push(r);
    }
console.log(finalresult)
    const aa = {
      name: "solvency-liabilities",
      result: finalresult,
    };
    // res.status(200).send(aa)
    return aa;
  } catch (error) {
    // res.status(404).send(error)
    return error;
  }
};

exports.solvency_reserves = async (exchange_name) => {
  try {
    //var exchange_name= req.query.exchange_name;

    var dates = await Wallet.get_dates(exchange_name);

    if (dates == null) {
      throw "dates not found";
    }
    let finalresult = [];
    for (let i = 0; i < dates.length; i++) {
      var data = await Wallet.getassettype(exchange_name, dates[i]);

      if (data == null) {
        throw "assettype not found";
      }

      let a = data.assetType;
      var final = [];
      for (let j = 0; j < a.length; j++) {
        var asset = a[j];
        var result = await Wallet.total(exchange_name, dates[i], asset);
        final.push(result);
      }

      let r = {
        date: dates[i],
        result: final,
      };
      finalresult.push(r);
    }
    const res = {
      name: "solvency-wallet",
      result: finalresult,
    };

    // res.status(200).send(aa)
    return res;
  } catch (error) {
    // res.status(404).send(error)
    return error;
  }
};
