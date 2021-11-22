//This JS is responsible for creating a itembox with the draggable items

//This function is responsible for obtaining tasks in the database with no user assigned which can later be passed to renderItemBox
function getDraggables(count_Tasks){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "./getdraggables.php", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //If the php call is succesfull then decode the Json of the Tasks
            var draggablearray = JSON.parse(this.responseText);
            renderItemBox(draggablearray, count_Tasks);
        }
        };
}


//This function is responsible for rendering the draggable tasks by finding a div with the id itembox
function renderItemBox(inDraggables, count_Tasks){
//Get the number of elements in the Database
var itembox = document.getElementById("itembox");
draggablearray = [];
for(var i=0; i<inDraggables.length; i++){
draggablearray.push(`<div id="draggable-${inDraggables[i]["id"]}" class="item" draggable="true" ondragstart="onDragStart(event);">${inDraggables[i]["name"]}</div>`);
}
var stringtoinject = draggablearray.join("");
var itemboxinjection = `<div class="dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);"><h1>Draggable Tasks</h1><div class="origin">${stringtoinject}</div><div id="draggable-${parseInt(count_Tasks)+1}" class="item" draggable="true" ondragstart="onDragStart(event);"><i contenteditable="true" onblur="onBlur(event);" id="dragtext-${parseInt(count_Tasks)+1}">+ Try Custom Text Here</i></div></div>`;
itembox.innerHTML = itemboxinjection;
}
