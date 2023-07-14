const axios = require("axios");

// exports.create = async (req, res) => {
//   // upload csv
//   try {
//     //const Accountslist = "3QKLDgD5nQZUfbp1fPqb2mrvNsQxA7wxc2"
//     const Accountslist = req.body.accountlist;
//     const assettype = req.body.assettype;
//     const Date = req.body.date;
//     const url =
//       "https://api.coinmetrics.io/v4/blockchain-v2/" + assettype + "/accounts";
//     axios
//       .get(url, {
//         params: {
//           accounts: Accountslist,
//           pretty: true,
//           api_key: "6oZAdNZcdtwAeLWAP4yG",
//           end_time: Date,
//         },
//       })
//       .then((response) => {
//         res.status(200).send(response.data);
//       })
//       .catch((error) => {
//         // handle error
//         res.status(500).send(error);
//       });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

exports.create = async (req, res) => {
  // upload csv
  const Accountslist = req.body.accountlist;
  const assettype = req.body.assettype;
  const Date = req.body.date;

  try {
    const response = await axios.get(
      "https://api.coinmetrics.io/v4/blockchain-v2/" +
        assettype +
        "/balance-updates?accounts=" +
        Accountslist +
        "&end_time=" +
        Date +
        "&api_key=6oZAdNZcdtwAeLWAP4yG&page_size=1"
    );

    var aa = response.data.data[0];
   
   try {
    
   
    const res = await axios.get(
      "https://api.coinmetrics.io/v4/blockchain-v2/" +
        assettype +
        "/accounts?pretty=true&end_time=" +
        Date +
        "&api_key=6oZAdNZcdtwAeLWAP4yG&page_size=1"
    );
    var ressult2 = res.data.data[0];

    
  } catch (error) {
    throw "coinmetrics 2api error"
  }

var data = [];

    var result = {
      
      account: Accountslist,
      balance: aa.new_balance,
      creation_time: Date,
      Blockheight: ressult2.creation_height
      
    };
    data.push(result)

    // var r = {
    //   data
    // }
    res.status(200).send({data});
  } catch (error) {
    res.status(500).send(error);
  }
};
