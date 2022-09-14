import { urlBase, extension } from './constants.js';


/*
	Properties
	-------------------------
	Important variables that will be utilized throughout this file
*/
const USER_ID = sessionStorage.getItem('userID');
const FIRST_NAME = sessionStorage.getItem('firstName');
const ENTRIES_PER_PAGE = 10;
// An object that contains all contacts loaded
let allPages = {1: new Array(10).fill(null)};
let hasNext = {1: true};
// What contact page we're on
let currentPage = 1;
// Greeting paragraph
let greetingMessage = document.getElementById("greeting-message");

let confirmationMessage = document.getElementById("confirmation-message");
/*
	Event Listeners
	------------------------------
	Attach all event listeners here for consistency. Do not put an event listener
	in the HTML. 
*/
$(".add-btn").click(showAddModal);
$("#add-modal-form").submit(() => {addEntry(); return false;});
$("#edit-modal-form").submit((event) => {editEntry(); return false;});
$("#close-add").click(() => {$("#add-modal").css("display", "none");});
$("#close-edit").click(() => {$("#edit-modal").css("display", "none");});
$("#close-delete").click(() => {$("#delete-modal").css("display", "none");});
$('.left-btn').prop('disabled', true);
$('.left-btn').on('click', () => { previousPage(); });
$('.right-btn').on('click', () => { nextPage(); });
$('#search').on('input', () => {newSearch()});
$('.logout').click(() => {doLogout()});
$('.table').on('click', "button", (event) => { 
	if (event.currentTarget.id == 'edit') {
		const contact_idx = event.currentTarget.name;
		const contact_obj = allPages[currentPage][contact_idx];
		$('#editModalSubmit').data("id", contact_obj.ID);
		showEditModal(contact_obj.FirstName, contact_obj.LastName, contact_obj.Address, contact_obj.PhoneNumber);
	} else if (event.currentTarget.id == 'delete') {
		const contact_idx = event.currentTarget.name;
		const contact_obj = allPages[currentPage][contact_idx];
		showDeleteModal(contact_obj);
		$("#confirm-delete").click(function(e) {deleteContact(contact_obj);});
	} 
});

// Build greeting message using user's first name
greetingMessage.innerText = sessionStorage.getItem('firstName') + "!";
newSearch();

/*
	Dynamic DOM Functions
	------------------------------
	All these functions add/edit the DOM dynamically during runtime.
*/

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
    $("#add-modal").css("display", "none");
}

function showAddModal() {
	// Clears input fields
	$('#add-modal-form')[0].reset();
	$("#add-modal").css("display", "initial");
	$("#edit-modal").css("display", "none");
    $("#delete-modal").css("display", "none");
}

function editEntry() {
    const newContact = {
        firstname: $('#editModalFirstName').val(),
        lastname: $('#editModalLastName').val(),
        phone: $('#editModalPhone').val(),
        address: $('#editModalEmail').val(),
		Id: $('#editModalSubmit').data("id")
    };
	doEditContact(newContact);
	console.log(newContact);
    $("#edit-modal").css("display", "none");
}

function showEditModal(firstName, lastName, email, phone) {
	$("#edit-modal").css("display", "initial");
	$("#add-modal").css("display", "none");
    $("#delete-modal").css("display", "none");
	$("#editModalFirstName").val(firstName);
	$("#editModalLastName").val(lastName);
	$("#editModalEmail").val(email);
	$("#editModalPhone").val(phone);
}

// Deletes all ten rows
function deleteRows() {
    $('#tableBody').empty();
}

// Adds the rows saved in allPages[currentPage] to DOM
function addRows() {
	for (let i = 0; i < ENTRIES_PER_PAGE; i++) {
		const entry = allPages[currentPage][i];
		if (entry != null) {
			createRow(entry.name, entry.Address, entry.PhoneNumber, i);
		} else {
			createRow();
		}
	}
}

function fadeInfoMessage() {
	$(".info-msg").fadeIn({
	  duration: 800,
	  easing:"linear",
	  step:function(now, fx){
		$(this).css("bottom", 35 * now  +"px");
	  }
	})
	setTimeout(() => {
		$(".info-msg").fadeOut({
		duration: 500,
		step:function(now, fx){
		  $(this).css("bottom", 35 * ( 2 - now) + "px");
		}
	  });
	}, 3000);
}

/*
	API Calls
	------------------------------
	All these functions are used to make API calls. Use wrapper
	functions if there is particular logic you want to pass to prevent
	use of promises.
*/

// ADD CONTACT
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

// EDIT CONTACT
function doEditContact(newContact)
{
	let jsonPayload = JSON.stringify( newContact );

	let url = urlBase + '/UpdateContactAPI.' + extension;

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

// DELETE
function showDeleteModal(contact)
{
	confirmationMessage.innerText = "Are you sure you want to delete the entry for " + 
									contact.FirstName + " " + contact.LastName +"?";
	$("#delete-modal").css("display", "initial");
	$("#edit-modal").css("display", "none");
	$("#add-modal").css("display", "none");
}

function deleteContact(contact)
{
	$("#delete-modal").css("display", "none");
	doDelete(contact);
}

function doDelete(contact)
{

	let Id = contact.ID;

	let tmp = {Id:Id};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContactAPI.' + extension;

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
		
	}
}
	
function doSearch()
{
	const search = document.getElementById("search").value;
    const tmp = { 
        search: search, 
        userId: USER_ID,
		offset: 0
    };
	
	let jsonPayload = JSON.stringify( tmp );

	const url = urlBase + '/ContactSearchAPI.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	// This code leverages event listeners which means that two calls can be firing at the same time
	// if user types faster than call is processed. As a result, we will deleteRows() and addRows()
	// inside the listener. Else weird stuff happens.
	try
	{
		xhr.onreadystatechange = function()
		{
			deleteRows();
			// Get a clean slate if not already
			resetPages();

			if (this.readyState == 4 && this.status == 200 && xhr.responseText)
			{
				const jsonObject = JSON.parse( xhr.responseText );
				if (jsonObject["error"] != "No Records Found") {
					const jsonObjects = jsonObject.results[0];
					saveNewSearch(jsonObjects);
					addRows();
				} else {
					addRows();
				}
			} 
			else 
			{
				addRows();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		deleteRows();
		resetPages();
		addRows();
	}
}

function doSearchNextPage()
{
	const search = document.getElementById("search").value;
    const tmp = { 
        search: search, 
        userId: USER_ID,
		offset: (currentPage) * ENTRIES_PER_PAGE
    };
	
	let jsonPayload = JSON.stringify( tmp );

	const url = urlBase + '/ContactSearchAPI.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
					const jsonObjects = jsonObject.results[0];

					// Create new empty page
					createNewPage();
					// Enable left and right buttons
					$('.right-btn').prop('disabled', false);
					$('.left-btn').prop('disabled', false);
					// Saves incoming data
					saveNewSearch(jsonObjects);
					// Appends incoming data to DOM
					addRows();
				} else {
					addRows();
					// Disable next button
					noNext();
					console.log("No results");
				}
			} 
			else 
			{
				addRows();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		deleteRows();
		addRows();
	}
}



/*
	Helper function
	------------------------------
	Put wrapper functions here as well.
*/

function newSearch() {
	// Reset properties
	resetPages();
	doSearch();
}

// Starts back on page 1 and clean state due to new search
function resetPages() {
	// If the first entry is null, we never inserted anything
	// thus, it will be redundant to instantiate again.
	if (allPages[1][0] != null) {
		allPages = {1: new Array(10).fill(null)};
	}
	currentPage = 1;
	hasNext = {1: true};
	$('.right-btn').prop('disabled', false);
	$('.left-btn').prop('disabled', true);
}

// Goes to the next page
function nextPage() {
	// Disable it to prevent multiple calls
	$('.right-btn').prop('disabled', true);
	
	// If we've already loaded the next page, just refresh the rows
	// with an increment `currentPage`
	if (currentPage + 1 in allPages) {
		currentPage++;
		deleteRows();
		addRows();
		if (hasNext[currentPage]) {
			$('.right-btn').prop('disabled', false);
		}
		// Enable previous button
		$('.left-btn').prop('disabled', false);
	} else {
		doSearchNextPage();
	}
	console.log("Going to next page..");
}

function createNewPage() {
	currentPage++;
	allPages[currentPage] = new Array(10).fill(null);
	hasNext[currentPage] = true;
}

// Saves incoming search to `allPages`
function saveNewSearch(jsonContacts) {
	const n = jsonContacts.length;
	for (let i = 0; i < n; i++) {
		let entry = jsonContacts[i]
		entry.name = entry.FirstName + " " + entry.LastName;		
		allPages[currentPage][i] = entry;
	}
	// It's impossible for there to be more entries if there isn't event 10 in current one.
	if (n < ENTRIES_PER_PAGE) {
		$('.right-btn').prop('disabled', true);
		hasNext[currentPage] = false;
	}
}

// Go to previous page
function previousPage() {
	currentPage--;
	deleteRows();
	addRows();
	$('.right-btn').prop('disabled', false);
	if (currentPage == 1) {
		$('.left-btn').prop('disabled', true);
	}
}

// Disable next button
function noNext() {
	hasNext[currentPage] = false;
	$('.right-btn').prop('disabled', true);
	fadeInfoMessage();
}

function doLogout()
{
	sessionStorage.clear();
	window.location.href = "login.html";
}
