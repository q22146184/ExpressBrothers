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
  var nameArr = [];
  var idArr = [];
  var qttArr = [];
  var totalArr = [];
  var priceArr = [];
  var picArr = [];
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      var path = window.location.href.split("#")[1];
      var orderRef = firebase.database().ref(path);
      var custId = path.split("/")[1];
      orderRef.once("value", function(snapshot) {
          $("#cart-content").html('<div class="form-group">' +
                                '<div class="col-md-12">'+
                                    '<h4>Order Summary</h4>' +
                                '</div>' +
                            '</div>');
          var addr = snapshot.child("addr").val() + "," + snapshot.child("city").val();
          var time = snapshot.child("time").val();
          var subtotal = snapshot.child("subtotal").val();
          var earn = snapshot.child("processFee").val();
          earn = earn / 2;
          var mart = snapshot.child("mart").val();
          var phone = snapshot.child("phone").val();
          var custName = snapshot.child("fn").val() + " " + snapshot.child("ln").val();
          var items = snapshot.child("items");
          var i = 0;
          var timeArr = time.split("/")
          //TO-DO
          time = timeArr[0] + "/" + (parseInt(timeArr[1]) + 1) + "/" + timeArr[2] + "- " + "5 pm.";
          items.forEach(function(item) {
            var name = item.child("name").val();
            nameArr[i] = name;
            var qtt = item.child("qtt").val();
            qttArr[i] = qtt;
            var total = item.child("total").val();
            totalArr[i] = total;
            var pic = item.child("pic").val();
            picArr[i] = pic;
            idArr[i] = item.child("id").val();
            priceArr[i] = item.child("price").val();
            // $("#cart-content").append("asd");
            $("#cart-content").append('<div class="form-group">' +
                                  '<div class="col-sm-3 col-xs-3">' +
                                      '<img class="img-responsive" src="' + pic + '" />' +
                                  '</div>' +
                                  '<div class="col-sm-6 col-xs-6">' +
                                      '<div class="col-xs-12">' + name + '</div>' +
                                      '<div class="col-xs-12"><small>Quantity:<span>' + qtt + '</span></small></div>' +
                                  '</div>' +
                                  '<div class="col-sm-3 col-xs-3 text-right">' +
                                      '<h6><span>$</span>' + total + '</h6>' +
                                  '</div>' +
                              '</div>' +'<div class="form-group"><hr /></div>');
            i++;
          });
          $("#cart-content").append('<div class="form-group">'+
                                '<div class="col-xs-12">'+
                                    'Subtotal'+
                                    '<div class="pull-right"><span>$</span><span>' + subtotal + '</span></div>'+
                                '</div>'+
                                '<div class="col-xs-12">'+
                                    '<strong>You earn</strong>'+
                                    '<div class="pull-right"><span><strong>$' + earn + '</strong></span></div>'+
                                '</div>' +
                            '</div>'+
                            '<div class="form-group"><hr /></div>');
          $("#name-label").text(custName);
          $("#addr-label").text(addr);
          console.log("here");
          $("#phone-label").text(phone);
          $("#time-label").text(time);
      });
      $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });
      $("body").on("click", "#place-order", function() {
        var myName = $("#first-name").val() + " " + $("#last-name").val();
        var myPhone = $("#phone_number").val();
        var myEmail = $("#email_address").val();
        var myId = firebaseUser.uid;
        var completeTime = $("#time-label").text();
        if (myId == custId) {
          window.alert("Sorry, you cannot take your own order.");
        } else {
          shopperRef = firebase.database().ref(path + "/shopper");
          shopperRef.set({
            uid: myId,
            phone: myPhone,
            name: myName,
            email: myEmail,
            time: completeTime
          }).then(function() {
            orderRef.update({
              status: "accepted"
            });
            window.location = "success.html";
          }).catch(function(err){
            console.log("Take Order Error");
          })
        }
      });
    } else {
      console.log('not logged in');
      window.location = "../index.html";

    }
  });
}());
