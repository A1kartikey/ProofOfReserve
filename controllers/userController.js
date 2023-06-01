'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
//   newUser.save(function(err, user) {
//     if (err) {
//       return res.status(400).send({
//         message: err
//       });
//     } else {
//       user.hash_password = undefined;
//       return res.json(user);
//     }
//   });

  newUser.save()
  .then(user =>{
    res.json(user);
  }).catch(err =>{
    res.status(400).send({
        message: err
      });
  })
};

// exports.sign_in = function(req, res) {
//   User.findOne({
//     email: req.body.email
//   }, function(err, user) {
//     if (err) throw err;
//     if (!user || !user.comparePassword(req.body.password)) {
//       return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
//     }
//     return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id, role: user.role }, 'RESTFULAPIs') });
//   });
// };
// exports.sign_in  = async (req,res) =>{
    
// const user = User.findOne({
//     email: req.body.email
//   });
//   console.log("user",user)
//     if (!user ) {
//       return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
//     }
//     return res.json( user,{ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id, role: user.role }, 'RESTFULAPIs') });
//   }
  exports.sign_in = async (req, res) => {
  var data = await User.findOne({
        email: req.body.email,
    })

    //   .then((err, user) => {
    //     if (err) {
    //       res.status(500).send({ message: err });
    //       return;
    //     }
  
        if (!data) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          data.hash_password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }
  

        //res.send(user)
        //console.log("password",data.hash_password)
        return res.send({ token: jwt.sign({ email: data.email, fullName: data.fullName, _id: data._id, role: data.role }, 'RESTFULAPIs') });
      
  };

  exports.update = async (req,res) =>{


    
    const filter = { email: 'vineeth@gmail.com' };
    const update = { hash_password : bcrypt.hashSync(req.body.password, 10)};
    const opts = { new: true };
    
    let doc = await User.findOneAndUpdate(filter, update, opts);
    res.send(doc)
  };


  




exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};
exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};