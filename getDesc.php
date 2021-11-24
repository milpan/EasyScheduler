<?php
require "php_config.php";
$inID = $_POST["i"];

//Function that gets the description of a Task
function getDesc($link, $inID){
    $sql = "SELECT description FROM example WHERE id={$inID}";
    if($result = $link->query($sql)){
        while($row = $result->fetch_assoc()){
            echo $row["description"];
        }
        $link->close();
    }
}

getDesc($link, $inID);
?>