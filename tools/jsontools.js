//This function returns a List of Names even if there are duplicate items
function getUniqueListBy(arr, key) {
    const Names = [];
    const UniqueNameArray = [...new Map(arr.map(item => [item[key], item]))];
    for (var i=0; i<UniqueNameArray.length; i++){
        Names.push(UniqueNameArray[i][0]);
    }
    return Names;
}

