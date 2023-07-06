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


exports.thirdparty = async (Accountslist, assettype, Date) => {
  // upload csv
  try {
   
    var ress ;
    console.log("add",Accountslist)
    const url =
      "https://api.coinmetrics.io/v4/blockchain-v2/" + assettype + "/accounts";
     await axios
      .get(url, {
        params: {
          accounts: Accountslist,
          pretty: true,
          api_key: "6oZAdNZcdtwAeLWAP4yG",
          end_time: Date,
        },
      })
      .then((response) => {
        //console.log(response.data)
         ress = response.data
        //return a
        // res.status(200).send(response.data);
      })
      .catch((error) => {
        // handle error
        return error ; 
        //res.status(500).send(error);
      });

 return ress;
  } catch (error) {
     return error;
    //res.status(500).send(error);
  }
};


exports.test = async(Accountslist,assettype,date)=>{

try {
  

const response = await axios.get("https://api.coinmetrics.io/v4/blockchain-v2/"+ assettype +"/accounts?accounts="+ Accountslist +"&pretty=true&api_key=6oZAdNZcdtwAeLWAP4yG&end_time="+ date)
console.log("response: ") ;
 return response;

} catch (error) {
  return error.response;
}
}

