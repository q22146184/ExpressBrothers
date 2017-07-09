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

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      $('body').on('click', '#logout-btn', function() {
          //console.log(this.id);
          firebase.auth().signOut();
          console.log("logout");
      });
      var orderRef =firebase.database().ref("placed/" + firebaseUser.uid + "/");
      orderRef.on("value", function(snapshot) {
        $("#main-col").text("");
        var count = 0;
        snapshot.forEach(function(snapshot2) {
          if (snapshot2.child("mart").val() != null) {
            var subtotal = snapshot2.child("subtotal").val();
            var finalTotal = snapshot2.child("finalTotal").val();
            var processFee = snapshot2.child("processFee").val();
            var mart = snapshot2.child("mart").val();
            var time = snapshot2.child("time").val();
            var status = snapshot2.child("status").val();
            $("#main-col").append('<div class="panel panel-default">'+
                    '<div class="panel-heading text-center"><h5>Order from ' + mart + ' placed on ' + time + ', Subtotal: $' + subtotal + ', Process Fee: $' + processFee + ', Total: $' + finalTotal + '</h5></div>'+
                    '<div class="panel-body">'+
                      '<table class="table borderless">'+
                        '<thead>'+
                          '<tr>'+
                            '<td></td>'+
                            '<td class="text-center">Item</td>'+
                            '<td class="text-center">Price</td>'+
                            '<td class="text-center">Quantity</td>'+
                            '<td class="text-center">Total</td>'+
                          '</tr>'+
                        '</thead>'+
                        '<tbody id="tbody-' + count + '">'+
                        '</tbody>'+
                      '</table> '+
                    '</div>'+
                    '<div class="panel-footer text-right" id="footer-' + count + '"> Status: ' + status + '         </div>' +
                  '</div>');
            if (status == "accepted") {
              $("#footer-" + count).append('<button class="btn btn-primary delivery" id="placed/' + firebaseUser.uid + '/' + snapshot2.key + '">Confirm Delivery</button>');
            }
            var items = snapshot2.child("items");
            items.forEach(function(item) {
              var name = item.child("name").val();
              var pic = item.child("pic").val();
              var price = parseFloat(item.child("price").val()).toFixed(2);
              var qtt = item.child("qtt").val();
              var total = parseFloat(item.child("total").val()).toFixed(2);
              $("#tbody-" + count).append('<tr>'+
                          '<td class="col-md-3">'+
                            '<img src="' + pic + '" style="width: 72px; height: 72px;"> </a>'+
                          '</td>'+
                          '<td class="text-center">' + name.charAt(0).toUpperCase() + name.slice(1) + '</td>'+
                          '<td class="text-center">$' + price + '</td>'+
                          '<td class="text-center">' + qtt + '</td>'+
                          '<td class="text-center">$' + total + '</td>'+
                          '</tr>');
            });
            count++;
          }
        });
        $("body").on("click", ".delivery", function() {
          console.log(this.id);
          firebase.database().ref(this.id).update({
            status: "delivered"
          }).then(function() {
            window.alert("Delivery Confirmed");
          }).catch(function(err) {
            console.log(err.message);
          });
        })
        $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });
        if (count < 2) {
          $("#main-col").append("<center><h2>Your order history is empty</h2></center>");
        }
      });
    } else {
      console.log('not logged in');
      window.location = "../index.html";
    }
  });
}());
