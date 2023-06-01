const csv=require('csvtojson');
const crypto = require('crypto') ;
// const {Asset} = require('../models/asset-cvs.model')
const {Exchange} = require("../models/exchange.model")

const ExchangeSchema = require('../models/exchange.model')

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
         console.log("wwwww: ",cb)
         var r = 0;
         for (let k = 0; k<cb.length; k++){
            //var r = cb[k]
            
            r += cb[k]

          
         }
         console.log("r",r)
         var id = await jsonArray[i].UserId;
         console.log("id",id)
        

        const k = id+r;
    
        const g = crypto.createHash('sha256').update(k).digest('hex');
        console.log("hash",g)
        jsonArray[i].sum = r;
        jsonArray[i].hash =g;

    
    }

    //console.log(jsonArray)

    //console.log("sum",sum)

     //res.send(jsonArray)
    //  const d = await Asset.insertMany(jsonArray)


const por = new ExchangeSchema({
    // date: new Date().valueOf(),
 date: req.body.date,
    exchange_name: req.body.exchange_name , 
    exchange_id: req.body.exchange_id,
    //dynamic number: exchangename+fourdigitid
    exchange_list: jsonArray
});

// new Date().valueOf()

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
         res.send("merkletree not found for ")
     }
   } catch (error) {
     console.log(error);
   }}


exports.getexchange_list = async(req,res)=>{



    var data = await Asset.findOne({
        Exchange_name: req.body.Exchange_name,
    })
    res.status(200).send(data)
}

// exports.getbalance = async(req,res)=>{
//     try{

    
//     //var query = { exchange_list: "BTC" }
// var a = req.query.asset;
// var b = req.query.date;
// var sum = 0;
// console.log("Asset",a)
//    await  ExchangeSchema.aggregate([
//     {
//         "$unwind": "$exchange_list"
//     },{
//         $match:{
            
//             $and: [
//                 {"exchange_list.Asset": a, "date": b, }
//                ]
//         }
       
//     },{
//         $group:{
//             _id: "$_id",
//             push:{
//                 $first: "$push"
//             },
//             exchange_list:{
//                 $push: "$exchange_list"
//             }
//         }
//     }
//    ]
//     )
// //     Exchange.aggregate([{
// //         $unwind: "$exchange_list"
// //     },{
// //         $match:{
// //             Asset: "BTC"
// //         }
// //     }
// // ])
//     .then(data => {
// // var d = JSON.stringify(data);
// console.log("data",data[0].exchange_list)
// var list = data[0].exchange_list

// for(let i=0;i<list.length;i++){
//     var first =  parseInt(list[i].Quantity);
//     console.log("first",first)
//     sum = sum + first
//     //console.log("result",result)
// }
// var result = {
//     Asset: req.query.asset,
//     Sum: sum
// }
//         res.json(result);
//        // console.log("data",JSON.stringify(data))
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "Some error occurred while retrieving data."
//         });
//     })
// }catch(err){
//     res.send("Error",err)
// }
// }

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
