/*
This script manages rendering resizable table columns
*/

function start_resize_grid(){
    //Get the table in question
    var tbl = document.getElementById('myView');
    console.log("Starting Resizable Column Code");
    resizable_Table(tbl);
}

function resizable_Table(table){
    var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined;
    if (!cols) return;
    for (var i=0; i<1; i++){
        var div = createScaleableDiv(table.offsetHeight);
        cols[i].appendChild(div);
        cols[i].style.position = 'relative';
        setListeners(div);
    }
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
return div;
}

//Function that adds mousedown event to provided div element
function setListeners(div){
var pageX, curCol, nxtCol, curColWidth, nxtColWidth;
div.addEventListener('mousedown', function(e){
curCol = e.target.parentElement;
nxtCol = curCol.nextElementSibling;
pageX = e.pageX;
curColWidth = curCol.offsetWidth
if(nxtCol)
    nxtColWidth = nxtCol.offsetWidth
});
document.addEventListener('mousemove', function(e) {
if(curCol){
    var diffX = e.pageX - pageX;
    if(nxtCol)
    nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
    curCol.style.width = (curColWidth + diffX) + 'px';
}
});
document.addEventListener('mouseup', function(e){
curCol = undefined;
nxtCol = undefined;
pageX = undefined;
nxtColWidth = undefined;
curColWidth = undefined;
});
}