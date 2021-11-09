/*
This script creates methods for handling drag and drop events onto the calendar and appending them to the ExampleTask
*/

//This function is called after the drag event and calculates the date it has been dragged upon
function class_to_date(classIn, classText){
    //classIn -> class that user has dragged on to (for example) Fred1
    var id = classIn.match(/\d+/g);
    var user = classIn.match(/[a-zA-Z]+/g);
    refDate = moment(date);
    var taskDate = refDate.add(id, 'days');
    var formattedtaskDate = taskDate.format('DD-MM-YYYY');
    console.log(taskDate);
    ExampleTasks.push({
        id: 4,
        date: formattedtaskDate,
        name: classText,
        color: "blue",
        assigned_to: user
    })
}
//This function is called when the item is dragged
function remove_class(classIn, classText){
    var id = classIn.match(/\d+/g);
    var user = classIn.match(/[a-zA-Z]+/g);

}