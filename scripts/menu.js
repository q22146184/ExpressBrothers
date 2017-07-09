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
  var costcoRef = firebase.database().ref('shops/costco/items');
  var hmartRef = firebase.database().ref('shops/hmart/items');
  var publixRef = firebase.database().ref('shops/publix/items');
  
  const items = document.getElementById('contentContainer');
  const hmart = document.getElementById('hmart');
  const costco = document.getElementById('costco');
  const publix = document.getElementById('publix');
  const cartEle = document.getElementById('cartContainer');

  
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        var currMart = "costco";
        var currItem = "";
        var currPrice = 0;
        var currQtt = 1;
        var currTotal = 0;
        var currName = "";
        var currPic = "";
        var userRef = firebase.database().ref('cart/' + firebaseUser.uid);
        userRef.on("value", function(snapshot) {
            var collapseCtn = 1;
            cartEle.innerHTML = "";
            snapshot.forEach(function(item) {
                var subtt = 0;
                item.forEach(function(item2){
                    if (item2.child("total").val() != null)
                        subtt += parseFloat(item2.child("total").val());
                });
                subtt = subtt.toFixed(2);
                if (subtt == 0) {
                    cartEle.innerHTML += " <div class='panel-group'><div class='panel panel-default'>" +
                        "<div class='panel-heading'><h4 class='panel-title'>" +
                        "<a data-toggle='collapse' href='#collapse" + collapseCtn + "'>" + item.child("name").val() + 
                        " subtotal: $" + subtt + "</a></h4></div>" +
                        "<div id='collapse" + collapseCtn + "' class='panel-collapse collapse'>" +
                        "<ul class='list-group' id='list" + collapseCtn + "'></ul>" +
                        "<div class='panel-footer'><button class='btn-checkout btn btn-primary' disabled id='checkout-" + item.child("name").val() + "'>Check out</button>" +
                        "<button style='float:right;' disabled id='btnCart' class='btn btn-default'>View cart</button>" +
                        "</div></div></div></div>";
                } else {
                    cartEle.innerHTML += " <div class='panel-group'><div class='panel panel-default animated flash'>" +
                        "<div class='panel-heading'><h4 class='panel-title'>" +
                        "<a data-toggle='collapse' href='#collapse" + collapseCtn + "'>" + item.child("name").val() + 
                        " subtotal: $" + subtt + "</a></h4></div>" +
                        "<div id='collapse" + collapseCtn + "' class='panel-collapse collapse'>" +
                        "<ul class='list-group' id='list" + collapseCtn + "'></ul>" +
                        "<div class='panel-footer'><button class='btn-checkout btn btn-primary' id='checkout-" + item.child("name").val() + "'>Check out</button>" +
                        "<button style='float:right;' id='btnCart' class='btn btn-default'>View cart</button>" +
                        "</div></div></div></div>";
                }
                // console.log(item.child("name").val());
                item.forEach(function(item2){
                    if (item2.child("name").val() != null) {
                        var listEle = document.getElementById("list" + collapseCtn);
                        listEle.innerHTML += "<li class='list-group-item'>" + item2.child("qtt").val() + 
                        " of " + item2.child("name").val() + ": $" + item2.child("total").val() + "</li>";
                    }
                });
                collapseCtn++;
            });
        });
        $('body').on('click', '.btn-checkout', function() {
            //console.log(this.id);

            window.location = "../checkout/index.html#" + this.id;
        });

        $('body').on('click', '.type-tabs', function() {
            var t = this.id.split("-")[1];
            console.log(t);
            console.log(currMart);
            var tempMartRef = firebase.database().ref("shops/" + currMart + "/items");
            tempMartRef.once("value", function(snapshot) {
                items.innerHTML ="";
                //console.log(snapshot);
                snapshot.forEach(function(item) {
            
                  var key = item.key;
                  var data = item.val();
                  if (t == "all" || data.type == t) {
                      // console.log(key);
                      // console.log(data.price + "," + data.unit + "," + data.pic);
                      items.innerHTML+=
                        "<div class='col-sm-3'>" +
                        "<div class='panel panel-default'>" +
                        "<div class='panel-body'>" +
                        "<center><img src=" + data.pic + " style='min-height:235px;max-width:100%;width:auto;height:auto;'></center>" +
                        "<h3>$" + data.price + "</h3><p>" + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</p>"+
                        "<button class='buyBtn' id='costco-" + data.name + "' data-toggle='modal' data-target='#myModal'>Buy now</button>" +
                        "</div></div></div>";
                    }
                });
                $(".buyBtn").click(function() {
                    //console.log($(this).attr("id"));
                    var itemName = $(this).attr("id").split("-");
                    //console.log(itemName[1]);
                    //console.log(snapshot.child("pork/id").val());
                    var name = snapshot.child(itemName[1] + "/name").val();
                    var pic = snapshot.child(itemName[1] + "/pic").val();
                    var price = snapshot.child(itemName[1] + "/price").val().toFixed(2);
                    var unit = snapshot.child(itemName[1] + "/unit").val();
                    currItem  = name;
                    currPrice  = price;
                    currTotal = price;
                    currName = name;
                    currPic = pic;
                        //console.log(name + pic + price + unit);
                    $("#buy-header").html("<h4 class='modal-title'>Buy " + name + " from H-mart</h4>");
                    document.getElementById("buy-content").innerHTML = 
                    "<center><img src=" + pic + " style='width:500px;height:400px;padding-top=200px'></center>" +
                    "<center><h3>Buy " + name + " at $" + price + " per " + unit + ".</h3></center>" +
                    "<label style='padding-left:25px;padding-right:10px;font-size:120%;'>Select quantity:</label>" + 
                    "<input id='qtt' min='1' type='number' size='20' id='numberinput' name='Buy quantity' value='1' style='width:40px;'/>" + 
                    "<label id='total' style='float:right;padding-right:25px;font-size:120%;'>Total Price: $" + price + "</label>";    
                });
            });
        });

        $('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            firebase.auth().signOut();
            console.log("logout");
        });

        $('body').on('click', '#btnCart', function() {
            window.location = "../cart/index.html";
        });

        $('body').on('click', '#toCart', function() {
            //console.log("to cart" + ct);
            //ct++;
            jQuery.noConflict();
            $('#myModal').modal('hide');
            console.log(firebaseUser.uid);
            var uid = firebaseUser.uid;
            console.log(currMart);
            var carMartRef = firebase.database().ref('cart/' + uid + '/' + currMart);
            carMartRef.once('value').then(function(snapshot) {
                if (snapshot.val() == null) {
                    carMartRef.set({
                        name: currMart
                    });
                }
            });
            currQtt = document.getElementById("qtt").value;
            var cartRef = firebase.database().ref('cart/' + uid + '/' + currMart + '/' + currItem);
            cartRef.once('value').then(function(snapshot) {
                if (snapshot.val() != null) {
                    var oldQtt = snapshot.child('qtt').val();
                    var oldTotal = snapshot.child('total').val();
                    var newQtt = parseFloat(oldQtt) + parseFloat(currQtt);
                    var newTotal = (newQtt * currPrice).toFixed(2);
                    cartRef.set({
                        name: currName,
                        price: currPrice,
                        qtt: newQtt,
                        total: newTotal,
                        pic: currPic
                    }).then(function(){
                        console.log("suceeded");
                        //alert("Item added to cart!");
                    }).catch(function(err) {
                        console.log("failed");
                    });
                } else {
                    cartRef.set({
                        name: currName,
                        price: currPrice,
                        qtt: currQtt,
                        total: currTotal,
                        pic: currPic
                    }).then(function(){
                        console.log("suceeded");
                        //alert("Item added to cart!");
                    }).catch(function(err) {
                        console.log("failed");
                    });
                }
            });
        });
        $('body').on('change', '#qtt', function() {
            currQtt = document.getElementById("qtt").value;
            var ttPrice = document.getElementById("qtt").value * currPrice;
            ttPrice = ttPrice.toFixed(2);
            currTotal = ttPrice;
            console.log(ttPrice);
            $("#total").text("Total Price: $" + ttPrice);
        }); 
      console.log(firebaseUser.email);

      var typeRef = firebase.database().ref("type");
      typeRef.once("value", function(snapshot) {
        snapshot.forEach(function(type) {
            console.log(type.val());
            $("#type-bar").append('<li><a style="color:black;" class="type-tabs" id="type-' + type.val() + '"">' + type.val() + '</a></li>');
        });   
      });

      costcoRef.once('value').then(function(snapshot) {
            console.log("reading from costco");
            currMart = "costco";
            items.innerHTML ="";
            //console.log(snapshot);
            snapshot.forEach(function(item) {
              var key = item.key;
              var data = item.val();
              // console.log(key);
              // console.log(data.price + "," + data.unit + "," + data.pic);
              items.innerHTML+=
                "<div class='col-sm-3'>" +
                "<div class='panel panel-default'>" +
                "<div class='panel-body'>" +
                "<center><img src=" + data.pic + " style='min-height:235px;max-width:100%;width:auto;height:auto;'></center>" +
                "<h3>$" + data.price + "</h3><p>" + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</p>"+
                "<button class='buyBtn' id='costco-" + data.name + "' data-toggle='modal' data-target='#myModal'>Buy now</button>" +
                "</div></div></div>";
            });
            $(".buyBtn").click(function() {
                //console.log($(this).attr("id"));
                var itemName = $(this).attr("id").split("-");
                //console.log(itemName[1]);
                //console.log(snapshot.child("pork/id").val());
                var name = snapshot.child(itemName[1] + "/name").val();
                var pic = snapshot.child(itemName[1] + "/pic").val();
                var price = snapshot.child(itemName[1] + "/price").val().toFixed(2);
                var unit = snapshot.child(itemName[1] + "/unit").val();
                currItem  = name;
                currPrice  = price;
                currTotal = price;
                currName = name;
                currPic = pic;
                    //console.log(name + pic + price + unit);
                $("#buy-header").html("<h4 class='modal-title'>Buy " + name + " from H-mart</h4>");
                document.getElementById("buy-content").innerHTML = 
                "<center><img src=" + pic + " style='width:500px;height:400px;padding-top=200px'></center>" +
                "<center><h3>Buy " + name + " at $" + price + " per " + unit + ".</h3></center>" +
                "<label style='padding-left:25px;padding-right:10px;font-size:120%;'>Select quantity:</label>" + 
                "<input id='qtt' min='1' type='number' size='20' id='numberinput' name='Buy quantity' value='1' style='width:40px;'/>" + 
                "<label id='total' style='float:right;padding-right:25px;font-size:120%;'>Total Price: $" + price + "</label>";    
            });
        });
        $(document).ready(function(){
          $("#hmart").click(function(){
            $(".navList").removeClass("active");
            $("#hmartNavList").addClass("active");
              currMart = "hmart";
              hmartRef.once('value').then(function(snapshot) {
                  console.log("reading from hmart");
                  items.innerHTML ="";
                  //console.log(snapshot);
                  snapshot.forEach(function(item) {
                    var key = item.key;
                    var data = item.val();
                    // console.log(key);
                    // console.log(data.price + "," + data.unit + "," + data.pic);
                    items.innerHTML+=
                      "<div class='col-sm-3'>" +
                      "<div class='panel panel-default'>" +
                      "<div class='panel-body'>" +
                      "<center><img src=" + data.pic + " style='min-height:235px;max-width:100%;width:auto;height:auto;'></center>" +
                      "<h3>$" + data.price + "</h3><p>" + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</p>"+
                      "<button class='buyBtn' id='hmart-" + data.name + "' data-toggle='modal' data-target='#myModal'>Buy now</button>" +
                      "</div></div></div>";
                  });
                  $(".buyBtn").click(function() {
                      //console.log($(this).attr("id"));
                      var itemName = $(this).attr("id").split("-");
                      //console.log(itemName[1]);
                      //console.log(snapshot.child("pork/id").val());
                      var name = snapshot.child(itemName[1] + "/name").val();
                      var pic = snapshot.child(itemName[1] + "/pic").val();
                      var price = snapshot.child(itemName[1] + "/price").val().toFixed(2);
                      var unit = snapshot.child(itemName[1] + "/unit").val();
                      currItem  = name;
                      currPrice  = price;
                      currTotal = price;
                      currName = name;
                      currPic = pic;
                          //console.log(name + pic + price + unit);
                      $("#buy-header").html("<h4 class='modal-title'>Buy " + name + " from H-mart</h4>");
                      document.getElementById("buy-content").innerHTML = 
                      "<center><img src=" + pic + " style='width:auto;height:auto;max-width:100%;padding-top=200px'></center>" +
                      "<center><h3>Buy " + name + " at $" + price + " per " + unit + ".</h3></center>" +
                      "<label style='padding-left:25px;padding-right:10px;font-size:120%;'>Select quantity:</label>" + 
                      "<input id='qtt' min='1' type='number' size='20' id='numberinput' name='Buy quantity' value='1' style='width:40px;'/>" + 
                      "<label id='total' style='float:right;padding-right:25px;font-size:120%;'>Total Price: $" + price + "</label>";
                  });
              });
          });

          $("#publix").click(function(){
            $(".navList").removeClass("active");
            $("#publixNavList").addClass("active");
              currMart = "publix";
              publixRef.once('value').then(function(snapshot) {
                  console.log("reading from publix");
                  items.innerHTML ="";
                  //console.log(snapshot);
                  snapshot.forEach(function(item) {
                    var key = item.key;
                    var data = item.val();
                    // console.log(key);
                    // console.log(data.price + "," + data.unit + "," + data.pic);
                    items.innerHTML+=
                      "<div class='col-sm-3'>" +
                      "<div class='panel panel-default'>" +
                      "<div class='panel-body'>" +
                      "<center><img src=" + data.pic + " style='min-height:235px;max-width:100%;width:auto;height:auto;'></center>" +
                      "<h3>$" + data.price + "</h3><p>" + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</p>"+
                      "<button class='buyBtn' id='publix-" + data.name + "' data-toggle='modal' data-target='#myModal'>Buy now</button>" +
                      "</div></div></div>";
                  });
                  $(".buyBtn").click(function() {
                      //console.log($(this).attr("id"));
                      var itemName = $(this).attr("id").split("-");
                      //console.log(itemName[1]);
                      //console.log(snapshot.child("pork/id").val());
                      var name = snapshot.child(itemName[1] + "/name").val();
                      var pic = snapshot.child(itemName[1] + "/pic").val();
                      var price = snapshot.child(itemName[1] + "/price").val().toFixed(2);
                      var unit = snapshot.child(itemName[1] + "/unit").val();
                      currItem  = name;
                      currPrice  = price;
                      currTotal = price;
                      currName = name;
                      currPic = pic;
                          //console.log(name + pic + price + unit);
                      $("#buy-header").html("<h4 class='modal-title'>Buy " + name + " from H-mart</h4>");
                      document.getElementById("buy-content").innerHTML = 
                      "<center><img src=" + pic + " style='width:auto;height:auto;max-width:100%;padding-top=200px'></center>" +
                      "<center><h3>Buy " + name + " at $" + price + " per " + unit + ".</h3></center>" +
                      "<label style='padding-left:25px;padding-right:10px;font-size:120%;'>Select quantity:</label>" + 
                      "<input id='qtt' min='1' type='number' size='20' id='numberinput' name='Buy quantity' value='1' style='width:40px;'/>" + 
                      "<label id='total' style='float:right;padding-right:25px;font-size:120%;'>Total Price: $" + price + "</label>";    
                  });
              });
          });



          $("#costco").click(function(){
            $(".navList").removeClass("active");
            $("#costcoNavList").addClass("active");
              currMart = "costco";
              costcoRef.once('value').then(function(snapshot) {
                  console.log("reading from costco");
                  items.innerHTML ="";
                  //console.log(snapshot.child("apple/id").val());
                  snapshot.forEach(function(item) {
                    var key = item.key;
                    var data = item.val();
                    // console.log(key);
                    // console.log(data.price + "," + data.unit + "," + data.pic);
                    items.innerHTML+=
                      "<div class='col-sm-3'>" +
                      "<div class='panel panel-default'>" +
                      "<div class='panel-body'>" +
                      "<center><img src=" + data.pic + " style='min-height:235px;max-width:100%;width:auto;height:auto;'></center>" +
                      "<h3>$" + data.price + "</h3><p>" + data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</p>"+
                      "<button class='buyBtn' id='costco-" + data.name + "' data-toggle='modal' data-target='#myModal'>Buy now</button>" +
                      "</div></div></div>";
                  });
                  $(".buyBtn").click(function() {
                      console.log($(this).attr("id"));
                      var itemName = $(this).attr("id").split("-");
                      // console.log(itemName[1]);
                      // console.log(snapshot.child("pork/id").val());
                      var name = snapshot.child(itemName[1] + "/name").val();
                      var pic = snapshot.child(itemName[1] + "/pic").val();
                      var price = snapshot.child(itemName[1] + "/price").val().toFixed(2);
                      var unit = snapshot.child(itemName[1] + "/unit").val();
                      currItem  = name;
                      currPrice  = price;
                      currTotal = price;
                      currName = name;
                      currPic = pic;
                          //console.log(name + pic + price + unit);
                      $("#buy-header").html("<h4 class='modal-title'>Buy " + name + " from H-mart</h4>");
                      document.getElementById("buy-content").innerHTML = 
                      "<center><img src=" + pic + " style='width:auto;height:auto;max-width:100%;padding-top=200px'></center>" +
                      "<center><h3>Buy " + name + " at $" + price + " per " + unit + ".</h3></center>" +
                      "<label style='padding-left:25px;padding-right:10px;font-size:120%;'>Select quantity:</label>" + 
                      "<input id='qtt' min='1' type='number' size='20' id='numberinput' name='Buy quantity' value='1' style='width:40px;'/>" + 
                      "<label id='total' style='float:right;padding-right:25px;font-size:120%;'>Total Price: $" + price + "</label>";    
                  });
              });
          });
        });
      //window.location = "../menu/index.html";
    } else {
      console.log('not logged in');
      window.location = "../index.html";
    }
  });
}());
