import { urlBase, extension } from './constants.js';

const USER_ID = sessionStorage.getItem('userID');
const ENTRIES_PER_PAGE = 10;
let contacts = [];

// Event Listeners
$(".add-btn").click(showAddModal);
$(".add-modal-form").submit(() => {addEntry(); return false;})
$('#search').on('input', () => {populateSearchResults()});
populateSearchResults();

// FUNCTIONS

// Creates a row
function createRow(name = "&#10240;", email = "", phone = "") {
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
	if ((email.length + phone.length) == 0) {
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
	contacts = [];
}

// Takes JSON data and creates rows
function addRows(jsonContacts, numRows) {
	for (let i = 0; i < numRows; i++) {
		const entry = jsonContacts[i]
		const name = entry.FirstName + " " + entry.LastName;
					
		createRow(name, entry.Address, entry.PhoneNumber);
		contacts.push(entry);
	}
	for (let leftover = 0; leftover < ENTRIES_PER_PAGE - numRows; leftover++) {
		createRow();
	}
}


// API CALLS

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
	let jsonObjects = null;
	let numberOfObjects = 0;
	// This code leverages event listeners which means that two calls can be firing at the same time
	// if user types faster than call is processed. As a result, we will deleteRows() and addRows()
	// inside the listener. Else weird stuff happens.
	try
	{
		xhr.onreadystatechange = function()
		{
			deleteRows();
			if (this.readyState == 4 && this.status == 200 && xhr.responseText)
			{
				const jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject["error"] != "No Records Found") {
					jsonObjects = jsonObject.results[0];
					numberOfObjects = jsonObject.results[0].length;
					addRows(jsonObjects, numberOfObjects);
				} else {
					addRows(null, 0);
				}
			} 
			else 
			{
				addRows(null, 0);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		deleteRows();
		addRows(null, 0);
	}
}


// HELPER FUNCTIONS 

function populateSearchResults() {
	doSearch();
}



