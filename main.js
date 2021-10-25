

moment.locale();
const init_date = moment();
const date = init_date.startOf('week');
//Here we define the Months so we can display the month in non-ID format
const Months = ['January', 'Feburary',
                'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October',
                'November', 'December']

const Engineers = [];

//Build an example task
const ExampleTasks = [{
    date: "27-10-2021",
    name: "Test Task",
    color: "blue",
    assigned_to: "Fred"
    },{
    date: "25-10-2021",
    name: "Wash Dishes",
    color: "blue",
    assigned_to: "Pearl"
    },{
        date: "28-10-2021",
        name: "Toilet Break",
        color: "blue",
        assigned_to: "Audrey"
        }];

//Function which handles the deleting of items once myView is changed
function deleteTableEntries(){
var tbl = document.getElementById('myView')
var num_rows = tbl.rows.length;
for (let i = 0; i<num_rows -1; i++){
    tbl.deleteRow(-1);
}
}

//Function which handles the adding of Cells to a Table
function createCell(cell, text, style, EngineerName, iterator) {
    /*
    cell -> html cell object
    text -> string -> text of which to populate the cell
    style -> string -> css class name
    EngineerName -> string -> required for cell identifier
    iterator -> integer -> required for cell identifier
    */
    var div = document.createElement('div'), // create DIV element
    txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    div.setAttribute('id', EngineerName+iterator);
    div.setAttribute('ondrop', 'onDrop(event)');
    div.setAttribute('ondragover', 'onDragOver(event)');
    cell.appendChild(div);                   // append DIV to the table cell
}

//Function which handles the adding of Rows to a Table
function appendRow(Task) {
    var tbl = document.getElementById('myView'), // table reference
        row = tbl.insertRow(tbl.rows.length),      // append table row
        i;
    //Find out who the task is assigned to
    var EngineerName = Task['assigned_to'];
    var ID = taskConverter(date, Task);
    var taskName = Task['name'];
    // insert table cells to the new row
    for (i = 0; i < tbl.rows[0].cells.length; i++) {
        if (i==0){
            createCell(row.insertCell(i), EngineerName, 'row', EngineerName, '');
        }else{
            if(i == ID){createCell(row.insertCell(i), taskName, 'test', EngineerName, i);}
            else{createCell(row.insertCell(i), '', 'empty', EngineerName, i);}
        }
        
    }
}
//This function converts the tasks date to a format which allows population
function taskConverter(startDate, inTask){
    /*
    startDate -> Start Date of the Calendar
    inTask -> Task defined as in the example Task Decleration
    */
    var targetDate = inTask["date"];
    //Store this TargetDate in the Correct Format
    const frommomentDate = moment(startDate);
    const momentDate = moment(targetDate, 'DD-MM-YYYY');
    const daysDiff =  momentDate.diff(frommomentDate, 'days');
    //Check that this day falls within the window (14 in this case as a fortnight view)
    if(daysDiff <= 14){
        return daysDiff;
    }
    //var diff = Math.abs(targetDate-momentDate);
    
}
//Function to render the tasks onto the grid
function renderTask(inTasks){
    for (let i=0; i<inTasks.length; i++){
        var Task = inTasks[i];
        appendRow(Task);
    }
}

//Set the header of the Calendar to a certain date
function setCalendarDate(DateIn){
    //We assume Date is our starting date so we need to calculate the date 2 weeks on
    const endDate = moment(DateIn);
    endDate.add(14, 'days');
    //Set the Date Variable
    document.querySelector('.CurrentDate a').innerHTML = (DateIn.format('DD-MM-YYYY') + " to " + endDate.format('DD-MM-YYYY'));
    }


//This function initialises the Calendars Next and Back Button   
function init_button_listener(){
document.querySelector('.prev').addEventListener("click", ()=>{
    deleteTableEntries()
    date.subtract(14, 'days');
    startScheduler();
    
});
document.querySelector('.next').addEventListener("click", ()=>{
    deleteTableEntries()
    date.add(14, 'days');
    startScheduler();
});
}

//Functions to handle the dragging and dropping of items into the View
function onDragStart(event){
    event
    .dataTransfer
    .setData('text/plain', event.target.id);
    //Also set the background colour of the dragged item
    event
    .currentTarget
    .style
    .backgroundColor = 'yellow';
    //and the text to black
    event
    .currentTarget
    .style
    .color = 'black';
}

function onDragOver(event){
    event.preventDefault();
}

function onDrop(event){
    const id = event
    .dataTransfer
    .getData('text');
    //Select our dragable element with the ID
    const draggableElement = document.getElementById(id);
    //Get our target
    const dropzone = event.target;
    //Check our target is not another draggable item
    if(dropzone.className != "item"){
    //Put our draggable div into the dropzone
    dropzone.appendChild(draggableElement);
    }
    //Reset our data Object
    event
    .dataTransfer.clearData();
}


//Main Decleration
init_button_listener();
startScheduler();

function startScheduler(){
    renderTask(ExampleTasks);
    setCalendarDate(date);
}



