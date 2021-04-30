function init(){
    document.getElementById("welcome").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("game_settings").style.display = "none";
    var modal = document.getElementById("about");
    modal.style.display = "none";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {modal.style.display = "none";}
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";}
    }
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            if (modal.style.display === "block") {
                modal.style.display = "none";}
        }
    };
    document.getElementById("toRegister").onclick = function(){displayRegistrationForm();}
    document.getElementById("toRegis").onclick = function(){displayRegistrationForm();}
    document.getElementById("toLogin").onclick = function(){displayLogin();}
    document.getElementById("toLog").onclick = function(){displayLogin();}
    document.getElementById("toWelcome").onclick = function(){displayWelcome();}
    document.getElementById("toAbout").onclick = function(){displayAbout();}
    document.getElementById("startGame").onclick = function(){handleStartGame()}
    document.getElementById("leftMove").onclick = function(){takeKeysFromUser("left");}
    document.getElementById("rightMove").onclick = function(){takeKeysFromUser("right");}
    document.getElementById("upMove").onclick = function(){takeKeysFromUser("up");}
    document.getElementById("downMove").onclick = function(){takeKeysFromUser("down");}
}

function handleStartGame(){
    document.getElementById("game_settings").style.display = "block";
    document.getElementById("game_controller").style.display = "none";
}

function takeKeysFromUser(direction){
    let count = 0;
    document.onkeydown = function(evt) {
        if (count>0){
            return;
        }
        evt = evt || window.event;
        for (var key in keys){
            if (key === direction){
                continue;
            }
            if (keys[key] === evt.code){
                alert("This key has been chosen already for another direction.\n Please choose another key.");
                return;
            }
        }
        keys[direction] = evt.code
        count++;
        myFunction();
    };
    return;
}

function myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
  return;
}

function displayWelcome(){
    document.getElementById("welcome").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
}

function displayAbout(){
    document.getElementById("about").style.display = "block";
}



function displayRegistrationForm(){
    // TODO: add more validation rules according to the assignment
    document.getElementById("login").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("welcome").style.display = "none";
    document.getElementById("register").style.display = "block";  
    document.getElementById("submit").onclick = function(){handleRegistration();}
    $("#registrationForm").validate({
        rules: {
            username : {
            required: true
            },
            password: {
            required: true,
            minlength: 6
            },
            firstname : {
            required: true
            },
            lastname : {
            required: true
            },
            email: {
            required: true,
            email: true
            },
            date: {
                required: true
            }
        },
    });
}

function displayLogin(){
    document.getElementById("register").style.display = "none";
    document.getElementById("game_controller").style.display = "none";
    document.getElementById("welcome").style.display = "none";
    document.getElementById("login").style.display = "block"; 
    document.getElementById("attemptLogin").onclick = function(){handleLogin();}
}

function handleLogin(){
    var uname = document.getElementById("loginId").value;
    users['123']='123';
    for(var key in users) {
        if (uname === key){
            var value = users[key];
            var upass = document.getElementById("loginPass").value;
            if (value === upass){
                // authorization completed
                // need to show only the game
                alert("successful login");
                document.getElementById("login").style.display = "none";
                document.getElementById("game_controller").style.display = "block"; 
            }
        }
      }
}

function handleRegistration(){
    let ron = $("#registrationForm").valid();
    if(ron===true){
        // save user details and back to main screen
        users[document.getElementById("username").value] = document.getElementById("password").value;
        alert("Your account have been registered successfully :) you can log in now!");
        document.getElementById("welcome").style.display = "block";
        document.getElementById("register").style.display = "none";
    }
    else {
        alert("Please fill correct details in all of the fields.");
    }
}