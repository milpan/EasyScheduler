//This JS is responsible for creating a itembox with the draggable items

//Define some draggable Tasks (these will later be populated by a MYSQL Call)
Draggables = [{
    id: 10,
    date: "27-10-2021",
    name: "Prerender Test Task",
    color: "blue",
    assigned_to: "Bob"
    },{
    id: 21,
    date: "25-10-2021",
    name: "Wash Dishes",
    color: "blue",
    assigned_to: "Pearl"
    }];

//This function is responsible for rendering the draggable tasks by finding a div with the id itembox
function renderItemBox(){
var itembox = document.getElementById("itembox");
var itemboxinjection = '<div class="dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);"><div class="origin"><h1>Draggable Tasks</h1><div id="draggable-2" class="item" draggable="true" ondragstart="onDragStart(event);">Clean the Car</div><div id="draggable-3" class="item" draggable="true" ondragstart="onDragStart(event);">Mow the Lawn</div></div></div>';
itembox.innerHTML = itemboxinjection;
}
