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

  const inputEmail = document.getElementById('email');
  const inputPassword = document.getElementById('password');
  const btnSignUp = document.getElementById('btnSignUp');
  const inputPassword2 = document.getElementById('password2');

  btnSignUp.addEventListener('click', e => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const pass2 = inputPassword2.value;
    if (pass != pass2 || email == "" || pass == "" || pass2 == "") {
      window.alert("Passwords entered don't match!");
      return;
    }
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser.email);
      window.location = "../menu/index.html";
    } else {
      console.log('not logged in');
    }
  });
}());
