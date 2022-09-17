import { urlBase, extension } from './constants.js';

let userId = 0;
let firstName = "";
let lastName = "";

// Event Listeners
$('.sign-up-button').click(function(e) {
	if (!(document.getElementById("FirstNameSignup").value.length >= 1) ||
		!(document.getElementById("LastNameSignup").value.length >= 1) ||
		!(document.getElementById("email").value.length >= 1) ||
		!(document.getElementById("loginName").value.length >= 1) ||
		!(document.getElementById("loginPassword").value.length >= 1))
	{
		document.getElementById("registerResult").innerHTML = "Please fill out all required forms.";
	}
	else
	{
		if (validateEmail(document.getElementById("email").value))
			dosignup();
		else
			document.getElementById("registerResult").innerHTML = "Please enter a valid email address.";
	}
});

$(document).keypress(function(e) {
    if(e.which == 13) 
	{
		if (!(document.getElementById("FirstNameSignup").value.length >= 1) ||
		!(document.getElementById("LastNameSignup").value.length >= 1) ||
		!(document.getElementById("email").value.length >= 1) ||
		!(document.getElementById("loginName").value.length >= 1) ||
		!(document.getElementById("loginPassword").value.length >= 1))
	{
		document.getElementById("registerResult").innerHTML = "Please fill out all required forms.";
	}
	else
	{
		if (validateEmail(document.getElementById("email").value))
			dosignup();
		else
			document.getElementById("registerResult").innerHTML = "Please enter a valid email address.";
	}
	}
});

$( ".inner-switch" ).on("click", function() {
	if( $( "body" ).hasClass( "dark" )) {
	  $( "body" ).removeClass( "dark" );
	  $( ".inner-switch" ).text( "OFF" );
	  mode = 'light';
	} else {
	  $( "body" ).addClass( "dark" );
	  $( "button" ).removeClass( "dark" );
	  $( ".inner-switch" ).text( "ON" );
	  mode = 'dark';
	}
	sessionStorage.setItem('mode', mode);
});

// Check if dark mode was on the last page
if(sessionStorage.getItem('mode') == 'dark')
{
	$( "body" ).addClass( "dark" );
	$( "button" ).removeClass( "dark" );
	$( ".inner-switch" ).text( "ON" );
}

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function dosignup()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	let lastname = document.getElementById("LastNameSignup").value;
	let firstname = document.getElementById("FirstNameSignup").value;
	let email = document.getElementById("email").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {login:login,password:password,firstname:firstname,lastname:lastname, email:email};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/RegisterAPI.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				const error = jsonObject.error;
				
				if( userId < 1 || error.length != 0)
				{
					document.getElementById("registerResult").innerHTML = "That username is taken.";
					return;
				}

				doEmail(jsonPayload);
				firstName = document.getElementById("FirstNameSignup").value;
				saveCookie();
                window.location.href = "contacts-sheet.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doEmail(jsonPayload)
{

	let url = urlBase + '/Mailer.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	sessionStorage.setItem('userID', userId);
		sessionStorage.setItem('firstName', firstName);
	}

$( ".inner-switch" ).on("click", function() {
		if( $( "body" ).hasClass( "dark" )) {
		  $( "body" ).removeClass( "dark" );
		  $( ".inner-switch" ).text( "OFF" );
		} else {
		  $( "body" ).addClass( "dark" );
		  $( "button" ).removeClass( "dark" );
		  $( ".inner-switch" ).text( "ON" );
		}
});