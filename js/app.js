// jQuery PopUp Button
$(function() {
    //----- OPEN
    $('[data-popup-open]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
 
        e.preventDefault();
    });
 
    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
 
        e.preventDefault();
    });
});

(function() {

/*
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket>'
    messengingSenderId: '<your-messenging-sender-id'
*/

  //Init Firebase
  var config = {
     apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket>'
    messengingSenderId: '<your-messenging-sender-id'
  };
  firebase.initializeApp(config);

  // Login
  // Get elements
  const txtemail = document.getElementById('email');
  const txtpassword = document.getElementById('password');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  const adminPanel = document.getElementById('adminPanel');
  const loginButton = document.getElementById('loginButton');
  const adminText = document.getElementById('adminText');
  //Firebase Login
    btnLogin.addEventListener('click', e => {
      //Retrieve values for authentication: email, password
      const email = txtemail.value;
      const password = txtpassword.value;

      //Authenticate using details
      const auth = firebase.auth();
      //Login if there is a user
      const promise = auth.signInWithEmailAndPassword(email, password);
      //Catch any errors and send them to the console
      promise.catch(e => console.log(e.message))
    });

    btnSignUp.addEventListener('click', e => {
      //TODO: Check if it is a real email
      const email = txtemail.value;
      const password = txtpassword.value;
      const auth = firebase.auth();
      const promise = auth.createUserWithEmailAndPassword(email, password);
      promise.catch(e => console.log(e.message))
    });
    //End Login

} ());
  
  //LogOut
  //Switch to index.html when clicked
  btnLogout.addEventListener('click', e =>{
    //Sign out the currently logged in User
    firebase.auth().signOut();
  });

  //realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) { // If there is a user
      console.log("Loggin in")

      // Login Adjustments
      loginButton.innerHTML = "Logout"
      adminText.innerHTML = "You are logged in."
      btnLogout.classList.remove('hidden');
      btnLogin.classList.add('hidden');
      btnSignUp.classList.add('hidden');

      // Check if user is one of admin
      var user = firebase.auth().currentUser;
      var name, email;

        if (user != null) {
            name = user.displayName;
            email = user.email;

            // Retrieve Admin Emails
            const leadsRef = firebase.database().ref().child('admins');
            const emailRef = leadsRef.child('email');

            // Check if Admin
            emailRef.on('value', snap => {
              const admin = JSON.stringify(snap.val(), null, 3);
              const stringEmail = JSON.parse(admin)

              if (email == stringEmail) {
                  console.log("Logged into Admin Console")
                  adminPanel.classList.remove('hidden')
              }
              else {
                console.log("Not an Admin.")
                adminPanel.classList.add('hidden')
            }
          })
        }
    }
    else {
      console.log("Logged Out.")

      //Makes the button invisible
      btnLogout.classList.add('hidden');
    }
    //End Login
  });



// 6:01 - https://www.youtube.com/watch?v=dBscwaqNPuk

/*
TODO: 
Add editing capabilities for names and descriptions for Board
Add editing capabilities for logo and team name
Add youtube imbedding from admin panel
Posting System
*/