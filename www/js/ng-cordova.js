
angular.module('ngCordova', [
  'ngCordova.plugins'
]);

angular.module('ngCordova.plugins', [
	 'camera',
	 'network'
]);

//#### Begin Individual Plugin Code ####

// install   :   cordova plugin add org.apache.cordova.camera
// link      :   https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md#orgapachecordovacamera

angular.module('ngCordova.plugins.camera', [])

  .factory('$cordovaCamera', ['$q', function ($q) {

    return {
      getPicture: function (options) {
        var q = $q.defer();

        if (!navigator.camera) {
          q.resolve(null);
          return q.promise;
        }

        navigator.camera.getPicture(function (imageData) {
          q.resolve(imageData);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      cleanup: function () {
        var q = $q.defer();

        navigator.camera.cleanup(function () {
          q.resolve();
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add org.apache.cordova.network-information
// link      :      https://github.com/apache/cordova-plugin-network-information/blob/master/doc/index.md

angular.module('ngCordova.plugins.network', [])

  .factory('$cordovaNetwork', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    var offlineEvent = function () {
      var networkState = navigator.connection.type;
      $timeout(function () {
        $rootScope.$broadcast('$cordovaNetwork:offline', networkState);
      });
    };

    var onlineEvent = function () {
      var networkState = navigator.connection.type;
      $timeout(function () {
        $rootScope.$broadcast('$cordovaNetwork:online', networkState);
      });
    };

    document.addEventListener("deviceready", function () {
      if (navigator.connection) {
        document.addEventListener("offline", offlineEvent, false);
        document.addEventListener("online", onlineEvent, false);
      }
    });

    return {
      getNetwork: function () {
        return navigator.connection.type;
      },

      isOnline: function () {
        var networkState = navigator.connection.type;
        return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
      },

      isOffline: function () {
        var networkState = navigator.connection.type;
        return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
      },

      clearOfflineWatch: function () {
        document.removeEventListener("offline", offlineEvent);
        $rootScope.$$listeners["$cordovaNetwork:offline"] = [];
      },

      clearOnlineWatch: function () {
        document.removeEventListener("online", offlineEvent);
        $rootScope.$$listeners["$cordovaNetwork:online"] = [];
      }
    };
  }])
  .run(['$cordovaNetwork', function ($cordovaNetwork) {
  }]);
