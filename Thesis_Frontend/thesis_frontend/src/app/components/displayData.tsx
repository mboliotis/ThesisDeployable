import React, { useContext, useEffect, useState } from "react"
import { createContext } from 'react';
import DisplayServers from "./servers";
import { DisplayID } from "./id";
import { DisplayDefaultContentType } from "./defaultContentType";
import { DisplayTags } from "./tags";
import ExternalDocs from "./externalDocs";
import DisplayMessageSchemas from "./messageSchemas";
import { SINGLE_INPUT_URL } from "@/tools/devConfig";
import DisplayWebThingResource from "./webthingResource";
import DisplayWebThingState from "./webthingState";
import DisplayWebThingActions from "./webthingActions";

const DisplayUserInputContext = createContext<any | null>(null);

interface DisplayUserInputProps {
    userInput: File
}

export default function DisplayUserInput({ userInput }: DisplayUserInputProps) {
    const [inputObject, setInputObject] = useState<any | null>(null);


    // Some default value
    let content =
        <div className="flex items-center justify-center h-screen">
            <h1>Error: Top Level</h1>
        </div>


    if (inputObject === null) {
        // Loading spinner
        content =
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner text-primary"></span>
            </div>

        // Convert json file to object
        ReadJsonFile(userInput).then((res) => {
            setInputObject(JSON.parse(res));

        })
    }
    else {
        try {
            content = ContentGenerator(inputObject, [inputObject, setInputObject]);
        }
        catch (error) {
            let content =
                <div className="flex items-center justify-center h-screen">
                    <h1>Error: Go back to main page and try again!</h1>
                </div>
        }

    }


    const ClickHandler = async () => {
        let params = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputObject)
        }
        await fetch(SINGLE_INPUT_URL + "/" + inputObject["info"]["title"], params).then(
            (res) => {
                res.json().then((data) => {
                    console.log(data["data"])
                    const blob = new Blob([JSON.stringify(data["data"], null, 2)], { type: 'application/json' });

                    // Create a temporary link element
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = data["data"]['info']['title']+'.json'; // Set the desired file name
                    document.body.appendChild(link);

                    // Programmatically click the link to trigger the download
                    link.click();

                    // Clean up the temporary link
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                })

            }
        )

         
    }


    return (
        <DisplayUserInputContext.Provider value={{ inputObject, setInputObject }} >
            {content}
            <button className="btn btn-success fixed top-0 right-0" onClick={ClickHandler}>Download</button>
        </DisplayUserInputContext.Provider>
    )



}

/**
 *  Get the data from the json as a string
 */
async function ReadJsonFile(jsonFile: File) {

    let theData: string = await jsonFile.text();
    return theData
}

/**
 *  This function will extract the data from the user input. 
 *  It will generate an input element for every field so it will be editable on the UI.
 */
function ContentGenerator(inputObject: any, appState: any[]) {

    // Default value
    let content =
        <div className="flex items-center justify-center h-screen">
            <h1>Error while Generating Content.</h1>
        </div>
    if (inputObject === null) {
        return content;
    }

    try {
        // default values
        let info = <></>;
        let servers = <></>;
        let id = <></>
        let defaultContetnType = <></>
        let tags = <></>
        let externalDocs = <></>
        let messagesSchemas = <></>
        let webthingResource = <></>
        let webthingState = <></>
        let webthingActions = <></>

        if ("info" in inputObject) {

            info = <div >
                {
                    ExtractInfo(inputObject)
                }
            </div>

        }

        if ("servers" in inputObject) {
            servers = <DisplayServers appData={appState[0]} setAppData={appState[1]} />

        }

        if ("id" in inputObject) {
            id =
                <DisplayID
                    appData={appState[0]}
                    setAppData={appState[1]}
                    value={appState[0]["id"]}
                    keyProp={"input field for ID"}
                    id={"input field for ID"}
                    name={"input field for ID"}
                />

        }

        if ("defaultContentType" in inputObject) {
            defaultContetnType =
                <DisplayDefaultContentType
                    appData={appState[0]}
                    setAppData={appState[1]}
                    value={appState[0]["defaultContentType"]}
                    keyProp={"input field for defaultContentType"}
                    id={"input field for defaultContentType"}
                    name={"input field for defaultContentType"}
                />

        }

        if ("tags" in inputObject) {
            tags =
                <DisplayTags
                    appData={appState[0]}
                    setAppData={appState[1]} />
        }

        if ("externalDocs" in inputObject) {
            externalDocs = <ExternalDocs
                appData={appState[0]}
                setAppData={appState[1]}
            />
        }

        if ("messagesSchemas" in inputObject) {
            messagesSchemas = <DisplayMessageSchemas
                appData={appState[0]}
                setAppData={appState[1]}
            />
        }

        if ("web_thing_resource" in inputObject) {
            webthingResource = <DisplayWebThingResource
                appData={appState[0]}
                setAppData={appState[1]}
            />

        }

        if ("web_thing_state" in inputObject) {
            webthingState = <DisplayWebThingState
                appData={appState[0]}
                setAppData={appState[1]}
            />

        }

        if ("web_thing_actions" in inputObject) {
            webthingActions = <DisplayWebThingActions
                appData={appState[0]}
                setAppData={appState[1]}
            />

        }
        content =
            <div className="flex flex-col w-full space-y-2 p-1">
                <section className="w-full" >
                    {info}
                </section >
                <section className="w-full">
                    {servers}
                </section>
                <section className="w-full">
                    {id}
                </section>
                <section className="w-full">
                    {defaultContetnType}
                </section>
                <section className="w-full">
                    {tags}
                </section>
                <section className="w-full">
                    {externalDocs}
                </section>
                <section className="w-full">
                    {messagesSchemas}
                </section>
                <section className="w-full">
                    {webthingResource}
                </section>
                <section className="w-full">
                    {webthingState}
                </section>
                <section className="w-full">
                    {webthingActions}
                </section>
            </div>;

    }
    catch (error) {

        content =
            <div className="flex flex-col items-center justify-center h-screen">
                <h1>Error while extracting data</h1>
            </div>
    }

    return content
}

/**
 * Extract info object and generate a div with input fields displaying the input data.
 * 
 * @param infoObj  Object as defined in the user input schema.
 * @returns div with input elements.
 */
function ExtractInfo(inputObject: any) {
    const PossibleKeysEnum = {
        title: "title",
        version: "version",
        description: "description",
        contact: "contact",
        license: "license"
    }
    if (inputObject === null) {
        return <></>
    }
    let inputElements: JSX.Element[] = [];
    inputElements.push(
        <div key="The magic key">
            <p>Main Info:</p>
        </div>
    );
    let divStyle = "flex flex-row border border-black rounded-md	 border-solid w-full space-x-2 min-h-12 items-center"
    for (const key in inputObject["info"]) {
        if (key === PossibleKeysEnum.title) {
            inputElements.push(
                <div key={key} className={divStyle}>
                    <label className="">Title:</label>
                    <MyInputElement id="info.title" name={key} value={inputObject["info"][key]} keyProp="info.title" />
                </div>
            )
        }
        else if (key === PossibleKeysEnum.version) {
            inputElements.push(
                <div key={key} className={divStyle}>
                    <label className="">Version:</label>
                    <MyInputElement id="info.version" name={key} value={inputObject["info"][key]} keyProp="info.version" />
                </div>
            )
        }
        else if (key === PossibleKeysEnum.description) {
            inputElements.push(
                <div key={key} className="flex flex-row border border-black rounded-md	 border-solid w-full space-x-2 min-h-12 items-center">
                    <label className=" ">Description: </label>
                    <MyInputElement id="info.description" name={key} value={inputObject["info"][key]} keyProp="info.description" />
                </div>
            )
        }
        else if (key === PossibleKeysEnum.contact) {
            let contactNameUI = <></>
            if (inputObject["info"][key]["name"] !== null) {
                contactNameUI =
                    <div key="contact_name" className={divStyle}>
                        <label className=" ">Name:</label>
                        <MyInputElement id="info.contact.name" name={key} value={inputObject["info"][key]["name"]} keyProp="info.contact.name" />
                    </div>
            }
            let contactUrlUI = <></>
            if (inputObject["info"][key]["url"] !== null) {
                contactUrlUI =
                    <div key="contact_url" className={divStyle}>
                        <label className=" ">Url:</label>
                        <MyInputElement id="info.contact.url" name={key} value={inputObject["info"][key]["url"]} keyProp="info.contact.url" />

                    </div>
            }
            let contactEmaillUI = <></>
            if (inputObject["info"][key]["email"] !== null) {
                contactEmaillUI =
                    <div key="contact_email" className={divStyle}>
                        <label className=" ">Email:</label>
                        <MyInputElement id="info.contact.email" name={key} value={inputObject["info"][key]["email"]} keyProp="info.contact.email" />

                    </div>
            }
            let contactUI =
                <section className="flex flex-col" key="contact">
                    <div className="py-4">
                        <p> Contact Info:</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {contactNameUI}
                        {contactUrlUI}
                        {contactEmaillUI}
                    </div>
                </section>
            inputElements.push(contactUI)
        }
        else if (key === PossibleKeysEnum.license) {
            let licenseNameUI = <></>
            if (inputObject["info"][key]["name"] !== null) {
                licenseNameUI =
                    <div key="license_name" className={divStyle}>
                        <label className=" ">Name:</label>
                        <MyInputElement id="info.license.name" name={key} value={inputObject["info"][key]["name"]} keyProp="info.license.name" />

                    </div>
            }
            let licenseUrlUI = <></>
            if (inputObject["info"][key]["url"] !== null) {
                licenseUrlUI =
                    <div key="license_url" className={divStyle}>
                        <label className=" ">Url:</label>
                        <MyInputElement id="info.license.url" name={key} value={inputObject["info"][key]["url"]} keyProp="info.license.url" />

                    </div>
            }
            let licenseUI =
                <section className="flex flex-col" key="license">
                    <div className="py-4">
                        <p> License Info:</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {licenseNameUI}
                        {licenseUrlUI}
                    </div>
                </section>

            inputElements.push(licenseUI)
        }
        else {
            continue // default
        }
    }
    return <div className="flex flex-col space-y-2  ">{inputElements}</div>
}


//======================================== Custom Input Element ======================================== //
interface MyInputElementProps {
    value: string
    keyProp: string,
    id?: string
    name?: string
}

function MyInputElement({ value, keyProp, id, name }: MyInputElementProps) {
    const { inputObject, setInputObject } = useContext(DisplayUserInputContext);
    const [inputVal, setInputVal] = useState<string>(value);



    const InputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let objectPath = keyProp.split("."); // Convert key to a path array
        InObjectPathfinder(inputObject, objectPath, event.target.value); // Set the new value
        setInputObject(inputObject); // Update App state
        setInputVal(event.target.value); // Set this components state
    }
    let content =
        <>
            <input className="w-full" type="textarea" name={name} id={id} key={keyProp} value={inputVal} onChange={InputHandler} />
        </>
    return content
}

//======================================== Custom Input Element ======================================== //

/**
 * This function will search recursively into an path of an object and it will set its value.
 * @param theObject The object to be affected.
 * @param thePath  An array of strings that represent the path inside the object.
 * @param newValue The new value of the object field.
 */
function InObjectPathfinder(theObject: any, thePath: string[], newValue: any) {
    if (thePath.length === 1) {
        theObject[thePath[0]] = newValue
    }
    else {
        InObjectPathfinder(theObject[thePath[0]], thePath.slice(1), newValue)
    }
}



// Exports

export { DisplayUserInputContext }