
const axios = require('axios')

exports.create = async (req, res) => {
    // upload csv
    //const Accountslist = "3QKLDgD5nQZUfbp1fPqb2mrvNsQxA7wxc2"
    const Accountslist = req.body.accountlist;
    const assettype = req.body.assettype;
    const url = "https://api.coinmetrics.io/v4/blockchain-v2/"+assettype+"/accounts"
    axios.get(url, {
        params: {
          accounts: Accountslist,
          pretty: true,
          api_key: "6oZAdNZcdtwAeLWAP4yG"
 }
      })
        .then(response => {
         res.json(response.data)
        })
        .catch(error => {
          // handle error
          console.log(error)
        });


};