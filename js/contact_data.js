import { urlBase, extension } from './constants.js';

const USER_ID = sessionStorage.getItem('userID');
const ENTRIES_PER_PAGE = 10;
// An object that contains all contacts loaded
let allPages = {1: new Array(10).fill(null)};
// What contact page we're on
let currentPage = 1;
// Most recently accessed i

// Event Listeners
$(".add-btn").click(showAddModal);
$(".add-modal-form").submit(() => {addEntry(); return false;})
$(".edit-modal-form").submit((event) => {editEntry(); return false;})
$(".close").click(() => {$(".add-modal").css("display", "none");});
$('#search').on('input', () => {populateSearchResults()});
// 
$('.table').on('click', "button", (event) => { 
	if (event.currentTarget.id == 'edit') {
		const contact_idx = event.currentTarget.name;
		const contact_obj = allPages[currentPage][contact_idx];
		$('#editModalSubmit').data("id", contact_obj.ID);
		showEditModal(contact_obj.FirstName, contact_obj.LastName, contact_obj.Address, contact_obj.PhoneNumber);
	} 
});

populateSearchResults();

// FUNCTIONS

// Creates a row
function createRow(name = "&#10240;", email = "", phone = "", idx="") {
	let tdIcon = `<td class="contact-btn-td">
	<div class="contact-btn-container">
	<button id="edit" name="${idx}" class="contact-button">
		<i class="material-icons" style="color: #1f1f1f; margin-top:3px;">edit</i>
	</button>
	<button id="delete" name="${idx}" class="contact-button">
		<i class="material-icons" style="color: #1f1f1f; margin-top:3px;">delete</i>
	</button>
	</div>
  	</td>`;
	if (idx === "") {
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
    doContact(newContact);
    $(".add-modal").css("display", "none");
}

function editEntry() {
    const newContact = {
        firstname: $('#editModalFirstName').val(),
        lastname: $('#editModalLastName').val(),
        phone: $('#editModalPhone').val(),
        address: $('#editModalEmail').val(),
		Id: $('#editModalSubmit').data("id")
    };
	console.log(newContact);
    $(".edit-modal").css("display", "none");
}

function showAddModal() {
    $(".add-modal").css("display", "initial");
}

function showEditModal(firstName, lastName, email, phone) {
	$(".edit-modal").css("display", "initial");
	$("#editModalFirstName").val(firstName);
	$("#editModalLastName").val(lastName);
	$("#editModalEmail").val(email);
	$("#editModalPhone").val(phone);
}

// Deletes all ten rows
function deleteRows() {
    $('#tableBody').empty();
}

// Takes JSON data and creates rows
function addRows(jsonContacts, numRows) {
	for (let i = 0; i < numRows; i++) {
		const entry = jsonContacts[i]
		const name = entry.FirstName + " " + entry.LastName;
					
		allPages[currentPage][i] = entry;
		createRow(name, entry.Address, entry.PhoneNumber, i);
	}
	for (let leftover = 0; leftover < ENTRIES_PER_PAGE - numRows; leftover++) {
		createRow();
	}
}

// Starts back on page 1 and clean state due to new search
function resetPages() {
	allPages = {1: new Array(10).fill(null)};
	currentPage = 1;
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
			if (this.readyState == 4 && this.status == 200)
			{
				doSearch();
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
			// Get a clean slate if not already (Reduce redundant calls)
			if (allPages[1][0] != null) resetPages();

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
		resetPages();
		addRows(null, 0);
	}
}



// HELPER FUNCTIONS 

function populateSearchResults() {
	doSearch();
}



