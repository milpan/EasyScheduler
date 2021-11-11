<?php
//This function is responsible for obtaining a simple count of the number of items in the MySQL database for indexing purposes.

require "../php_config.php";

function getCount($link){
    $sql = "SELECT COUNT(*) FROM example";
    if($result= $link->query($sql)){
        if($row = $result->fetch_assoc()){
            echo $row["COUNT(*)"];
        }
    }
}

getCount($link);
?>