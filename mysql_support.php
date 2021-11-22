<?php
//This php script is responsible for retrieving tasks on the selected calendar timeframe
require "php_config.php";
$inDate = $_POST["q"];
$n_days = $_POST["d"];
global $outArray;
$outArray = array();

function obtainTasks($link, $inDate, $n_days){
    global $outArray;
    $inDate = date('Y-m-d', strtotime($inDate));
    //Subtract 1 from the call so we dont get next Mondays Tasks
    $n_days = $n_days - 1;
    //$inDate -> Starting date of the week tasks are to be rendered
    //$n_days -> Number of days from the starting date of tasks to recieve
    $endDate = date('Y-m-d', strtotime($inDate . "+ {$n_days} days"));   
    $sql = "SELECT * FROM example WHERE (date BETWEEN '{$inDate}' AND '{$endDate}')";
    if($result = $link->query($sql)){
		while($row = $result->fetch_assoc()){
    //Convert the Date to the Format used by JS
    $row["date"] = date('d-m-Y', strtotime($row["date"]));
    $outArray[] = $row;
		
		
		}
    $taskResult = json_encode($outArray);
    echo $taskResult;
    }
    mysqli_close($link);
}

//Obtain the requests from Javascript

obtainTasks($link, $inDate, $n_days);
?>