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
      var orderRef = firebase.database().ref("placed");
      orderRef.once("value", function(snapshot) {
        var count = 0;
        snapshot.forEach(function(user) {
          user.forEach(function(order) {
            console.log(user.val());
            console.log("this order is" + order.child("shopper").child("uid").val());
            console.log("i am" + firebaseUser.uid);
            if (order.child("shopper").child("uid").val() == firebaseUser.uid) {
              var custName = order.child("fn").val() + " " + order.child("ln").val();
              var addr = order.child("addr").val();
              var phone = order.child("phone").val();
              var email = order.child("email").val();
              var subtotal = order.child("subtotal").val();
              var mart = order.child("mart").val();
              var time = order.child("shopper").child("time").val();
              var status = order.child("status").val();
              var youEarn = (parseFloat(order.child("processFee").val()) / 2).toFixed(2);
              $("#main-col").append('<div class="panel panel-default">'+
                    '<div class="panel-heading text-center"><h5>Order from ' + mart + ' to be completed by ' + time + ', Subtotal: $' + subtotal + ', You earn: $' + youEarn +'</h5></div>'+
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
                    '<div class="panel-footer text-center"> Delivery to ' + custName + ' at ' + addr + '. Phone: ' + phone + ', Email: ' + email + ', Status: ' + status + '</div>' +
                  '</div>');
              var items = order.child("items");
              items.forEach(function(item) {
                var name = item.child("name").val();
                var pic = item.child("pic").val();
                var price = item.child("price").val();
                var qtt = item.child("qtt").val();
                var total = item.child("total").val();
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
        })
        // if (count < 2) {
        //   $("#main-col").append("<center><h2>Your order history is empty</h2></center>");
        // }
      });
      $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });
    } else {
      console.log('not logged in');
      window.location = "../index.html";
    }
  });
}());
