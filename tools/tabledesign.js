/*
This script manages rendering resizable table columns
*/

function start_resize_grid(){
    //Check to see if the resize div has already been created if so delete it
    var resizediv = document.getElementById('divider');
    if(resizediv != null){
        resizediv.remove();
    }
    //Get the table in question
    var tbl = document.getElementById('myView');
    console.log(tbl);
    resizable_Table(tbl);
}

function resizable_Table(table){
    var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
    table.style.overflow = 'scroll';
    if (!cols) return;
    
        var div = createScaleableDiv(table.offsetHeight);
        cols[0].appendChild(div);
        cols[0].style.position = 'relative';
        setListeners(div);
    
}

//Function to create the scalable div that sits on the Name column
function createScaleableDiv(height){
var div = document.createElement('div');

div.style.top = 0;
div.style.right = 0;
div.style.width = '2px';
div.style.position = 'absolute';
div.style.cursor = 'col-resize';
div.style.backgroundColor = 'slategray';
div.style.userSelect = 'none';
div.style.height = height+'px';
div.setAttribute('id',"divider");
return div;
}

//Function that adds mousedown event to provided div element
function setListeners(div){
var pageX, curCol, nxtCol, curColWidth, nxtColWidth, origWidth;
div.addEventListener('mousedown', function(e){
//Make the divider a bit bigger so user knows it is selected
var divider = document.getElementById('divider').style.width = "7px";
curCol = e.target.parentElement;
nxtCol = curCol.nextElementSibling;
pageX = e.pageX;
curColWidth = curCol.offsetWidth;
origWidth = curColWidth;
if(nxtCol)
    nxtColWidth = nxtCol.offsetWidth
});

document.addEventListener('mousemove', function(e) {
if(curCol){

    var diffX = e.pageX - pageX;
    if(nxtCol){
        if(nxtColWidth > 30){
            //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
            curCol.style.width = (curColWidth + diffX) + 'px';
            update_width();
        }else{
            nxtCol.style.width = 70 + 'px';
            update_width();
            //curCol.style.width = curColWidth + 'px';
        }
    }
}});

//Reset the variables once the mouse is lifted
document.addEventListener('mouseup', function(e){
var divider = document.getElementById('divider').style.width = "2px";
update_width();
curCol = undefined;
nxtCol = undefined;
pageX = undefined;
nxtColWidth = undefined;
curColWidth = undefined;
});
}

//This function updates the width of the draggable div
function update_width(){
var table = document.getElementById("myView");
var divider = document.getElementById("divider");
divider.style.height = table.offsetHeight + "px";
}


function showPopup(Task){

}