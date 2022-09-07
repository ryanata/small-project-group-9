const USER_ID = sessionStorage.getItem('userID');
const urlBase = 'http://67.207.82.94/LAMPAPI';
const extension = 'php';

// Creates a row
function createRow(name, email, phone) {
    return `<tr>
    <td>${name}</td>
    <td>${email}</td>
    <td>${phone}</td>
    <td>
      <span class="material-icons">edit</span>
      <span class="material-icons">delete</span>
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
			if (this.readyState == 4 && this.status == 200)
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

// Create empty rows
for (let i = 0; i < 10; i++) {
    $("#tableBody").append(createRow("","",""));
}


