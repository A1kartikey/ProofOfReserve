const csv=require('csvtojson');
const WalletSchema = require('../models/asset-wallet');


exports.walletcsv = async (req, res) => {
    // upload csv
    console.log("req",req.body)
    var filepath = "uploads/" + req.file.filename;
    // console.log("@@@@@@",req.file.filename)
    
     let jsonArray= await csv().fromFile(filepath);
     //console.log(jsonArray)
        let sum = 0;
       


    ////////  Logic  /////////////
    var Arr = [ ] ; 
   var obj = { } ; 
   jsonArray.forEach( (element , index  ) => {
    var userForCheck1 =  element.Asset ; 
    var element1 = element ; 
    var indexOfOne = index ; 
    //console.log("value of userForCheck1 :" , userForCheck1) ; 
    var foo = 1 ;
    jsonArray.forEach( (element , i )  => {
        var userForCheck2 =  element.Asset; 
         
        //  console.log( "value of userForCheck2 : ",userForCheck2) ; 
        if(userForCheck2 == userForCheck1 ) {
           
            //console.log("Inside value of userForCheck1 :" ,userForCheck1, " At Index i: ",indexOfOne) ; 
           // console.log( "Inside value of userForCheck2 : ",userForCheck2 , " At Index i: ",i) ; 
            // console.log("Element: ",element);
            if (obj['ASSET' + `${userForCheck1}`] ==  undefined ){
                // console.log("Inside If" ) ;
                obj['ASSET' + `${userForCheck1}`] = {} ;
            }
            // console.log("Foo: ",foo)
         
            obj['ASSET' + `${userForCheck1}`]['Asset'+ `${foo}`]    = element ; 
            
            delete jsonArray[i];
            
            foo++ ; 
            // Arr.push(obj) ; 
        }
        
        
    //    console.log("Arr: ",d) ;

    });

    // delete d[index];

 });
 console.log("obj: ",obj);

//  res.send("working")

const Wallet = new WalletSchema({
    // date: new Date().valueOf(),
 date: req.body.date,
    exchange_name: req.body.exchange_name , 
    
    //dynamic number: exchangename+fourdigitid
    wallet_details: obj
});

// new Date().valueOf()

// Save por in the database
Wallet.save()
.then(data => {
    res.status(200).send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred whiles otring wallet addresses."
    });
});


};

exports.exchange_wallet_findOne = async (req, res) => {
    // Por.findOne(req.body.exchange_name)
    try {
     const data = await WalletSchema.findOne({
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
