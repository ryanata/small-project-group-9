import { urlBase, extension } from './constants.js';

const USER_ID = sessionStorage.getItem('userID');

// Create empty rows
for (let i = 0; i < 10; i++) {
    $("#tableBody").append(createRow("","",""));
}

// Event Listeners
$(".add-btn").click(showAddModal);
$('#search').keypress(doSearch());


// FUNCTIONS

// Creates a row
function createRow(name, email, phone) {
    return `<tr>
    <td>${name}</td>
    <td>${email}</td>
    <td>${phone}</td>
    <td>
      <button id="${name}-edit" onclick="doEdit()" class="contact-button">
	  	<i class="material-icons" style="color:#D5D5D5; margin-top:3px;">edit</i>
	  </button>
      <button id="${name}-delete" onclick="doDelete()" class="contact-button">
	    <i class="material-icons" style="color:#D5D5D5; margin-top:3px;">delete</i>
	  </button>
    </td>
    </tr>`;
}

// Adds an entry to the database
function addEntry() {
    const newContact = {
        firstname: $('#addModalFirstName').val(),
        lastname: $('#addModalLastName').val(),
        phone: $('#addModalPhone').val(),
        address: $('#addModalEmail').val(),
        userId: USER_ID,
    };
    console.log(newContact);
    doContact(newContact);
    $(".add-modal").css("display", "none");
}

function showAddModal() {
    $(".add-modal").css("display", "initial");
}

// Deletes all ten rows
function deleteRows() {
    $('#tableBody').empty();
}

function doContact(newContact)
{
	let jsonPayload = JSON.stringify( newContact );

	let url = urlBase + '/AddContactAPI.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200 && xhr.responseText)
			{
				let jsonObject = JSON.parse( xhr.responseText );
                console.log(jsonObject);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
	}
}

function doSearch()
{
	const search = document.getElementById("search").value;
    const tmp = { 
        search: search, 
        userId: USER_ID
    };
	
	let jsonPayload = JSON.stringify( tmp );

	const url = urlBase + '/ContactSearchAPI.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200 && xhr.responseText)
			{
				let jsonObject = JSON.parse( xhr.responseText );
                console.log(jsonObject);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
	}
}



