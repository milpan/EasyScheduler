<?php
//This php script is responsible for saving the draggable tasks to the Database
require "php_config.php";

$inID = $_REQUEST["id"];
$inDate = $_REQUEST["q"];
$user = $_REQUEST["u"];
$name = $_REQUEST["tn"];
$inColor = $_REQUEST["col"];

//Uses a prepared statement to save the draggable to the database
function saveDraggable($link, $inID, $inDate, $user, $name, $inColor){
$sql = "INSERT INTO example (id, name, color, assigned_to, date) VALUES (?,?,?,?,?)";
if($stmt = mysqli_prepare($link, $sql)){
  $inDate = date("Y-m-d", strtotime($inDate));
  $stmt->bind_param("issss", $inID, $name, $inColor, $user, $inDate);
  $stmt->execute();
  $stmt->close();
  $link->close();
  echo "NICE";
}
}

//Check that we aren't being given nothing...
if($inID != null && $inDate != null && $user != null){
  saveDraggable($link, $inID, $inDate, $user,$name, $inColor);
}
?>