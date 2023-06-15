const multer = require("multer")
const upload = multer({ dest: 'uploads/' });


module.exports = (app) => {

    // const pors = require( '../controllers/por.controller.js')
    var userHandlers = require('../controllers/userController.js');
    var assetcsv = require('../controllers/assetExchangeController.js')
    const thirdpartapi = require('../controllers/ThirdpartyapiController.js')
    const wallet = require('../controllers/assetWalletController.js')
    // todoList Routes
    app.route('/tasks')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/auth/register')
        .post(userHandlers.register);
        app.route('/auth/update')
        .post(userHandlers.update);


   app.route('/auth/sign_in')
        .post(userHandlers.sign_in);
    
// app.post('/por', pors.create)
    
    // app.get('/por', pors.findAll);
    // app.post('/porfind', pors.findOne);
    // app.post("/upload",upload.single('file'),assetcsv.exchange)
    app.post("/new-upload",upload.single('file'),assetcsv.new_exchange)
    
    app.post("/walletcsv",upload.single('file'),wallet.walletcsv)
    //app.get('/allasset', assetcsv.read);
    app.get("/exchangelist",assetcsv.getexchange_list)

    app.get("/getexchange_list",assetcsv.getexchange_list)
    app.get("/get_exchange_list",assetcsv.get_exchange_list)

    //get_exchange_list
    app.get("/get_assettype",assetcsv.getassettype)
    app.get("/get_dates",assetcsv.get_dates)
    
app.get('/liabilities_getdates',assetcsv.liabilities_getdates)
    
    // app.get("/get_exchange_wallet_findOne",wallet.exchange_wallet_findOne)
  
    app.get("/get_exchange_wallets",wallet.exchange_wallet_find)
    app.get("/get_exchange_wallet_find",wallet.get_exchange_wallet_find)
    //get_exchange_wallet_find

    //updateowner

    app.post("/updateowner",wallet.updateowner)
    app.get('/reserves-getdates',wallet.getdates)
    //app.get("/getbalance",assetcsv.getbalance)

    app.get("/totalasset",assetcsv.totalbalance)
    //app.post("/totalasstamountall",assetcsv.totalbalanceall)
    // app.get('/assetbyid/:id',assetcsv.readone)
    app.post('/thirdpartyapi', thirdpartapi.create)
    // Retrieve a single Note with noteId
  
}



