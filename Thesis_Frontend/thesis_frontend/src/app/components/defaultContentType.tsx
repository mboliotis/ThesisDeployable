import { useState } from "react"

interface DisplayDefaultContentTypeProps {
    value: string
    keyProp: string,
    id: string
    name: string,
    appData: any,
    setAppData: any
}

function DisplayDefaultContentType({ name, id, keyProp, value, appData, setAppData }: DisplayDefaultContentTypeProps) {
    const [inputState, setInputState] = useState<string>(value)
    let content = <></>

    const InputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        try {
            let appDataCopy = { ...appData };
            appDataCopy["defaultContentType"] = event.target.value;
            setAppData(appDataCopy)
            setInputState(event.target.value);
        }
        catch {
            alert("Could not save the new ID")
        }
    }

    content = <>
        <label className="" key="Thing defaultContentType" >Default Content Type: </label>
        <input className=" 	grow" type="textarea" name={name} id={id} key={keyProp} value={inputState} onChange={InputHandler} />
    </>



    return (
        <div className="flex flex-row border-solid border-black	border-2 rounded-md p-5 w-full  items-baseline space-x-2">
            {content}
        </div>
    )
}




export { DisplayDefaultContentType }