<?php
//This php script is responsible for retrieving tasks on the selected calendar timeframe
require "php_config.php";
$inID = $_POST["q"];

function obtainTask($link, $inID, $companyID){
    $sql = "SELECT * FROM example WHERE id=$inID AND (CompanyID = {$companyID})";
    if($result = $link->query($sql)){
		while($row = $result->fetch_assoc()){
    //Convert the Date to the Format used by JS
    $row["start"] = date('d-m-Y', strtotime($row["start"]));
    $row["end"] = date('d-m-Y', strtotime($row["end"]));
    $taskResult = json_encode($row);
    echo $taskResult;
		}
    }
    mysqli_close($link);
}

//Obtain the requests from Javascript

obtainTask($link, $inID, $companyID);
?>