const multer = require("multer")
const upload = multer({ dest: 'uploads/' });


module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');
    const pors = require( '../controllers/por.controller.js')
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
    // Create a new Note
    app.post('/notes', notes.create);
app.post('/por', pors.create)
    // Retrieve all Notes
    app.get('/notes', notes.findAll);
    app.get('/por', pors.findAll);
    app.post('/porfind', pors.findOne);
    app.post("/upload",upload.single('file'),assetcsv.exchange)
    app.post("/walletcsv",upload.single('file'),wallet.walletcsv)
    //app.get('/allasset', assetcsv.read);
    app.post("/exchangelist",assetcsv.getexchange_list)

    app.get("/get_exchangelist",assetcsv.exchange_findOne)

    app.get("/get_assettype",assetcsv.getassettype)

    
    app.get("/get_exchange_wallet_findOne",wallet.exchange_wallet_findOne)
    //app.get("/getbalance",assetcsv.getbalance)

    app.get("/totalasset",assetcsv.totalbalance)
    //app.post("/totalasstamountall",assetcsv.totalbalanceall)
    // app.get('/assetbyid/:id',assetcsv.readone)
    app.post('/thirdpart', thirdpartapi.create)
    // Retrieve a single Note with noteId
  
}



