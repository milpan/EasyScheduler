<?php
//This php script is responsible for retrieving tasks on the selected calendar timeframe
require "php_config.php";
global $outArray;
$outArray = array();




function obtainTasks($link){
    global $outArray;
    //Subtract 1 from the call so we dont get next Mondays Tasks
    //$inDate -> Starting date of the week tasks are to be rendered
    //$n_days -> Number of days from the starting date of tasks to recieve  
    $sql = "SELECT * FROM example WHERE assigned_to = ''";
    if($result = $link->query($sql)){
		while($row = $result->fetch_assoc()){
    $outArray[] = $row;	
		}
    $taskResult = json_encode($outArray);
    echo $taskResult;
    }
    mysqli_close($link);
}

//Obtain the requests from Javascript
obtainTasks($link);
?>