import { useState } from "react"

interface ExternalDocsProps {
    appData: any,
    setAppData: any
}

export default function ExternalDocs({ appData, setAppData }: ExternalDocsProps) {
    const [descriptionVal, setDescriptionVal] = useState(appData["externalDocs"]["description"])
    const [urlVal, setUrlVal] = useState(appData["externalDocs"]["url"])

    let saveHandler = ()=>{
        let appDataCopy = {...appData}
        appDataCopy["externalDocs"]["description"] = descriptionVal
        appDataCopy["externalDocs"]["url"] = urlVal
        setAppData(appDataCopy)
    }


    return (
        <div className="flex flex-col w-full">
            <div>
                <h1>External Docs:</h1>
            </div>
            <div className="flex flex-col w-full border-2 border-black border-solid rounded-md p-2  space-y-2">

                <ExternalDocsDescription
                    descriptionVal={descriptionVal}
                    parrentCallback={setDescriptionVal}
                />

                <ExternalDocsUrl 
                    urlVal={urlVal} 
                    parrentCallback={setUrlVal}                
                />
                <div className="flex flex-row justify-end">
                    <button onClick={saveHandler} className="btn btn-success">Save</button>
                </div>
            </div>
        </div>
    )
}

interface ExternalDocsDescriptionProps {
    descriptionVal: string,
    parrentCallback: any
}
function ExternalDocsDescription(props: ExternalDocsDescriptionProps) {

    let InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.parrentCallback(event.target.value)
    }

    return (
        <div className="flex flex-row items-baseline w-full">
            <div className="">
                <label>Description:</label>
            </div>
            <div className="w-full grow">
                <input onChange={InputChangeHandler} value={props.descriptionVal} type="text" className="input grow w-full  " />
            </div>
        </div>
    )
}

interface ExternalDocsUrlProps {
    urlVal: string,
    parrentCallback: any
}
function ExternalDocsUrl(props:ExternalDocsUrlProps) {
    let InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.parrentCallback(event.target.value)
    }

    return (
        <div className="flex flex-row items-baseline w-full">
            <div className="">
                <label>Url:</label>
            </div>
            <div className="w-full grow">
                <input onChange={InputChangeHandler} value={props.urlVal} type="text" className="input grow w-full  " />
            </div>
        </div>
    )
}