
 var assettype = "sdfsdfsdf"
var Accountslist = "234234";
var date = "asdasd"

var a = "https://api.coinmetrics.io/v4/blockchain-v2/"+ assettype +"/accounts?accounts="+ Accountslist +"&pretty=true&api_key=6oZAdNZcdtwAeLWAP4yG&end_time="+ date

console.log(a.data[0].balance)
