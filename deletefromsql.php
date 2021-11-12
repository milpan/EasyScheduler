<?php
//This php script is responsible for saving the draggable tasks to the Database
require "php_config.php";

$inID = $_REQUEST["q"];

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
function deleteDraggable($link, $inID){
  $sql = "DELETE FROM example WHERE id=?";
  if($stmt = mysqli_prepare($link, $sql)){
    $stmt->bind_param("i", $inID);
    $stmt->execute();
    $stmt->close();
    $link->close();
  }
}

//Check that we aren't being given nothing...
if($inID != null){
  //Now Check if the Task has already been added to the Database, if so we need to alter
  if(checkDatabase($link, $inID) == 1){
    //Item has already been added to the database, instead update the corrosponding record
    deleteDraggable($link, $inID);
  }
}
?>