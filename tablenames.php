<?php
//This php script is responsible for retrieving the names to populate the calendar with
require "php_config.php";
global $names;
$names = array();

function getNames($link){
  $sql = "SELECT DISTINCT(assigned_to) FROM example WHERE assigned_to <> ''";
  if($result = $link->query($sql)){
    while($row = $result->fetch_assoc()){
      $names[] = $row["assigned_to"];
    }
  }
  $outNames = json_encode($names);
  echo $outNames;
}

getNames($link);
?>