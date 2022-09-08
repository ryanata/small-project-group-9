<?php
	$inData = getRequestInfo();

	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallproject9"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		// checking if userID already exists
		// gets number of rows with the passed userID
		$stmt1 = $conn->prepare("select count(*) as count from Users where login = ?");
		// binds parameter for the question mark thing
		$stmt1->bind_param("s", $login);
		$login = $inData["login"];
		$stmt1->execute();
		// store result
		$result = $stmt1->get_result();
		$row = $result->fetch_assoc();

		$stmt1->close();
		if ((int)$row['count'] > 0) // if the userID exists
		{
			$conn->close();
			returnWithError("Existing user found");
		}
		else
		{
			
			// prepare and bind
			$stmt = $conn->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstname, $lastname, $login, $password);

			// set parameters and execute
			$firstname = $inData["firstname"];
			$lastname = $inData["lastname"];
			$login = $inData["login"];
			$password= $inData["password"];
			
			$stmt->execute();
	
			returnWithInfo( $firstname, $lastname, $stmt->insert_id);

			$stmt->close();
			$conn->close();
			
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
