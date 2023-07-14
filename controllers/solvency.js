const Assert = require("./assetExchangeController.js");

const Wallet = require("./assetWalletController.js");

exports.solvency_liabilities = async (exchange_name, start_date, end_date) => {
  try {
    //var exchange_name= req.query.exchange_name;
    var dates = await Assert.get_dates(exchange_name);

    if (dates == null) {
      throw "dates not found";
    }

    var ed = new Date(end_date).getTime();
    var sd = new Date(start_date).getTime();

    var DATES = dates.filter((d) => {
      var time = new Date(d).getTime();
      return sd <= time && time <= ed;
    });

    let finalresult = [];
    for (let i = 0; i < DATES.length; i++) {
      var data = await Assert.getassettype(exchange_name, DATES[i]);
      if (data == null) {
        throw "assettype not found";
      }

      let a = data.assetType;
      var final = [];
      for (let j = 0; j < a.length; j++) {
        var asset = a[j];
        var result = await Assert.total(exchange_name, DATES[i], asset);

        final.push(result);
      }

      let r = {
        date: DATES[i],
        result: final,
      };
      finalresult.push(r);
    }

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

exports.solvency_reserves = async (exchange_name, start_date, end_date) => {
  try {
    //var exchange_name= req.query.exchange_name;

    var dates = await Wallet.get_dates(exchange_name);

    if (dates == null) {
      throw "dates not found";
    }

    var ed = new Date(end_date).getTime();
    var sd = new Date(start_date).getTime();

    var DATES = dates.filter((d) => {
      var time = new Date(d).getTime();
      return sd <= time && time <= ed;
    });

    let finalresult = [];
    for (let i = 0; i < DATES.length; i++) {
      var data = await Wallet.getassettype(exchange_name, DATES[i]);

      if (data == null) {
        throw "assettype not found";
      }

      let a = data.assetType;
      var final = [];
      for (let j = 0; j < a.length; j++) {
        var asset = a[j];
        var result = await Wallet.total(exchange_name, DATES[i], asset);
        final.push(result);
      }

      let r = {
        date: DATES[i],
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
