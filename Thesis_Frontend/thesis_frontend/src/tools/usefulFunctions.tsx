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

// ============================================== Tools ============================================== //

/**
 * Check if a string is empty or filled with white spaces only.
 * @param str The string that may be empty. 
 * @returns true / false
 */
function isEmpty(str: string): boolean {
    return str.trim().length === 0
}


/**
 *  If a variable was supposed to be of type string but is of type undefined return an empty string.
 */
function undefined2string(variable: any): string {
    if (typeof variable === "undefined") {
        return ""
    }
    return variable
}



function except(e: any) {
    throw new Error("Function not implemented.")
}
// ============================================== Tools ============================================== //

export {InObjectPathfinder, isEmpty, undefined2string}