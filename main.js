moment.locale();
//Need a function which counts the number of draggable items and one to populate them
const init_date = moment();
var date = init_date.startOf("isoweek");
//Number of days of the calendar you wish to display
var n_days = 7;
//This variable is used to identify wether we are in month view for the next and back buttons
var monthView = 0;
var ExampleTasks =[];
var DistinctNames =[];
var Weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var countTasks = 0;
//Define some draggable Tasks (these will later be populated by a MYSQL Call)
Draggables = [{
    id: 10,
    name: "Prerender Test Task",
    },{
    id: 21,
    name: "Wash Dishes",
    },
    {
    id: 22,
    name: "One more for good luck!",
    }];
//Function that Draws the Table depending on n_days
function drawTable(n_days){
    var scheduler = document.getElementById("scheduler");
    //Declare the Dateheader Object to Inject into the HTML
    var dateheadertoinject = '<div class="timeframeselector"><div id="addsick" title="Delete Item" class="delete"><i class="fas fa-disease ill"></i><i>Add Sickness</i></div><div id="delete" title="Delete Item" class="delete" ondragover="onDragOver(event);" ondrop="onDropDelete(event);"><i class="fas fa-trash delete"></i><i>Delete Item</i></div><div class="timeframe">Week View<i class="fas fa-calendar-day day" title="Week View"></i>Fortnight View<i class="fas fa-calendar-week fortnight" title="Fortnight View"></i>Month View<i class="fas fa-calendar-alt month" title="Month View"></i></div></div><div class="dateheader"><i class="fas fa-angle-left prev"></i><div class="CurrentDate"><input type="date" id="nativedatepicker"><a><div class="loader"></div></a></div><i class="fas fa-angle-right next"></i></div>';
    //Create an array of weekdays depending on the number of days inputted to be shown
    WeekdayArray = [];
    var currentWeekday = moment(date).format('ddd');
    var TempWeekdays = [];

    //Get the index of the currentWeekday in the Weekdays array
    var toStartFrom = Weekdays.indexOf(currentWeekday);
    for(var i=toStartFrom; i<n_days+toStartFrom; i++){
        WeekdayArray.push("<th>"+Weekdays[i % Weekdays.length]+"</th>");
    }
    //Convert our Array into One Big String Ready for Rendering
    var weekdaystring = WeekdayArray.join("");
    //Now to inject the table we wish to render depending on the number of days chosen
    var tabletoinject = '<table class="myView" id="myView" style="overflow: scroll;"><thead><tr><th style="position: relative;">Name</th>'+weekdaystring+'</tr></table>';
    var mainInject = dateheadertoinject + tabletoinject;
    scheduler.innerHTML = mainInject;
    //After rendering the table start the button listener
    init_button_listener();
}

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
        return ExampleTasks;

    }
    };
}

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
            //DistinctNames.push(...getUniqueListBy(Draggables, "assigned_to"));
            DistinctNames = [...new Set(DistinctNames)];
            startRender(currentDate, ExampleTasks, DistinctNames);
        }};
}


//This function is responsible for obtaining the number of elements in the SQL array to allow for new ID's of draggables SPECIAL FUNC which runs the itembox draggable once its got counttasks.
function getElements(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "./tools/getcount.php", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            //If the php call is succesfull then decode the Json of the Tasks
            var countTasks = this.responseText; 
            renderItemBox(Draggables, countTasks);
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
var taskID = Task['id']
//Check if the cellID has any white space
if(hasWhiteSpace(cellID)){
    cellID = cellID.replace(/\s+/g,'');
}
//Find the empty cell we wish to populate
var refdiv = document.getElementById(cellID);
//Create a new Div
var div = document.createElement('div');
//txt = document.createTextNode(taskName);
div.innerHTML = taskName;
//div.appendChild(innerh);
if(taskName == "Holiday"){
    div.setAttribute('class', 'holiday');
    div.setAttribute('className', 'holiday');
    div.setAttribute('id', "holiday-"+taskID);
    refdiv.appendChild(div);
    countTasks += 1;
}else if(taskName == "Unwell"){
    div.setAttribute('class', 'sickness');
    div.setAttribute('className', 'sickness');
    div.setAttribute('id', "sickness-"+taskID);
    refdiv.appendChild(div);
    countTasks += 1;
}
else{
    div.setAttribute('class', 'item');
    div.setAttribute('className', 'item');
    div.setAttribute('id', "draggable-"+taskID);
    div.setAttribute('ondragstart', 'onDragStart(event)');
    div.setAttribute('draggable', 'true');
    refdiv.appendChild(div);
    countTasks += 1;
}}

//Function which Handles Adding the empty Cells to the Table
function createInitialCell(cell, Name, Iterator){
//Create a div Element
var div = document.createElement('div');
if(Iterator != 0){
    //Check if the Name has any Empty Spaces and if so strip them
    if(hasWhiteSpace(Name)){
        var StrippedName = Name.replace(/\s+/g, '');
    }
    div.setAttribute('class', 'empty');
    div.setAttribute('className', 'empty');
    div.setAttribute('username', Name+(Iterator-1));
    div.setAttribute('id', StrippedName+(Iterator-1));
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

//This function checks if a string has any empty spaces for populating Names in format 'First Name-Last Name'
function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

function saveTasktoSQL(TaskIn){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "savetosql.php?q=" + TaskIn["date"] + "&id=" + TaskIn["id"] + "&u=" + TaskIn["assigned_to"] + "&tn=" + TaskIn["name"] + "&col=", true);
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
    endDate.add(n_days-1, 'days');
    //Set the Date Variable
    document.querySelector('.CurrentDate a').innerHTML = (DateIn.format('DD-MM-YYYY') + " to " + endDate.format('DD-MM-YYYY'));
}

//This function initialises the Calendars Next and Back Button   
function init_button_listener(){
    document.querySelector('.prev').addEventListener("click", ()=>{
        if(monthView == 0){
            deleteTableEntries(1);
            date.subtract(n_days, 'days');
            start();
        } else{
            //We are in month View
            date.subtract(1, 'months');
            date = moment(date).startOf('month');
            n_days = moment(date).daysInMonth();
            deleteTableEntries(1);
            start();
        }
    });
    document.querySelector('.next').addEventListener("click", ()=>{
        if(monthView == 0){
            date.add(n_days, 'days');
            deleteTableEntries(1);
            start();
        }else{
            //We are in month View
            date.add(1, 'months');
            date = moment(date).startOf('month');
            n_days = moment(date).daysInMonth();
            //We are in month View
            deleteTableEntries(1);
            start();
        }
    });
    document.querySelector('.day').addEventListener("click", ()=>{
        monthView = 0;
        n_days = 7;
        deleteTableEntries(1);
        start();
    });
    document.querySelector('.fortnight').addEventListener("click", ()=>{
        monthView = 0;
        n_days = 14;
        deleteTableEntries(1);
        start();
    });
    document.querySelector('.month').addEventListener("click", ()=>{
        n_days = moment().daysInMonth();
        deleteTableEntries(1);
        monthView = 1;
        date = moment().startOf('month');
        //We also need to check which day to start the Names of the Weekdays from since each Month does not specifically start with a Monday.
        var startWeekName = moment(date).format('ddd');
        start();
    });
    document.getElementById('nativedatepicker').addEventListener('input', (e)=>{
        monthView = 0;
        deleteTableEntries(1);
        date = moment(e.target.value,'YYYY-MM-DD').startOf('week');
        n_days = 7;
        start();
    });
}

//This function dynamically updates tasks where you can edit the text after changing focus
function onBlur(event){
var target = event.target;
var targetparent = target.parentElement;
//Check that the target parent parent is a EMPTY and if so lets update the record on the Database
var targettarget = targetparent.parentElement;
if(targettarget.getAttribute("class")=="empty"){
save_class(targettarget.getAttribute('username'),date, targetparent);
console.log("Succesfully updated the item");
}
}

//Function which pushes tasks to the Array once they have been dragged
function save_class(RefClass, startDate, element){
    var inStartDate = moment(startDate);
    var id = RefClass.match(/\d+/g)[0];
    var user = RefClass.match(/[a-zA-Z]+/g).join(" ");
    var texttoPopulate = element.innerHTML;
    console.log(texttoPopulate);
    var itemID = element.id.match(/\d+/g)[0];
    var taskDate = inStartDate.add(id, 'days').format('DD-MM-YYYY');
    Task = {
    id: itemID,
    name: texttoPopulate,
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
    draggableElement.style.backgroundColor = "#3700B3"
    //Get our target
    const dropzone = event.target;
    //Check our target is not another draggable item
    if(dropzone.className == "empty"){
    //Call the function to handle storing dragged tasks
    save_class(dropzone.getAttribute('username'), date, draggableElement);
    //Put our draggable div into the dropzone
    dropzone.appendChild(draggableElement);
    }
    //Reset our data Object
    event
    .dataTransfer.clearData();
}

//Handler for once a task has been dragged on the Delete Item
function onDropDelete(event){
    const id = event
    .dataTransfer
    .getData('text');
    var newid = id.match(/\d+/g)[0];
    //Select our dragable element with the ID
    const draggableElement = document.getElementById(id);
    //Confirm the user wants to delete the item from the Scheduler
    if(confirm("Are you sure you wish to delete this item from the Scheduler?")){
        //Call the PHP script to delete target from the SQL database
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "deletefromsql.php?q=" + newid, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                console.log("Task has been succesfully deleted...")
                draggableElement.remove();
            }
            };
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
    event.currentTarget.style.backgroundColor = '#5E35B1';
}

//Function to handle the dragging of sickness and vacations
function onDragStartSickness(event){
    event.dataTransfer.setData('text/plain', 'Sickness')
    event.currentTarget.style.color = 'white';
}

//Function which handles the deleting of items once myView is changed
function deleteTableEntries($condition = 0){
    //$condition -> default=0 (removes everything but day row) -> 1 removes all
    if($condition==0){
        var tbl = document.getElementById('myView');
        var num_rows = tbl.rows.length;
        for (let i = 0; i<num_rows -1; i++){
            tbl.deleteRow(-1);
        }
        countTasks = 0
    } else{
        var tbl = document.getElementById('myView');
        var num_rows = tbl.rows.length;
        for (let i = 0; i<num_rows; i++){
            tbl.deleteRow(-1);
        }
        drawTable(n_days);
    }
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

//----Main Decleration----//
var countTasks = getElements();
//Check if calendar is in month view if so activate the trigger on launch
if(n_days == "30" || n_days == "31"){
    monthView = 1;
}
var countTasks = getElements();
renderItemBox(Draggables, countTasks);
drawTable(n_days);
start();
