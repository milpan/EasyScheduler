/*
This script creates methods for handling drag and drop events onto the calendar and appending them to the ExampleTask
*/

//This function is called after the drag event and calculates the date it has been dragged upon
function class_to_date(classIn, classText){
    //classIn -> class that user has dragged on to (for example) Fred1
    var id = classIn.match(/\d+/g);
    var user = classIn.match(/[a-zA-Z]+/g);
    var refDate = moment(date);
    var taskDate = refDate.add(id, 'days');
    ExampleTasks.push({
        date: taskDate,
        name: classText,
        color: "blue",
        assigned_to: user
    })
    
}