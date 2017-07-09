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
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
    	var currMart = "";
		var cartRef = firebase.database().ref('cart/' + firebaseUser.uid);       
      	cartRef.on("value", function(snapshot) {
      		
      		$("#tabs-head").html('<li class="active"><a data-toggle="tab" href="#home">Home</a></li>');
      		$('#tabs-content').html('<div id="home" class="tab-pane fade in active">' +
      			'<h3>Home</h3>' +
          		'<p>Your business is valuable to us, please select a shop tab to view or edit your order. Please note that items from different shops must be placed with seperate orders.</p></div>');
      		var count = 0;
      		snapshot.forEach(function(marts) {
      			count = 0;
      			marts.forEach(function(countTemp) {
      				count++;
      			});
      			console.log(count);
      			if (count > 1) {
	      			$("#tabs-head").append("<li><a class='martTabs' data-toggle='tab' href='#tab-" + marts.child("name").val() + "'>" + marts.child("name").val() + "</a></li>");
	      			$("#tabs-content").append("<div id='tab-" + marts.child("name").val() + "' class='tab-pane fade'></div");
	      			$("#tab-" + marts.child("name").val()).append('<div class="container"><div class="row">' + 
	                  '<div class="col-sm-12 col-md-10 col-md-offset-1"><table class="table table-hover">' + 
	                  '<thead><tr><th>Product</th><th>Quantity</th>' +
	                  '<th class="text-center">Price</th><th class="text-center">Total</th><th> </th></tr></thead>' +
	                  '<tbody id="tbody-' + marts.child("name").val() + '"></tbody></table></div></div></div>');
	      			var martName = marts.child("name").val();
	      			var subtotal = 0;
	      			marts.forEach(function(item) {
	      				if (item.child("price").val() != null) {
	      					subtotal += parseFloat(item.child("total").val());
	      					var itemName = item.child("name").val().replace(" ", "_");
		      				//console.log(item.child("name").val());
		      				var name = item.child("name").val();
		      				console.log(name);
		      				$("#tbody-" + marts.child("name").val()).append('<tr>'+
		                                 ' <td class="col-sm-8 col-md-6">'+
		                                  '<div class="media">'+
		                                     ' <a class="thumbnail pull-left" href="#"> <img class="media-object" src="' + item.child("pic").val() + '" style="width: 72px; height: 72px;"> </a>'+
		                                      '<div class="media-body">'+
		                                          '<h4 class="media-heading">' + name.charAt(0).toUpperCase() + name.slice(1) + '</h4>'+
		                                         ' <h5 class="media-heading"> by ' + martName.charAt(0).toUpperCase() + martName.slice(1) + '</h5>'+
		                                          '<span>Status: </span><span class="text-success"><strong>In Stock</strong></span>'+
		                                      '</div>'+
		                                  '</div></td>'+
		                                  '<td class="col-sm-1 col-md-1" style="text-align: center">'+
		                                  // '<input type="email" class="form-control" id="currQtt-' + item.child("name").val() + '"" value="' + item.child("qtt").val() + '">'+
		                                  "<input type='number' size='20' min='1' id='newQtt-" + martName + "-" + itemName + "' value='" + item.child("qtt").val() + "' style='width:60px;'/>" +
		                                  '</td>'+
		                                  '<td class="col-sm-1 col-md-1 text-center"><strong>$' + parseFloat(item.child("price").val()).toFixed(2) + '</strong></td>'+
		                                  '<td class="col-sm-1 col-md-1 text-center"><strong>$' + parseFloat(item.child("total").val()).toFixed(2) + '</strong></td>'+
		                                  '<td class="col-sm-1 col-md-1">'+
		                                  '<button type="button" data-toggle="modal" data-target="#msgModal" class="btn btn-default updateBtn" id="updt-' + martName + '-' + item.child("name").val() + '" style="width:90%;">'+
		                                      '<span class="glyphicon glyphicon-ok"></span> Update '+
		                                  '</button><br>' +
		                                  '<button type="button" data-toggle="modal" data-target="#msgModal" class="btn btn-danger deleteBtn" id="dlt-' + martName + '-' + item.child("name").val() + '" style="width:90%;">'+
		                                      '<span class="glyphicon glyphicon-remove"></span> Remove'+
		                                  '</button></td>'+
		                              '</tr>');
	      				}
	      			});
	      			var processFee = subtotal * 0.1 + 10;
	      			processFee = processFee.toFixed(2);
	      			subtotal = subtotal.toFixed(2);
	      			var final = (parseFloat(subtotal) + parseFloat(processFee)).toFixed(2);
	      			$("#tbody-" + marts.child("name").val()).append("<tr>"+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td><h5>Subtotal</h5></td>'+
	                                  '<td class="text-right"><h5><strong>$' + subtotal + '</strong></h5></td>'+
	                              '</tr>'+
	                              '<tr>'+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td><h5>Process Fee</h5></td>'+
	                                  '<td class="text-right"><h5><strong>' + processFee + '</strong></h5></td>'+
	                              '</tr>'+
	                              '<tr>'+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td><h3>Total</h3></td>'+
	                                  '<td class="text-right"><h3><strong>$' + final + '</strong></h3></td>'+
	                              '</tr>'+
	                              '<tr>'+
	                                  '<td>   </td>'+
	                                 ' <td>   </td>'+
	                                  '<td>   </td>'+
	                                  '<td>'+
	                                  '<button type="button" id="btnMenu" class="btn btn-default">'+
	                                      '<span class="glyphicon glyphicon-shopping-cart"></span> Continue Shopping'+
	                                  '</button></td>'+
	                                  '<td>'+
	                                  '<button type="button" class="btn btn-success checkoutBtn" id="checkout-' + martName + '">'+
	                                      'Checkout <span class="glyphicon glyphicon-play"></span>'+
	                                  '</button></td>'+
	                              '</tr>');
      			}
      		});
      	});
		// $(".martTabs").click(function() {
		// 	console.log(this.id + "as");
		// });
		$('body').on('click', '.updateBtn', function() {
			console.log(this.id);
			console.log(this.id);
			console.log(this.id);
			console.log(this.id);
			var splited = $(this).attr("id").split("-");
			var martTemp = splited[1];
			var itemTemp = splited[2];
			var itemTemp2 = splited[2].replace(" ", "_");
			var refTemp = itemTemp.replace("%20", " ");
			var newQtt = $("#newQtt-"+ martTemp + "-" + itemTemp2).val();
			console.log("#newQtt-"+ martTemp + "-" + itemTemp2);
			var updateRef = firebase.database().ref('cart/' + firebaseUser.uid + '/' + martTemp + '/' + refTemp);
			var oldPrice, oldPic;
			updateRef.once('value').then(function(snapshot) {
				oldPrice = parseFloat(snapshot.child("price").val());
				oldPic = snapshot.child("pic").val();
				var oldQtt = snapshot.child("qtt").val();
				var diff = parseInt(newQtt) - parseInt(oldQtt);

				var newTotal = oldPrice * newQtt;
				console.log(itemTemp);
				console.log(newQtt);
				console.log(oldPic);
				console.log(newTotal);
				console.log(oldPrice);
				updateRef.set({
                        name: itemTemp,
                        price: oldPrice,
                        qtt: newQtt,
                        total: newTotal,
                        pic: oldPic
                    }).then(function(){
                        console.log("Update suceeded");
                        //window.alert("item updated");
                    }).catch(function(err) {
                        console.log("update failed");
                    });
			});
		});
		$('body').on('click', '.deleteBtn', function() {
			console.log(this.id);
			var splited = $(this).attr("id").split("-");
			var martTemp = splited[1];
			var itemTemp = splited[2];
			var deleteRef = firebase.database().ref('cart/' + firebaseUser.uid + '/' + martTemp + '/' + itemTemp);
			deleteRef.remove().then(function() {
				console.log("removed");
				//window.alert("item deleted");
			}).catch(function() {
				console.log("removal problem");
			});
		});
		$('body').on('click', '#logout-btn', function() {
            //console.log(this.id);
            console.log("logging out");
            firebase.auth().signOut();
            console.log("logout");
        });
		$('body').on('click', '#btnMenu', function() {
			window.location = "../menu/index.html";
		});

		$('body').on('click', '.checkoutBtn', function() {
			window.location = "../checkout/index.html#" + this.id;
		});
    } else {
      console.log('not logged in');
      window.location = "../index.html";
    }
  });
}());