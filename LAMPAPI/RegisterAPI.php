<?php
	$inData = getRequestInfo();
	
	$first = $inData["firstname"];
	$last = $inData["lastname"];
	$login = $inData["login"];
	$password= $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallproject9"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// checking if userID already exists
		// gets number of rows with the passed userID
		$stmt = $conn->prepare("select count(*) as count from Users where login = ?");
		// binds parameter for the question mark thing
		$stmt->bind_param("ss", $login);
		$stmt->execute();
		// store result
		$result = $stmt->get_result();
		if ($row['count'] > 0) // if the userID exists
		{
			returnWithError("Existing user found");
		}
		else
		{
			$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ss", $first, $last, $login, $password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
	}

	function getRequestInfo()
	{
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
	
		function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
