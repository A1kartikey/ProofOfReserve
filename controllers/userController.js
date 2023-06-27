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
        message: err,
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
        },
        "RESTFULAPIs"
      ),
    });
  } catch (error) {
    res.status(404).send(error);
  }
};

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
