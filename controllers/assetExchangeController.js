const csv=require('csvtojson');
const crypto = require('crypto') ;
// const {Asset} = require('../models/asset-cvs.model')
const {Exchange} = require("../models/exchange.model")

const ExchangeSchema = require('../models/exchange.model')
const Assettype = require('../models/asset-type')
// exports.create = async (req, res) => {
//     // upload csv

//     var filepath = "uploads/" + req.file.filename;
//     // console.log("@@@@@@",req.file.filename)
    
//      let jsonArray=await csv().fromFile(filepath);
//      console.log(jsonArray)
//      //res.send(jsonArray)
//      const d = await Asset.insertMany(jsonArray)
//      res.send("scucess")


// };


exports.exchange = async (req, res) => {
    // upload csv
   

    
    console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    // console.log("@@@@@@",req.file.filename)
    
     let jsonArray= await csv().fromFile(filepath);
     console.log(jsonArray)
     //let key = await  Object.key(jsonArray);
     //console.log("keys",key)
     //console.log("eeeeee",Object.keys(jsonArray[0]))
     var key = Object.keys(jsonArray[0]);
     const asset = new Assettype({
        // date: new Date().valueOf(),
         date: req.body.date,
        exchange_name: req.body.exchange_name , 
        //dynamic number: exchangename+fourdigitid
        assetType: key
    });
// Save por in the database
    await asset.save();

        let sum = 0;

            for (let i = 0; i<jsonArray.length; i++){

                const array = await  Object.values(jsonArray[i])

            // console.log(array)
            const b = array.shift()
                var cb; 
            var numberArray = [];
            length = array.length;
            for (var j = 0; j < length; j++)
                numberArray.push(parseInt(array[j]));
                cb = numberArray;
               // console.log("wwwww: ",cb)
                var r = 0;
                for (let k = 0; k<cb.length; k++){
                    //var r = cb[k]
                    
                    r += cb[k]

                
                }
                //console.log("r",r)
                var id = await jsonArray[i].UserId;
                //console.log("id",id)
                

                const k = id+r;
            
                const g = crypto.createHash('sha256').update(k).digest('hex');
                //console.log("hash",g)
                jsonArray[i].sum = r;
                jsonArray[i].hash =g;

            
            }

            const por = new ExchangeSchema({
                // date: new Date().valueOf(),
            date: req.body.date,
                exchange_name: req.body.exchange_name , 
                exchange_id: req.body.exchange_id,
                //dynamic number: exchangename+fourdigitid
                exchange_list: jsonArray
            });
// Save por in the database
            por.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the por."
                });
            });


};

exports.exchange_findOne = async (req, res) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await ExchangeSchema.findOne({
         exchange_name: req.query.exchange_name,
         date: req.query.date
     });
 
     if (data) {
       res.send(data)
         console.log(data);
     }else{
         res.send("data not found ")
     }
   } catch (error) {
     console.log(error);
   }}


exports.getexchange_list = async(req,res)=>{


    // const limitValue = req.query.limit || 2;
    // const skipValue = req.query.skip || 0;
    var data = await Asset.findOne({
        Exchange_name: req.body.Exchange_name,
    })
    // .limit(limitValue).skip(skipValue);
    res.status(200).send(data)
}


exports.totalbalance = async (req, res) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await ExchangeSchema.findOne({
         exchange_name: req.query.exchange_name,
         date: req.query.date
     });
 const a = data.exchange_list;
 var sum = 0;
for (let i =0; i<a.length; i++){

   // console.log(a[i].Eth)
   var assettype = req.query.asset
  // const a = a[i]
    let b = parseInt(a[i][assettype])
    sum = sum + b 
}
 console.log("aaaa",sum)
    var result = {
        Asset: assettype,
        Total: sum
    }
    res.status(200).send(result)
   } catch (error) {
     console.log(error);
   }}


   exports.getassettype = async (exchange_name,date) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await Assettype.findOne({
         exchange_name: exchange_name,
         date: date
     });
     //console.log("data",data)
     return data;

   } catch (error) {
     console.log(error);
   }}

exports.total = async (exchange_name,date,asset) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await ExchangeSchema.findOne({
         exchange_name: exchange_name,
         date: date
     });
 const a = data.exchange_list;
 var sum = 0;
for (let i =0; i<a.length; i++){

   // console.log(a[i].Eth)
   var assettype = asset
  // const a = a[i]
    let b = parseInt(a[i][assettype])
    sum = sum + b 
}
 console.log("aaaa",sum)
    var result = {
        Asset: assettype,
        Total: sum
    }
    return result;
   } catch (error) {
     console.log(error);
   }}