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
  console.log("done");
  var nameArr = [];
  var idArr = [];
  var qttArr = [];
  var totalArr = [];
  var priceArr = [];
  var picArr = [];
  var finalTotal;
  var subtotal = 0;
  var processFee;
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      var mart = window.location.href.split("#")[1].split("-")[1];
      var cartRef = firebase.database().ref("cart/" + firebaseUser.uid + "/" + mart);
      cartRef.once("value", function(snapshot) {
        $("#cart-content").html('<div class="form-group">' +
                                '<div class="col-md-12">'+
                                    '<h4>Order Summary</h4>' +
                                '</div>' +
                            '</div>');

        var i = 0;
        snapshot.forEach(function(items) {
          if (items.child("name").val() != null) {
            var name = items.child("name").val();
            nameArr[i] = name;
            var qtt = items.child("qtt").val();
            qttArr[i] = qtt;
            var total = items.child("total").val();
            totalArr[i] = total;
            var pic = items.child("pic").val();
            picArr[i] = pic;
            idArr[i] = items.child("id").val();
            priceArr[i] = items.child("price").val();
            subtotal += parseFloat(total);
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
          }
        });
        processFee = subtotal * 0.1 + 10;
        processFee = processFee.toFixed(2);
        subtotal = subtotal.toFixed(2);
        finalTotal = parseFloat(processFee) + parseFloat(subtotal);
        finalTotal = finalTotal.toFixed(2);
        $("#cart-content").append('<div class="form-group">'+
                                '<div class="col-xs-12">'+
                                    '<strong>Subtotal</strong>'+
                                    '<div class="pull-right"><span>$</span><span>' + subtotal + '</span></div>'+
                                '</div>'+
                                '<div class="col-xs-12">'+
                                    '<small>Process Fee</small>'+
                                    '<div class="pull-right"><span>' + processFee + '</span></div>'+
                                '</div>' +
                            '</div>'+
                            '<div class="form-group"><hr /></div>'+
                            '<div class="form-group">'+
                                '<div class="col-xs-12">'+
                                    '<strong>Order Total</strong>'+
                                    '<div class="pull-right"><span>$</span><span>' + finalTotal + '</span></div>'+
                                '</div>'+
                            '</div>');
      });
      $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });
      $('body').on('click', '#place-order', function() {
        var country = $("#country").val();
        var fn = $("#first_name").val();
        var ln = $("#last_name").val();
        var addr = $("#address").val();
        var city = $("#city").val();
        var state = $("#state").val();
        var zip = $("#zip_code").val();
        var phone = $("#phone_number").val();
        var email = $("#email_address").val();
        console.log(country + fn + ln + addr + city + state + zip + phone + email);
        var tempRef = firebase.database().ref("placed/" + firebaseUser.uid);
        var orderRef;
        var key;
        var currentdate = new Date(); 
        var datetime = (currentdate.getMonth() + 1) + "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + " / "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes();
        //window.alert(datetime);
        tempRef.once("value", function(snapshot) {
          if (snapshot.val() == null) {
            console.log("not found");
            tempRef.set({
              uid: firebaseUser.uid
            }).then(function() {
              orderRef = tempRef.push({
                country : country,
                fn : fn,
                ln : ln,
                addr : addr,
                city : city,
                state : state,
                zip : zip,
                phone : phone,
                email : email,
                processFee : processFee,
                subtotal : subtotal,
                finalTotal : finalTotal,
                status : "received",
                time : datetime,
                mart : mart
              });
              key = orderRef.key;
              console.log(orderRef.key);
            }).then(function() {
              console.log(key);
              var placedRef = firebase.database().ref("placed/" + firebaseUser.uid + "/" + orderRef.key + "/items");
              for (i = 0; i < nameArr.length; i++) {
                placedRef.push({
                  name : nameArr[i],
                  price: priceArr[i],
                  qtt : qttArr[i],
                  id : idArr[i],
                  pic : picArr[i],
                  total : totalArr[i]
                });
              }
              var deleteRef = firebase.database().ref("cart/" + firebaseUser.uid + "/" + mart);
              deleteRef.set({
                name : mart
              });
              window.location = "success.html";
            }).catch(function(err) {
              window.alert(err.message);
              window.location = "../index.html";
            });
          } else {
            tempRef.update({
              uid : firebaseUser.uid
            }).then(function() {
              orderRef = tempRef.push({
                country : country,
                fn : fn,
                ln : ln,
                addr : addr,
                city : city,
                state : state,
                zip : zip,
                phone : phone,
                email : email,
                processFee : processFee,
                subtotal : subtotal,
                finalTotal : finalTotal,
                status : "received",
                time : datetime,
                mart : mart
              })
              console.log(orderRef.key);
              key = orderRef.key;
            }).then(function() {
              console.log(key);
              var placedRef = firebase.database().ref("placed/" + firebaseUser.uid + "/" + orderRef.key + "/items");
              for (i = 0; i < nameArr.length; i++) {
                placedRef.push({
                  name : nameArr[i],
                  price: priceArr[i],
                  qtt : qttArr[i],
                  id : idArr[i],
                  pic : picArr[i],
                  total : totalArr[i]
                });
              }
              var deleteRef = firebase.database().ref("cart/" + firebaseUser.uid + "/" + mart);
              deleteRef.set({
                name : mart
              })
              window.location = "success.html";
            }).catch(function(err) {
              window.alert(err.message);
              window.location = "../index.html";
            });
          }
        });
      });
    } else {
      console.log('not logged in');
      window.location = "../index.html";
    }
  });
}());