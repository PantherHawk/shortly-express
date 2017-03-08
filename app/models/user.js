var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName : 'users',
  hasTimeStamps: true,
  //each user hasMany Links?
  // links: function() {
  //   return this.hasMany(Link);
  // }
  comparePassword: (attemptedPassword, actualPassword, callback) => {
    bcrypt.compare(attemptedPassword, actualPassword, (err, isMatch) => {
      callback(isMatch);
    });
  },
  initialize: function() {
    // when instance created, invoke hashPassword.
    this.on('creating', function() {
      var model = this;
      //Once the promise is resolved (after setting the password in our model to the hashed password) the model is then signaled that it is free to write to the database.
      var promiseHash = Promise.promisify(bcrypt.hash);
      return promiseHash(this.get('password'), null, null)
        .then(function(hash) {
          model.set('password', hash);
        });
    });
  }
});

module.exports = User;