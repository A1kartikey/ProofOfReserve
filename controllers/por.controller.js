// const por = require('../models/por.model.js');
const Por = require('../models/por.model.js')
const axios = require('axios')
const { MerkleTree } = require('merkletreejs') ;
const crypto = require('crypto') ;
// Create and Save a new por
// exports.create = (req, res) => {
//     // Create a por
//     const por = new Por({
//         exchange_name: req.body.exchange_name || "Untitled por", 
//         merkletree: req.body.merkletree
//     });

//     // Save por in the database
//     por.save()
//     .then(data => {
//         res.send(data);
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "Some error occurred while creating the por."
//         });
//     });
// };

// Retrieve and return all pors from the database.
exports.findAll = (req, res) => {
    Por.find()
    .then(pors => {
        res.send(pors);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving pors."
        });
    });
};

exports.findOne = async (req, res) => {
   // Por.findOne(req.body.exchange_name)
   try {
    const data = await Por.findOne({
        exchange_name: req.body.exchange_name
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

exports.create = async (req,res)=>{

    const response = await axios({
        url: "https://api.coinmetrics.io/v4/blockchain/btc/accounts?api_key=6oZAdNZcdtwAeLWAP4yG",
        method: "get",
    });
    //console.log(response.data)
    const jsonarray = response.data.data;
  
   // console.log("1111111111111",jsonarray)
    var concatResult = [] ; 
    var Tree = { } ;
    
     jsonarray.forEach(element => {
    
          concatResult.push( element.account + element.balance );
        });
      //console.log("concatResult: ",concatResult ) ;
    
    
    var hashArray = [] ;
    var hashOfElement ;
    concatResult.forEach(element => { 
    
      const h = crypto.createHash('sha256').update(element).digest('hex');
    
      hashArray.push(h) ;
    })
    
    // console.log('hashArray: ', hashArray[1]) ; 
    // console.log(typeof hashArray)
    
    tree = new MerkleTree(hashArray) ;
    
    //console.log('Leaves: ',tree.leaves[0].toString('hex'));
    //console.log('Tree: ',tree.layers);
    
    var arry = [] ; 
    var foo =1 ;
    
    tree.layers.forEach(element => {
        arry = [] ;
        element.forEach( x  => {        
            arry.push(x.toString('hex'));
        })
    
        Tree['level'+ `${foo}` ]  = arry ;
        foo++ ;
        
    });
    //console.log("22222222",arry)
    //console.log('Tree: ',Tree) ;
    

    const por = new Por({
        date: new Date().valueOf(),
        exchange_name: req.body.exchange_name , 
        merkletree: Tree
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
}
