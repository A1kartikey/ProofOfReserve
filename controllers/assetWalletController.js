const csv=require('csvtojson');
//const WalletSchema = require('../models/asset-wallet');

const Exchange_Wallets = require("../models/new-exchange-wallet")
const Wallet_Assettype = require('../models/new-asset-wallet')


exports.walletcsv = async (req, res) => {
    // upload csv
    try{

    
   var exchange_name = req.body.exchange_name;   
   var date = req.body.date; 

   // checking if same data is exist throw error
   const data = await Exchange_Wallets.find({
    exchange_name: req.query.exchange_name,
    date: req.query.date
   })
   if (data.length != 0){
    throw "exchange with date already exist"
  }


   // console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    // console.log("@@@@@@",req.file.filename)
    
     let jsonArray= await csv().fromFile(filepath);
        var a = [];
        console.log(jsonArray)
            for (let i = 0; i<jsonArray.length; i++){
                jsonArray[i].exchange_name = exchange_name;
                jsonArray[i].date = date;
                jsonArray[i].VERIFIED_OWNERSHIP = ''
                jsonArray[i].VERIFIED_DATE = ''
                var b = jsonArray[i].CRYPTOASSET;
                a.push(b)
            }
            const assettype = [... new Set(a)];
            const asset = new Wallet_Assettype({
                // date: new Date().valueOf(),
                 date: req.body.date,
                exchange_name: req.body.exchange_name , 
                //dynamic number: exchangename+fourdigitid
                assetType: assettype
            });
            const dd =  await asset.save();
        if (dd == null){
            throw new Error("assettype not saved")
        }

       const d = await Exchange_Wallets.insertMany(jsonArray)

//console.log(jsonArray)
    res.status(200).send(d)
    }catch(error){
        res.status(500).send(error)
    }
};

exports.updateowner = async (req, res) => {
    // Por.findOne(req.body.exchange_name)
    try {
    //  const data = await Exchange_Wallets.findOne({
    //     WALLETADDRESS: req.query.wallet_address,
    //     exchange_name: req.query.exchange_name,
        
    //     date: req.query.date
    //  });
 

  console.log(req.body)
     const filter = { WALLETADDRESS: req.body.wallet_address,
        exchange_name: req.body.exchange_name,
        date: req.body.date};
     const update = { VERIFIED_OWNERSHIP : req.body.verification, VERIFIED_DATE : req.body.verification_date, };
     const opts = { new: true };
     
     
     let doc = await Exchange_Wallets.findOneAndUpdate(filter, update, opts);
    console.log("data",doc)
     res.send(doc)
    //  if (data) {
    //    res.send(data)
    //      console.log(data);
    //  }else{
    //      res.send("merkletree not found for ")
    //  }
   } catch (error) {
     console.log(error);
   }}


   exports.exchange_wallet_find = async (req,res) => {
    // Por.findOne(req.body.exchange_name)
    console.log("aaaaa",req.query.exchange_name);
    console.log("bbbbbb",req.query.Last_Updated);

    try {
        const limitValue = req.query.limit || 10;
        const skipValue = req.query.skip || 0;
     const data = await Exchange_Wallets.find({
        exchange_name: req.query.exchange_name,
        date: req.query.date
     }).limit(limitValue).skip(skipValue)
     res.status(200).send(data)

   } catch (error) {
     console.log(error);
   }}


   exports.get_exchange_wallet_find = async (req,res) => {
    // Por.findOne(req.body.exchange_name)
    console.log("aaaaa",req.query.exchange_name);
    console.log("bbbbbb",req.query.Last_Updated);

    try {

     const data = await Exchange_Wallets.find({
        exchange_name: req.query.exchange_name,
        date: req.query.date
     })
     //console.log("ssssssssssss",data[0])
    let final = [];
      for (let i=0; i<data.length; i++){

        let a = {
          CRYPTOASSET: data[i].CRYPTOASSET,
          WALLETADDRESS: data[i].WALLETADDRESS,
          BALANCE: data[i].BALANCE,
          ASOFDATE: data[i].date,
          VERIFIED_OWNERSHIP: data[i].VERIFIED_OWNERSHIP,
          VERIFIED_DATE: data[i].VERIFIED_DATE

        }
        final.push(a)
      }

     res.status(200).send(final)


   } catch (error) {
     console.log(error);
   }}


   exports.getassettype = async (exchange_name,date) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await Wallet_Assettype.findOne({
         exchange_name: exchange_name,
         date: date
     });
     //console.log("data",data)
     return data;

   } catch (error) {
     return (error);
   }}

   exports.get_dates = async (exchange_name) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await Wallet_Assettype.find({
         exchange_name: exchange_name
     });
     var final = []
     //console.log("data--get_dates",data)
            for (let i = 0; i<data.length; i++){
                final.push(data[i].date)
            }


     return final;

   } catch (error) {
     console.log(error);
   }}

exports.total = async (exchange_name,date,asset) => {
    // Por.findOne(req.body.exchange_name)
    try {
        const data = await Exchange_Wallets.find({
            exchange_name: exchange_name,
            date: date
         });
let d = data;
 var sum = 0;
 for (let i = 0; i<d.length; i++){
 
 
     if (d[i].CRYPTOASSET == asset){
         //console.log(d[i])
         sum = sum+ parseFloat(d[i].BALANCE)
 
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
