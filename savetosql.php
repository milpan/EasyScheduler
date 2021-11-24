<?php
//This php script is responsible for saving the draggable tasks to the Database
require "php_config.php";

$inID = $_POST["id"];
$inDate = $_POST["q"];
$user = $_POST["u"];
$name = $_POST["tn"];
$indesc = $_POST["desc"];

function checkDatabase($link, $inID){
  $sql="SELECT * FROM example where id={$inID}";
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
function appendDraggable($link, $inID, $inDate, $user, $name, $indesc){
  $sql = "UPDATE example SET assigned_to = ?, date = ?, name=?, description = ? WHERE id=?";
  if($stmt = mysqli_prepare($link, $sql)){
    $inDate = date("Y-m-d", strtotime($inDate));
    $stmt->bind_param("ssssi", $user, $inDate, $name, $indesc, $inID);
    $stmt->execute();
    $stmt->close();
    $link->close();
  }
}

//Uses a prepared statement to save the draggable to the database
function saveDraggable($link, $inID, $inDate, $user, $name, $indesc){
$sql = "INSERT INTO example (id, name, assigned_to, date, description) VALUES (?,?,?,?,?)";
if($stmt = mysqli_prepare($link, $sql)){
  $inDate = date("Y-m-d", strtotime($inDate));
  $stmt->bind_param("issss", $inID, $trimname, $user, $inDate, $indesc);
  $trimname = trim($name);
  $stmt->execute();
  $stmt->close();
  $link->close();
}
}

//Check that we aren't being given nothing...
if($inID != null && $inDate != null && $user != null && $name != null){
  //Check if the Description is Null then make it an empty string to stop bugs further down the line
  if($indesc == null){
    $indesc = "";
  }
  //Now Check if the Task has already been added to the Database, if so we need to alter
  if(checkDatabase($link, $inID) == 1){
    //Item has already been added to the database, instead update the corrosponding record
    appendDraggable($link, $inID, $inDate, $user, $name, $indesc);
  }else{
    //If the item has not already been added to the database
    saveDraggable($link, $inID, $inDate, $user, $name, $indesc);
  }

}
?>