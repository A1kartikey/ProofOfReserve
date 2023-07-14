var CRYPTOASSET = "vin"
var WALLETADDRESS = "kar"
var date = "2023-11-11"

var a = "https://api.coinmetrics.io/v4/blockchain-v2/" +
CRYPTOASSET +
"/balance-updates?accounts=" +
WALLETADDRESS +
"&end_time=" +
date+"T23:59:59.000000000Z" +
"&api_key=6oZAdNZcdtwAeLWAP4yG&page_size=1"

console.log(a)