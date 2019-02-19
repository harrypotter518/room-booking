'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

/**
 * This function gets all the users in the Database
 */
exports.get_all_users = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.send({
        error: err,
        message: 'No users fround',
        code: 204
      });
    }
    res.send({
      message: 'All users returned',
      data: users,
      code: 200
    });
  });
};

/**
 * Creates a new user in the DB
 */
exports.create_a_user = (req, res) => {
  var data = req.body.data;
  var newUser = new User({
    name: data.name,
    email: data.email,
    password: bcrypt.hashSync(data.password, 10)
  });
  newUser.save((err, user) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t create new user',
        code: 400
      });
    }
    res.status(201).json({
      message: 'User created',
      success: true,
      obj: user
    });
  });
};

/**
 * Function to login a user
 */
exports.login_a_user = (req, res) => {
  let data = req.body.data;
  User.findOne({
    email: data.email
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        success: false,
        title: 'An error occurred',
        error: err
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        title: 'Login failed',
        error: {
          message: 'Invalid login credentials'
        }
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      return res.status(401).json({
        success: false,
        title: 'Login failed',
        error: {
          message: 'Invalid login credentials'
        }
      });
    }
    res.status(200).json({
      message: 'Successfully logged in',
      success: true,
      obj: user
    });
  });
};

/**
 * Gets a single user using the user ID sent as a url parameter
 */
exports.get_single_user = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      res.send({
        error: err,
        message: 'Couldn\'t find user',
        code: 400
      });
    }
    res.send({
      message: 'User found',
      data: user,
      code: 200
    });
  });
};

/**
 * Updates a user. Finds them via the user ID in the url parameter
 */
exports.update_a_user = (req, res) => {
  User.findByIdAndUpdate({
      _id: req.params.userId
    },
    req.body, {
      new: true
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: 'Couldn\'t update user',
          code: 400
        });
      };
      res.send({
        message: 'User updated successfully',
        data: user,
        code: 200
      });
    });
};

/**
 * Deletes the user from the db
 * TODO: Change method to status 'deleted in db'
 * TODO: Then if they really want to delete have admin do it?
 */
exports.delete_a_user = (req, res) => {
  User.remove({
      _id: req.params.userId
    },
    (err, user) => {
      if (err) {
        res.send({
          error: err,
          message: 'Couldn\'t delete user',
          code: 400
        });
      }
      res.send({
        message: 'User deleted successfully',
        data: user,
        code: 200
      });
    });
}
