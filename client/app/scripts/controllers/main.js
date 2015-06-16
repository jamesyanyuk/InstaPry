'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, uiGmapGoogleMapApi, $http, Lightbox) {
    $scope.resultsAvailable = false;
    $scope.igMarkers = [];

    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
      console.log('Google Maps API Loaded.');

      $scope.markerOptions = {
        mainMarker: {
          draggable: true
        },
        igMarkers: {
          animation: maps.Animation.DROP
        }
      };

      $scope.openLightboxModal = function(index) {
        Lightbox.openModal($scope.imageSources, index);
      }

      $scope.map = {
        center: { latitude: 45, longitude: -73 },
        zoom: 8, // orig 8
        options: {
          scrollwheel: false,
          streetViewControl: false
        },
        events: {
          click: function(map, eventName, eventArgs) {
            var ev = eventArgs[0];
            var lat = ev.latLng.lat();
            var lng = ev.latLng.lng();

            loadImages(lat, lng, 1000, $http, $scope);

            $scope.mainMarker = {
              id: 0,
              latitude: lat,
              longitude: lng,
              showWindow: false,
              events: {
                dragend: function() {
                  this.latitude = ev.latLng.lat();
                  this.longitude = ev.latLng.lng();

                  loadImages(this.latitude, this.longitude, 1000, $http, $scope);
                }
              }
            };

            $scope.$apply();
          }
        }
      };
    });
  });

function createMarker(lat, lng) {
  var marker = {
    id: Math.floor((Math.random() * 1000000) + 1),
    coords: {
      latitude: lat,
      longitude: lng
    }
  }

  return marker;
}

function loadImages(lat, lng, dist, $http, $scope) {
  var clientId = "bfebe20a864949a8b8cfab854ce290e1";
  var reqUrl = "https://api.instagram.com/v1/media/search?lat="
    + lat + "&lng=" + lng + "&client_id=" + clientId + "&distance=" + dist
    + "&callback=JSON_CALLBACK";

  $scope.resultsAvailable = false;
  $scope.igMarkers = [];

  $http.jsonp(reqUrl)
    .success(function(data, status, headers, config) {
      if(data.data.length > 0) {
        $scope.imageSources = [];

        for(var ind in data.data) {
          $scope.imageSources.push({
            url: data.data[ind].images.standard_resolution.url
          });
          var marker = createMarker(data.data[ind].location.latitude, data.data[ind].location.longitude);
          $scope.igMarkers.push(marker);
        }
        console.log($scope.igMarkers);

        $scope.resultsAvailable = true;
      } else {
        $scope.resultsAvailable = false;
      }
    })
    .error(function(data, status, headers, config) {
      $scope.resultsAvailable = false;
    });
}
