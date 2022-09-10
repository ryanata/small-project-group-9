import { urlBase, extension } from './constants.js';

const USER_ID = sessionStorage.getItem('userID');
let contacts = [];

// Event Listeners
$(".add-btn").click(showAddModal);
$(".add-modal-form").submit(() => {addEntry(); return false;})
$('#search').keypress(doSearch());

for (let i = 0; i < 10; i++) createRow("Tim");
// FUNCTIONS

// Creates a row
function createRow(name = "", email = "", phone = "") {
	let tdIcon = `<td class="contact-btn-td">
	<div class="contact-btn-container">
	<button id="${name}-edit" class="contact-button">
		<i class="material-icons" style="color: #1f1f1f; margin-top:3px;">edit</i>
	</button>
	<button id="${name}-delete" class="contact-button">
		<i class="material-icons" style="color: #1f1f1f; margin-top:3px;">delete</i>
	</button>
	</div>
  	</td>`;
	if ((name.length + email.length + phone.length) == 0) {
		tdIcon = "<td></td>";
	}
    $("#tableBody").append(`<tr>
    <td>${name}</td>
    <td>${email}</td>
    <td>${phone}</td>
    ${tdIcon}
    </tr>`);
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
	doSearch();
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
				const jsonObject = JSON.parse( xhr.responseText );
                Object.keys(jsonObject.results[0]).forEach((idx)=> {
					const entry = jsonObject.results[0][idx];
					const name = entry.FirstName + entry.LastName;
					createRow(name, entry.Address, entry.PhoneNumber);
					contacts.push(entry);
				});
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
	}
}



