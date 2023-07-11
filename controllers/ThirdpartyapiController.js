const axios = require("axios");

exports.create = async (req, res) => {
  // upload csv
  try {
    //const Accountslist = "3QKLDgD5nQZUfbp1fPqb2mrvNsQxA7wxc2"
    const Accountslist = req.body.accountlist;
    const assettype = req.body.assettype;
    const Date = req.body.date;
    const url =
      "https://api.coinmetrics.io/v4/blockchain-v2/" + assettype + "/accounts";
    axios
      .get(url, {
        params: {
          accounts: Accountslist,
          pretty: true,
          api_key: "6oZAdNZcdtwAeLWAP4yG",
          end_time: Date,
        },
      })
      .then((response) => {
        res.status(200).send(response.data);
      })
      .catch((error) => {
        // handle error
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};






