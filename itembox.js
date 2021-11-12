//This JS is responsible for creating a itembox with the draggable items

//This function is responsible for obtaining tasks in the database with no user assigned which can later be passed to renderItemBox
function getDraggables(){
//Add your draggables AJAX call here
}

//This function is responsible for rendering the draggable tasks by finding a div with the id itembox
function renderItemBox(inDraggables, countTasks){
//Get the number of elements in the Database
var itembox = document.getElementById("itembox");
draggablearray = [];
for(var i=0; i<inDraggables.length; i++){
draggablearray.push(`<div id="draggable-${inDraggables[i]["id"]}" class="item" draggable="true" ondragstart="onDragStart(event);">${inDraggables[i]["name"]}</div>`);
}
var stringtoinject = draggablearray.join("");
var itemboxinjection = `<div class="dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);"><h1>Draggable Tasks</h1><div class="origin">${stringtoinject}</div><div id="draggable-${countTasks+1}" class="item" draggable="true" ondragstart="onDragStart(event);"><i contenteditable="true" onblur="onBlur(event);" id="dragtext-${countTasks+1}">+ Try Custom Text Here</i></div></div>`;
itembox.innerHTML = itemboxinjection;
}
