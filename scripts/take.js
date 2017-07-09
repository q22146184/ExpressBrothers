(function() {
  const config = {
        apiKey: "AIzaSyBLhVAw-BnKT9klY7Sf2u7idi87n6KZKRA",
        authDomain: "expressbrothers-7d192.firebaseapp.com",
        databaseURL: "https://expressbrothers-7d192.firebaseio.com",
        projectId: "expressbrothers-7d192",
        storageBucket: "expressbrothers-7d192.appspot.com",
        messagingSenderId: "408188016309"
  };
  firebase.initializeApp(config);
  function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: -25.363882, lng: 131.044922 }
        });

        var bounds = {
          north: -25.363882,
          south: -31.203405,
          east: 131.044922,
          west: 125.244141
        };

        // Display the area between the location southWest and northEast.
        map.fitBounds(bounds);

        // Add 5 markers to map at random locations.
        // For each of these markers, give them a title with their index, and when
        // they are clicked they should open an infowindow with text from a secret
        // message.
        var secretMessages = ['This', 'is', 'the', 'secret', 'message'];
        var lngSpan = bounds.east - bounds.west;
        var latSpan = bounds.north - bounds.south;
        for (var i = 0; i < secretMessages.length; ++i) {
          var marker = new google.maps.Marker({
            position: {
              lat: bounds.south + latSpan * Math.random(),
              lng: bounds.west + lngSpan * Math.random()
            },
            map: map
          });
          attachSecretMessage(marker, secretMessages[i]);
        }
      }
      function attachSecretMessage(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
          content: secretMessage
        });

        marker.addListener('click', function() {
          infowindow.open(marker.get('map'), marker);
        });
      }

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });
    } else {
      console.log('not logged in');
    }
  });
}());
