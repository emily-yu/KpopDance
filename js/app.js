

// PopUp Button
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

/*
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: '<your-storage-bucket>'
    messengingSenderId: '<your-messenging-sender-id'
*/

  //Init Firebase
  var config = {
    apiKey: "AIzaSyDGVjkbqPSe8IH772nmQMoFqaDAOaZVPak",
    authDomain: "kwebsite-ef4f2.firebaseapp.com",
      databaseURL: "https://kwebsite-ef4f2.firebaseio.com",
      storageBucket: "kwebsite-ef4f2.appspot.com",
      messagingSenderId: "737586793221"
  };
  firebase.initializeApp(config);

  // Get Elements
  // Login
  const txtemail = document.getElementById('email');
  const txtpassword = document.getElementById('password');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  const adminPanel = document.getElementById('adminPanel');
  const loginButton = document.getElementById('loginButton');
  const adminText = document.getElementById('adminText');

  // Add Admin Constants
  const adminInit = document.getElementById('adminInit');
  const addAdmin = document.getElementById('addAdmin');
  const adminEmail = document.getElementById('adminEmail');
  const adminName = document.getElementById('adminName');

  const testButton = document.getElementById('testButton');

  // PreObject
  const preObject = document.getElementById('object');
  const DBrefobject = firebase.database().ref().child('admins'); // Create a reference to Firebase Database under element admins
  const DBreflist = DBrefobject.child('email');
  const ulList = document.getElementById('list');

  // Post Text
  const postButton = document.getElementById('postButton');
  const postTitle = document.getElementById('Header');
  const postText = document.getElementById('Text');

  const FBpostRef = firebase.database().ref().child('numberPosts'); // ref to element number of posts
  
  const iDiv = document.getElementById('block');

  const welcomeMessage = document.getElementById('welcomeMessage'); // not working


  // Get Date for posting
  // For todays date;
  Date.prototype.today = function () { 
      return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
  }

  // For the time now
  Date.prototype.timeNow = function () {
       return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  }

  // load upcoming posts on right page
  document.addEventListener('DOMContentLoaded', function() {
    // retrieve info from posts firebase
      // div for stored posts
    if ((location.pathname.substring(location.pathname.lastIndexOf("/") + 1)) == "upcoming.html") { // only runs if on this page
      var iDiv = document.createElement('div');
      iDiv.id = 'block';
      iDiv.className = 'block';

      FBpostRef.on('value', snap =>{
      var postRef = firebase.database().ref().child("post");
      for (i = 1; i < (snap.val()+1); i++) {  // goes from 1- (FBpostRef.value - 1) - iterates through all post key
        const innerRef = postRef.child(i);
        // super slow feelsbad
        innerRef.once('value', snap =>{
          var jsonPre = JSON.stringify(snap.val(), null, 3);
          var json = JSON.parse(jsonPre);

          // logs value of title elements
          const titleRef = innerRef.child('title');
          titleRef.once('value', snap => {
            var jsonPre2 = JSON.stringify(snap.val(), null, 3);
            var json2 = JSON.parse(jsonPre2);
            console.log(json2)

            // Create the inner div (body) before appending to the body
            var innerDiv = document.createElement('div');
            innerDiv.innerHTML = json2; //change to retrieved text
            innerDiv.className = 'block-3';
            innerDiv.classList.add("post");
            innerDiv.classList.add("upcomingHeader");
            iDiv.appendChild(innerDiv); // add it to the div

            // Then append the whole thing onto the body
            document.getElementsByTagName('body')[0].appendChild(iDiv);
          })

          // logs value of text elements
          const textRef = innerRef.child('text');
          textRef.once('value', snap => {
            var jsonPre2 = JSON.stringify(snap.val(), null, 3);
            var json2 = JSON.parse(jsonPre2);
            console.log(json2)

            // Create the inner div (body) before appending to the body
            var innerDiv = document.createElement('div');
            innerDiv.innerHTML = json2; //change to retrieved text
            innerDiv.className = 'block-2';
            innerDiv.classList.add("post");
            iDiv.appendChild(innerDiv); // add it to the div

            // Then append the whole thing onto the body
            document.getElementsByTagName('body')[0].appendChild(iDiv);
          })

          // logs value of text elements
          const dateRef = innerRef.child('date');
          dateRef.once('value', snap => {
            var jsonPre2 = JSON.stringify(snap.val(), null, 3);
            var json2 = JSON.parse(jsonPre2);
            console.log(json2)

            // Create the inner div (body) before appending to the body
            var innerDiv = document.createElement('div');
            innerDiv.innerHTML = json2; //change to retrieved text
            innerDiv.className = 'block-4';
            innerDiv.classList.add("post");
            iDiv.appendChild(innerDiv); // add it to the div

            // post seperator
            var seperator = document.createElement('hr')
            seperator.classList.add("primary")
            iDiv.appendChild(seperator);

            // Then append the whole thing onto the body
            document.getElementsByTagName('body')[0].appendChild(iDiv);
          })
        })
      }
    })
    }
    else {
      console.log("rip wrong page")
    }
  }, false);

// admin.html specific
if ((location.pathname.substring(location.pathname.lastIndexOf("/") + 1)) == "admin.html") { // only runs if on this page
  // Add Post Button
  postButton.addEventListener('click', e => {
      // reference to place to create new post
      var postRef = firebase.database().ref().child("post");

      // retrieve new Date
      var newDate = new Date();
      var datetime = newDate.today() + " @ " + newDate.timeNow();

      // Create new post
      FBpostRef.once('value', snap => {
        var keyRef = snap.val() + 1; // amount of posts, plus 1
        console.log(keyRef);

        // update keyvalue
        var personRef = firebase.database().ref("numberPosts");
        personRef.once('value', snap => {
          var jsonPre = JSON.stringify(snap.val(), null, 3);
          var json = JSON.parse(jsonPre);
          firebase.database().ref().update({"numberPosts": keyRef});
        })

        console.log(personRef)

        // values to log lul
        var loggedTitle = postTitle.value;
        var loggedText = postText.value;
        
        // retrieve admin info
        var user = firebase.auth().currentUser;
        if (user != null) {
            var loggedName = user.displayName;
        }
        else {
          // stuff
        }

        // set values
        postRef.child(keyRef).update({
          date: datetime,
          title: loggedTitle,
          text: loggedText,
          user: loggedName
        })

      });
  });
}
else {
  console.log("kek wrong page")
}



// retrieve emails of all admins
  DBrefobject.on('value', snap => {
    var jsonPre = JSON.stringify(snap.val(), null, 3);
    var json = JSON.parse(jsonPre);

    console.log(json);
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
        const li = document.createElement('li');
        li.innerText = json[key].email;
        ulList.appendChild(li);
      }
    }
  });

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


  
  // LogOut
  // Switch to index.html when clicked
  // works
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

            // retrieve emails of all admins
            DBrefobject.on('value', snap => {
              var jsonPre = JSON.stringify(snap.val(), null, 3);
              var json = JSON.parse(jsonPre);
              for (var key in json) {
                if (json.hasOwnProperty(key)) {
                  console.log(json[key].email);
                  if (email == json[key].email) {
                      console.log("Logged into Admin Console")
                      adminPanel.classList.remove('hidden')
                      break;
                  }
                  else {
                    console.log("Not an Admin.")
                    adminPanel.classList.add('hidden')
                  }
                }
              }
          });
        }
    }
    else {
      console.log("Logged Out.")

      //Makes the button invisible
      btnLogout.classList.add('hidden');
    }
    //End Login
});

// Add Admin Button
addAdmin.addEventListener('click', e => {
  var booksRef = firebase.database().ref().child("admins");
  booksRef.child(adminName.value).set({
      email: adminEmail.value
  });
});

