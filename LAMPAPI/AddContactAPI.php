<?php
	$inData = getRequestInfo();
	
	$first = $inData["firstname"];
	$last = $inData["lastname"];
	$phone = $inData["phone"];
	$address = $inData["address"];
	$userId = $inData["userId"];

	// mySQL object
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallproject9");

	// covering our ass from connection errors
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// preparing a mySQL query
		$stmt = $conn->prepare("INSERT into Contacts (UserID,FirstName,LastName,Address,PhoneNumber) VALUES(?,?,?,?,?)");
		// binding parameters to mySQL query
		$stmt->bind_param("sssss", $userId, $first, $last, $address, $phone);
		// sending query
		$stmt->execute();
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		// json_decode() is a php library function that converts a 
		// JSON encoded string into a PHP variable
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
