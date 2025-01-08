/**
 * This function will search recursively into an path of an object and it will set its value.
 * @param theObject The object to be affected.
 * @param thePath  An array of strings that represent the path inside the object.
 * @param newValue The new value of the object field.
 */
function InObjectPathfinder(theObject:any, thePath:string[], newValue:any){
    if(thePath.length === 1){
        theObject[thePath[0]] = newValue
    }
    else{
        InObjectPathfinder(theObject[thePath[0]], thePath.slice(1), newValue)
    }
}



export {InObjectPathfinder}