const csv=require('csvtojson');
const crypto = require('crypto') ;
// const {Asset} = require('../models/asset-cvs.model')
const {Exchange} = require("../models/exchange.model")

const ExchangeSchema = require('../models/exchange.model')
const Assettype = require('../models/asset-type')

const Exchange_liabilities = require("../models/new-exchange-liabilities")
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



exports.new_exchange = async (req, res) => {
    // upload csv
    try{

    
   var exchange_name = req.body.exchange_name;  
   var date = req.body.date;    

    // checking if same data is exist throw error
   const data = await Exchange_liabilities.find({
    exchange_name: exchange_name,
    date: date
      });

      if (data.length != 0){
        throw "exchange with date already exist"
      }
      console.log("dataaaaa",data)
   // console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    // console.log("@@@@@@",req.file.filename)
    
     let jsonArray= await csv().fromFile(filepath);
        var a = [];
        let aa= [];
            for (let i = 0; i<jsonArray.length; i++){

               
                jsonArray[i].exchange_name = exchange_name;
                jsonArray[i].date = date;
                jsonArray[i].Last_Updated = date;
                  var bb = jsonArray[i].Customer_ID;
                   aa.push(bb)
                 var b = jsonArray[i].Cryptoasset;
                 a.push(b)
               
            }

           const assettype = [... new Set(a)];
           const coustmerid = [... new Set(aa)];
          // const date = jsonArray[0].date;
      // saving cryptoasset types in new schema 
           const asset = new Assettype({
            // date: new Date().valueOf(),
             date: req.body.date,
            exchange_name: req.body.exchange_name , 
            //dynamic number: exchangename+fourdigitid
            assetType: assettype,
            coustmer_id: coustmerid
        });
    // Save por in the database
        const dd =  await asset.save();
        if (dd == null){
            throw new Error("assettype not saved")
        }
       console.log("22222222222222222222")
       const d = await Exchange_liabilities.insertMany(jsonArray)

//console.log(jsonArray)
    res.status(200).send(d)
    }catch(error){
        res.status(500).send(error)
    }
};



exports.getexchange_list = async (req,res) => {
    // Por.findOne(req.body.exchange_name)
    console.log("aaaaa",req.query.exchange_name);
    console.log("bbbbbb",req.query.date);
    try {
        const limitValue = req.query.limit || 10;
        const skipValue = req.query.skip || 0;
     const data = await Exchange_liabilities.find({
        exchange_name: req.query.exchange_name,
        date: req.query.date
     }).limit(limitValue).skip(skipValue)
     res.status(200).send(data)
     console.log("dddd",data)

   } catch (error) {
     console.log(error);
   }}
   
   exports.get_exchange_list = async (req,res) => {
    // Por.findOne(req.body.exchange_name)
    console.log("aaaaa",req.query.exchange_name);
    console.log("bbbbbb",req.query.date);
    try {
       
     const data = await Exchange_liabilities.find({
        exchange_name: req.query.exchange_name,
        date: req.query.date
     })
const final = []
     for (let i = 0; i<data.length; i++){
    let a = {
     
      Customer_ID: data[i].Customer_ID,
      Cryptoasset: data[i].Cryptoasset,
      Balance: data[i].Balance,
      ASOFDATE: data[i].Last_Updated
    }
    final.push(a)

}

     res.status(200).send(final)
     console.log("dddd",data[0])

   } catch (error) {
     console.log(error);
   }}


   exports.get_liabilities = async (exchange_name,date,id) => {
    // Por.findOne(req.body.exchange_name)
    // console.log("aaaaa",req.query.exchange_name);
    // console.log("bbbbbb",req.query.date);
    try {
       
     const data = await Exchange_liabilities.find({
        exchange_name: exchange_name,
        date: date
     })
     //res.status(200).send(data)
    
        let d = data;
        var sum = 0;
        for (let i = 0; i<d.length; i++){
     
     
         if (d[i].Customer_ID == id){
             //console.log(d[i])
             sum = sum+ parseFloat(d[i].Balance)
     
         }
        
     }
     const h = id;
const dd = sum;
//console.log("ddfgdfgdfg")
const k = h+dd+date;
const g = crypto.createHash('sha256').update(k).digest('hex');


     //console.log("aaaa",sum)
        var result = {
            ID: id,
            Total: sum,
            hash: g,
            Date: date

        }
        return result;

    
     console.log("dddd",data)

   } catch (error) {
     console.log(error);
   }}


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
 //console.log("aaaa",sum)
    var result = {
        Asset: assettype,
        Total: sum
    }
    res.status(200).send(result)
   } catch (error) {
      res.send(error);
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
     return (error);
   }}

exports.total = async (exchange_name,date,asset) => {
    // Por.findOne(req.body.exchange_name)
    try {
        const data = await Exchange_liabilities.find({
            exchange_name: exchange_name,
            date: date
         });
    let d = data;
    var sum = 0;
    for (let i = 0; i<d.length; i++){
 
 
     if (d[i].Cryptoasset == asset){
         //console.log(d[i])
         sum = sum+ parseFloat(d[i].Balance)
 
     }
    
 }
 //console.log("aaaa",sum)
    var result = {
        Asset: asset,
        Total: sum
    }
    return result;
   } catch (error) {
     console.log(error);
   }}



exports.get_dates = async (exchange_name) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await Assettype.find({
         exchange_name: exchange_name
     });
     var final = []
     //console.log("data",data)
            for (let i = 0; i<data.length; i++){
                final.push(data[i].date)
            }


     return final;

   } catch (error) {
     console.log(error);
   }}


   