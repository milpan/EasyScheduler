<?php
//This php script is responsible for saving the draggable tasks to the Database
require "php_config.php";

$inID = $_POST["id"];
$inDate = $_POST["q"];
$user = $_POST["u"];
$name = $_POST["tn"];
$indesc = $_POST["desc"];
$endDate = $_POST["e"];

function checkDatabase($link, $inID, $tn){
  $sql="SELECT * FROM example where id={$inID} AND CompanyID='{$tn}'";
  if($result = $link->query($sql)){
    while($row=$result->fetch_assoc()){
      if($row!=null){
        //The result has already been added to the table
        return 1;
      }
    }
  }
}

//This function is responsible for updating draggables if they already have been added
function appendDraggable($link, $inID, $inDate, $user, $name, $indesc, $endDate, $companyId){
  if($indesc != "undefined"){
    $sql = "UPDATE example SET assigned_to = ?, start = ?, name=?, description = ?, end = ?, CompanyID = ? WHERE id=?";
    if($stmt = mysqli_prepare($link, $sql)){
      $inDate = date("Y-m-d", strtotime($inDate));
      $endDate = date("Y-m-d", strtotime($endDate));
      $stmt->bind_param("sssssii", $user, $inDate, $name, $indesc, $endDate, $companyId, $inID);
      $stmt->execute();
      $stmt->close();
      $link->close();
    }
  } else{
    $sql = "UPDATE example SET assigned_to = ?, start = ?, name=?, end = ?, CompanyID = ? WHERE id=?";
    if($stmt = mysqli_prepare($link, $sql)){
      $inDate = date("Y-m-d", strtotime($inDate));
      $endDate = date("Y-m-d", strtotime($endDate));
      $stmt->bind_param("ssssii", $user, $inDate, $name, $endDate, $companyId, $inID);
      $stmt->execute();
      $stmt->close();
      $link->close();
    }
  }
  
}

//Uses a prepared statement to save the draggable to the database
function saveDraggable($link, $inID, $inDate, $user, $name, $indesc, $endDate, $companyId){
$sql = "INSERT INTO example (id, name, assigned_to, start, description, end, CompanyID) VALUES (?,?,?,?,?,?,?)";
if($stmt = mysqli_prepare($link, $sql)){
  $inDate = date("Y-m-d", strtotime($inDate));
  $endDate = date("Y-m-d", strtotime($endDate));
  $stmt->bind_param("isssssi", $inID, $trimname, $user, $inDate, $indesc, $endDate, $companyId);
  $trimname = trim($name);
  $stmt->execute();
  $stmt->close();
  $link->close();
}}

//Check that we aren't being given nothing...
if($inID != null && $inDate != null && $user != null && $name != null){
  //Now Check if the Task has already been added to the Database, if so we need to alter
  if(checkDatabase($link, $inID, $companyID) == 1){
    //Item has already been added to the database, instead update the corrosponding record
    appendDraggable($link, $inID, $inDate, $user, $name, $indesc, $endDate, $companyID);
  }else{
    $indesc = "";
    //If the item has not already been added to the database
    saveDraggable($link, $inID, $inDate, $user, $name, $indesc, $endDate, $companyID);
  }
}
?>