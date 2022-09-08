<?php

	$inData = getRequestInfo();
	
	$searchCount = 0;
	$myArray = array();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "smallproject9");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// if adding lazy loading, select top 10 * instead of select *
		$stmt = $conn->prepare("select * from Contacts where (FirstName LIKE ? OR LastName LIKE ? OR  Address LIKE ? OR PhoneNumber like ?) and UserID = ? limit 10");
		$searchParam = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $searchParam , $searchParam , $searchParam , $searchParam , $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		while($row = $result->fetch_assoc())
		{
			$myArray[] = $row;
			$searchCount++;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( json_encode($myArray) );
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
