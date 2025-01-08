import { useState } from "react"

interface DisplayIDProps {
    value: string
    keyProp: string,
    id: string
    name: string,
    appData: any,
    setAppData: any
}

function DisplayID({ name, id, keyProp, value, appData, setAppData }: DisplayIDProps) {
    const [inputState, setInputState] = useState<string>(value)
    let content = <></>

    const InputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        try {
            let appDataCopy = { ...appData };
            appDataCopy["id"] = event.target.value;
            setAppData(appDataCopy)
            setInputState(event.target.value);
        }
        catch {
            alert("Could not save the new ID")
        }
    }

    content = <>
        <label className = "m-2" key="Thing ID" >ID: </label>
        <input className=" w-full" type="textarea" name={name} id={id} key={keyProp} value={inputState} onChange={InputHandler} />

    </>



    return (
        <div className="flex flex-row border-solid border-black	border-2 rounded-md p-5 w-full space-y-2 items-baseline">
            {content}
        </div>
    )
}




export { DisplayID }