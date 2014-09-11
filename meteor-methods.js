if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    users: function() {
      Meteor.call('getUsers', function(err, users) {
        Session.set('users', users);
      });

      return Session.get('users');
    },
    remoteUsers: function() {

      //call getRemoteUsers only when remoteUsers session is falsey
      if (!Session.get('remoteUsers')) {
        Meteor.call('getRemoteUsers', function(err, users) {
          Session.set('remoteUsers', users);
          console.log('remoteUsers: ', users, new Date());
        });
      }

      console.log('returning remoteUsers: ', Session.get('remoteUsers'));
      return Session.get('remoteUsers');
    },
    strangeUsers: function() {

      //try to remove/comment this if, you will see strange behaviour
      //every time when value of session is changed, this gets called
      if (!Session.get('strangeUsers')) {
        Meteor.call('getStrangeUsers', function(err, users) {
          Session.set('strangeUsers', users);
          console.log('strangeUsers: ', users);
        });
      }

      return Session.get('strangeUsers');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    getUsers: function() {
      console.log('getUsers: ', new Date());
      return [ 'Peter', 'John', 'Monica', 'Julia' ];
    },
    getRemoteUsers: function() {
      Future = Npm.require('fibers/future');
      var future = new Future();

      //simulate longer response. This can be call to remote API
      setTimeout(function() {
        console.log('getRemoteUsers: ', new Date());
        future.return([ 'Peter', 'John', 'Monica', 'Julia' ]);
      }, 2000);

      //wait for future.return
      return future.wait();
    },
    getStrangeUsers: function() {
      Future = Npm.require('fibers/future');
      var future = new Future();

      //simulate longer response. This can be call to remote API
      setTimeout(function() {
        console.log('getStrangeUsers: ', new Date());
        future.return([ 'Peter', 'John', 'Monica', 'Julia', new Date() ]);
      }, 2000);

      //wait for future.return
      return future.wait();
    }
  });
}
