"use strict";

var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  User = mongoose.model("User");

exports.register = function (req, res) {
  var newUser = new User(req.body);

  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);

  newUser
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "email already exists",
      });
    });
};

exports.sign_in = async (req, res) => {
  try {
    var data = await User.findOne({
      email: req.body.email,
    });

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
    return res.status(200).send({
      token: jwt.sign(
        {
          email: data.email,
          fullName: data.fullName,
          _id: data._id,
          role: data.role,
          exchange: data.Exchange,
          accountStatus: data.accountStatus
        },
        "RESTFULAPIs"
      ),
    });
  } catch (error) {
    res.status(404).send(error);
  }
};

// update password api
exports.update = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    const update = { hash_password: bcrypt.hashSync(req.body.password, 10) };
    const opts = { new: true };

    let doc = await User.findOneAndUpdate(filter, update, opts);
    res.send(doc);
  } catch (error) {
    res.status(500).send(error);
  }
};

// update user status
exports.update_accountStatus = async (req, res) => {
  try {

    console.log("req",req.body)
    const filter = { email: req.body.email };
    const update = {
      accountStatus: req.body.accountStatus,
      approvalDate: req.body.approvalDate,
    };
    const opts = { new: true };

    let doc = await User.findOneAndUpdate(filter, update, opts);
    res.send(" user accountStatus Updated").status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

// // update user requestStatus
// exports.update_requestStatus = async (req, res) => {
//   try {
//     const filter = { email: req.body.email };
//     const update = {
//       requestStatus: req.body.requestStatus,
//       approvalDate: req.body.approvalDate,
//     };
//     const opts = { new: true };

//     let doc = await User.findOneAndUpdate(filter, update, opts);
//     res.send("Status Updated").status(200);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };



exports.getuserlist = async (req, res) => {
  try {
    const data = await User.find({
      // email: req.query.email
    });
   let result = [];
   for (let i = 0; i < data.length; i++) {
     //console.log(data[i].status)
     if (data[i].accountStatus == "pending") {
       result.push(data[i]);
     }
   }

   res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
//user list of assigne screen
exports.getapproveduserlist = async (req, res) => {
  try {
    const data = await User.find({
      // email: req.query.email
    });
    let result = [];
    for (let i = 0; i < data.length; i++) {
      //console.log(data[i].status)
      if (data[i].accountStatus == "Approved") {
        result.push(data[i]);
      }
    }

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

exports.update_admin = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    const update = {
      End_Date: req.body.End_Date,
      Exchange: req.body.Exchange,
      Assign_Date: req.body.Assign_Date,
    };
    const opts = { new: true };

    let doc = await User.findOneAndUpdate(filter, update, opts);
    res.send(doc);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.delete = async (req, res) => {
  try {
    var result = await User.findOneAndRemove({ email: req.body.email });
    console.log(result);
    res.send("deleted user").status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};
