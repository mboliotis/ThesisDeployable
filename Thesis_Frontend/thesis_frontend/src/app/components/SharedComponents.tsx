import { useCallback, useContext, useState } from "react";
import { InObjectPathfinder } from "@/tools/usefulFunctions"
import { DisplayUserInputContext } from "@/app/components/displayData"


// **********************************************  Components for Displaying Server Object Data  **********************************************  
interface InputElementProps {
    value: string
    keyProp: string,
    id?: string
    name?: string,
    appData: any,
    setAppData: any
}

function ServerNameInputElement({ value, keyProp, id, name, appData, setAppData }: InputElementProps) {
    const [inputVal, setInputVal] = useState<string>(value);

    const InputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(event.target.value); // Set this components state
    }

    const ButtonHandler = () => {
        let objectPath = keyProp.split("."); // Convert key to a path array
        let appDataCopy = { ...appData }
        try {
            for (let i = 0; i < appDataCopy["servers"].length; i++) {
                if (appDataCopy["servers"][i]["name"] === objectPath[1]) {
                    appDataCopy["servers"][i]["name"] = inputVal;
                }
            }
            setAppData(appDataCopy); // Update App state
            alert("New ServerID saved!")
        }
        catch (error) {
            console.log(error)
        }
    }
    let content =
        <div className="flex flex-row items-baseline space-y-10 w-full ">
            <input className="border-solid	border-2 rounded-md	 w-full" type="text" name={name} id={id} key={keyProp} value={inputVal} onChange={InputHandler} />
            <button className="btn btn-success  m-2" onClick={ButtonHandler}>Save</button>
        </div>
    return content
}

interface ServerForFieldInputElement {
    values: string[],
    startingVal: string,
    keyProp: string
    appData: any,
    setAppData: any
}

function ServerForFieldInputElement({ values, startingVal, keyProp, appData, setAppData }: ServerForFieldInputElement) {
    const [inputVal, setInputVal] = useState<string>(startingVal);



    const InputHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let objectPath = keyProp.split("."); // Convert key to a path array
        let appDataCopy = { ...appData }
        try {
            for (let i = 0; i < appDataCopy["servers"].length; i++) {
                if (appDataCopy["servers"][i]["name"] === objectPath[1]) {
                    appDataCopy["servers"][i]["for"] = event.target.value;
                }
            }
            setAppData(appDataCopy); // Update App state
            setInputVal(event.target.value); // Set this components state
        }
        catch (error) {
            console.log(error)
        }
    }

    let options: JSX.Element[] = [
        <option key={Math.random().toString()} disabled value={inputVal}>
            {inputVal}
        </option>
    ]

    for (let i = 0; i < values.length; i++) {
        if (values[i] !== inputVal) {
            options.push(
                <option key={Math.random().toString()} >{values[i]}</option>
            )
        }
    }

    let content =
        <select key={Math.random().toString()} className="select select-bordered w-full mx-auto" onChange={InputHandler} defaultValue={inputVal} >
            {options}
        </select>

    return content
}

interface ServerGenericInputElementProps {
    serverID: string,
    fieldID: string
    value: string
    keyProp: string,
    id?: string
    name?: string,
    appData: any,
    setAppData: any
}

function ServerGenericInputElement({ serverID, fieldID, value, keyProp, id, name, appData, setAppData }: ServerGenericInputElementProps) {
    const [inputVal, setInputVal] = useState<string>(value);

    const InputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(event.target.value); // Set this components state
    }

    const ButtonHandler = () => {

        let appDataCopy = { ...appData }
        try {
            for (let i = 0; i < appDataCopy["servers"].length; i++) {

                if (appDataCopy["servers"][i]["name"] === serverID) {
                    if (appDataCopy["servers"][i][fieldID] !== null) {
                        appDataCopy["servers"][i][fieldID] = inputVal;
                        setAppData(appDataCopy); // Update App state
                        alert("Server " + fieldID + " saved!")
                    }
                }
            }

        }
        catch (error) {
            console.log(error)
        }
    }
    let content =
        <div className="flex flex-row items-baseline w-full">
            <input className="border-solid	border-2 rounded-md	w-full" type="textarea" name={name} id={id} key={keyProp} value={inputVal} onChange={InputHandler} />
            <button className="btn btn-success m-2" onClick={ButtonHandler}>Save</button>
        </div>
    return content
}


function ServerSecurityField({ appData, serverID }: ServerGenericProps) {
    const [availableSecuritySchemas, setAvailableSecuritySchemas] = useState<string[] | null>(null);

    let securitySchemas: JSX.Element[] = []
    if (availableSecuritySchemas === null) {
        try {
            if (appData['servers'] !== null) {
                for (let i = 0; i < appData['servers'].length; i++) {
                    let serverFound: boolean = appData['servers'][i]['name'] === serverID
                    if (serverFound) {
                        setAvailableSecuritySchemas(appData['servers'][i]["security"]);
                    }
                }
            }
        }
        catch {
            alert("Error can not find the available security schemas!")
        }
    }
    else {
        for (let i = 0; i < availableSecuritySchemas.length; i++) {
            securitySchemas.push(
                <div key={Math.random().toString()} className="flex flex-row">
                    <p key={Math.random().toString()} className="w-96" >🔐{availableSecuritySchemas[i]}</p>
                </div>
            );
        }
    }

    let outputStyles = "border-solid	border-2 rounded-md	w-96";
    if (availableSecuritySchemas !== null && availableSecuritySchemas.length < 2) {
        outputStyles = "";
    }
    let content =
        <div key={Math.random().toString()} className="border-solid	border-2 rounded-md	w-96 pl-5" >
            {securitySchemas}
        </div>

    return content
}


function ServerVariablesField({ appData, serverID }: ServerGenericProps) {
    const [pathVariables, setPathVariables] = useState<any | null>(null);

    let pathVars: JSX.Element[] = []
    // First run
    if (pathVariables === null) {
        try {
            if (appData['servers'] !== null) {
                for (let i = 0; i < appData['servers'].length; i++) {
                    let serverFound: boolean = appData['servers'][i]['name'] === serverID
                    if (serverFound) {
                        setPathVariables(appData['servers'][i]["variables"]);
                    }
                }
            }
        }
        catch {
            alert("Error can not find the available path variables!")
        }
    }
    else {
        for (const key in pathVariables) {
            if (typeof pathVariables[key] === 'object') {
                let tableRows = []
                for (let i = 0; i < pathVariables[key]['enum'].length; i++) {
                    if (i === 0) {
                        tableRows.push(
                            <tr key={Math.random().toString()}>
                                <td key={Math.random().toString()}>{key}</td>
                                <td key={Math.random().toString()}></td>
                                <td key={Math.random().toString()}>{pathVariables[key]['enum'][i]}</td>
                            </tr>
                        )
                    }
                    else{
                        tableRows.push(
                            <tr key={Math.random().toString()}>
                                <td key={Math.random().toString()}></td>
                                <td key={Math.random().toString()}></td>
                                <td key={Math.random().toString()}>{pathVariables[key]['enum'][i]}</td>
                            </tr>
                        )
                    }
                }
                pathVars.push(<>{tableRows}</>)

            } else if (typeof pathVariables[key] === 'string') {
                pathVars.push(
                    <tr key={Math.random().toString()}>
                        <td key={Math.random().toString()}>{key}</td>
                        <td key={Math.random().toString()}></td>
                        <td key={Math.random().toString()}>{pathVariables[key]}</td>
                    </tr>
                )

            } else {
                // do nothing
            }
        }
    }


    let content =
        <div key={Math.random().toString()} className="border-solid	border-2 rounded-md	w-96 pl-5 overflow-x-auto" >
            <table className="table" key={Math.random().toString()}>
                <thead key={Math.random().toString()}>
                    <tr key={Math.random().toString()}>
                        <th key={Math.random().toString()}>Variable Name</th>
                        <th key={Math.random().toString()}></th>
                        <th key={Math.random().toString()}>Possible Values</th>
                    </tr>
                </thead>
                <tbody key={Math.random().toString()}>
                    {pathVars}
                </tbody>
            </table>
        </div>

    return content
}


interface ServerGenericProps {
    serverID: string,
    fieldID: string
    value?: string
    keyProp: string,
    id?: string
    name?: string,
    appData: any,
    setAppData: any
}

// **********************************************  Components for Displaying Server Object Data  **********************************************  



// Exports
export { ServerNameInputElement, ServerForFieldInputElement, ServerGenericInputElement, ServerSecurityField, ServerVariablesField }