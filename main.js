moment.locale();
//Need a function which counts the number of draggable items and one to populate them


const init_date = moment();
const date = init_date.startOf('isoweek');
//Number of days of the calendar you wish to display
const n_days = 14;

var ExampleTasks =[];
var DistinctNames =[];
//Using the currentdate time obtain an array of ExampleTasks
function obtainTasks(currentDate, number_days){
/*
currentDate -> the current date of which the calendar is focused
number_days -> number of days of which to obtain the tasks
*/
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "mysql_support.php?q=" + currentDate.format("DD-MM-YYYY") + "&d=" + number_days, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        //If the php call is succesfull then decode the Json of the Tasks
        //console.log(this.responseText);
        //document.write(this.responseText);
        ExampleTasks = JSON.parse(this.responseText);
        getNames(currentDate, ExampleTasks);
        
        
    }
    };

    
}
/*
//Build some example tasks (NOT USING MYSQL)
const ExampleTasks = [{
    id: 1,
    date: "27-10-2021",
    name: "Prerender Test Task",
    color: "blue",
    assigned_to: "Fred"
    },{
    id: 2,
    date: "25-10-2021",
    name: "Wash Dishes",
    color: "blue",
    assigned_to: "Pearl"
    },{
    id: 3,
    date: "28-10-2021",
    name: "Toilet Break",
    color: "blue",
    assigned_to: "Audrey"
    },{
    id: 4,
    date: "29-10-2021",
    name: "Tea Break",
    color: "blue",
    assigned_to: "Audrey"
    }];
*/
var countTasks = 2;
//This function calls a PHP Script which obtains the Distinct Names from the SQL Database and
//the draggable tasks defined in itembox.js
function getNames(currentDate, ExampleTasks){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "tablenames.php", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //If the php call is succesfull then decode the Json of the Tasks
            DistinctNames = JSON.parse(this.responseText);
            DistinctNames.push(...getUniqueListBy(Draggables, "assigned_to"));
            startRender(currentDate, ExampleTasks, DistinctNames);
        }
        };
        
}

//Function that populates the table with tasks once the inital render has been made
function populate_table(Tasks, startDate){

//Iterate over the length of the Tasks
startDate = moment(startDate);
for (var i=0; i<Tasks.length; i++){
    var Task = Tasks[i];
    var Name = Task['assigned_to'];
    var TaskDate = moment(Task['date'], 'DD-MM-YYYY');
    var DaysDiff = TaskDate.diff(startDate, 'days');
    //Check the date is within the range of the scheduler
    if (DaysDiff <= n_days && DaysDiff >= 0){
        //Populate the Item onto the Table
        var CelltoPopulate = Name+DaysDiff;
        var CelltoPopulate = CelltoPopulate.replace(/-/g, "");
        createCell(CelltoPopulate, Task);
        
    }
}
}
//Function which assigns a task to a specific cell ID
function createCell(cellID, Task){
/*
cellID -> e.g Audrey1 would populate Monday
*/
var taskName = Task['name'];
var taskID = Task['id'];
//Find the empty cell we wish to populate
var refdiv = document.getElementById(cellID);


//Create a new Div
var div = document.createElement('div'),
txt = document.createTextNode(taskName);
div.appendChild(txt);
div.setAttribute('class', 'item');
div.setAttribute('className', 'item');
div.setAttribute('id', "draggable-"+countTasks);
div.setAttribute('ondragstart', 'onDragStart(event)');
div.setAttribute('draggable', 'true');
refdiv.appendChild(div);
countTasks += 1;
}

//Function which Handles Adding the empty Cells to the Table
function createInitialCell(cell, Name, Iterator){
//Create a div Element
var div = document.createElement('div');
if(Iterator != 0){
    div.setAttribute('class', 'empty');
    div.setAttribute('className', 'empty');
    
    div.setAttribute('id', Name+(Iterator-1));
    div.setAttribute('ondrop', 'onDrop(event)');
    div.setAttribute('ondragover', 'onDragOver(event)');
} else{
    div.setAttribute('class', 'name');
    div.setAttribute('className', 'name');
    div.setAttribute('id', Name);
    txt = document.createTextNode(Name);
    div.appendChild(txt);
}
cell.appendChild(div);
}

//Main Function which Renders the Table on Open
function render_Table(NamesIn){
for (j=0; j<NamesIn.length; j++){
//We have the names now lets populate the table with the names
var tbl = document.getElementById('myView'), // table reference
row = tbl.insertRow(tbl.rows.length),   // append table row
i;
for(i=0; i<tbl.rows[0].cells.length; i++){
createInitialCell(row.insertCell(i), NamesIn[j], i);
}

}
}

function saveTasktoSQL(TaskIn){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "savetosql.php?q=" + TaskIn["date"] + "&id=" + TaskIn["id"] + "&u=" + TaskIn["assigned_to"] + "&tn=" + TaskIn["name"] + "&col=" + TaskIn["color"], true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //If the php call is succesful then decode the Json of the Tasks
        }
        };
}

//Set the header of the Calendar to a certain date
function setCalendarDate(DateIn){
    //We assume Date is our starting date so we need to calculate the date 2 weeks on
    const endDate = moment(DateIn);
    endDate.add(n_days, 'days');
    //Set the Date Variable
    document.querySelector('.CurrentDate a').innerHTML = (DateIn.format('DD-MM-YYYY') + " to " + endDate.format('DD-MM-YYYY'));
    }

//This function initialises the Calendars Next and Back Button   
function init_button_listener(){
    document.querySelector('.prev').addEventListener("click", ()=>{
        deleteTableEntries();
        date.subtract(n_days, 'days');
        start();
        
    });
    document.querySelector('.next').addEventListener("click", ()=>{
        deleteTableEntries();
        date.add(n_days, 'days');
        start();
    });
    }
//Function which pushes tasks to the Array once they have been dragged
function save_class(RefClass, startDate, element){
    var inStartDate = moment(startDate);
    var id = RefClass.match(/\d+/g)[0];
    var user = RefClass.match(/[a-zA-Z]+/g)[0];
    var texttoPopulate = element.innerHTML;
    var taskDate = inStartDate.add(id, 'days').format('DD-MM-YYYY');
    Task = {
    id:30,
    name: texttoPopulate,
    color: "blue",
    assigned_to: user,
    date: taskDate 
    };
    saveTasktoSQL(Task);
}

//Function that handles the drop event of items onto the calendar
function onDrop(event){
    const id = event
    .dataTransfer
    .getData('text');
    //Select our dragable element with the ID
    const draggableElement = document.getElementById(id);
    //Get our target
    const dropzone = event.target;
    //Check our target is not another draggable item
    if(dropzone.className == "empty"){
    //Call the function to handle storing dragged tasks 
    save_class(dropzone.id, date, draggableElement);
    //Put our draggable div into the dropzone
    dropzone.appendChild(draggableElement);
    }
    //Reset our data Object
    event
    .dataTransfer.clearData();
}

//Functions to handle the dragging and dropping of items into the View
function onDragStart(event){
    event
    .dataTransfer
    .setData('text/plain', event.target.id);
    //Also set the background colour of the dragged item
    //and the text to black
    event.currentTarget.style.color = 'white';
}

//Function which handles the deleting of items once myView is changed
function deleteTableEntries(){
    var tbl = document.getElementById('myView');
    var num_rows = tbl.rows.length;
    for (let i = 0; i<num_rows -1; i++){
        tbl.deleteRow(-1);
    }
    countTasks = 0
    }

//Stop the default dragover event
function onDragOver(event){
    event.preventDefault();
}

//Main function to start the scheduler
function start(){
    var ExampleTasks = obtainTasks(date,n_days);
    //startRender() is called after the Async AJAX Call
}
//Starts the Rendering Process (has to be seperate function due to AJAX Call being async)
function startRender(date, ExampleTasks, NamesIn){
    var countTasks = ExampleTasks.length;
    setCalendarDate(date);
    render_Table(NamesIn);
    populate_table(ExampleTasks, date);
    start_resize_grid();
    
}

//Main
init_button_listener();
start();
