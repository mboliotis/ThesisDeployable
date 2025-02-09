import { ApplicationDataProps } from "@/tools/interfaces";
import { ReactNode, useEffect, useState } from "react";

function IdContainer(props: ApplicationDataProps): ReactNode{
    const [id, setId] = useState("")
    useEffect(()=>{
        const appStateCopy = {...props.appData}
        appStateCopy.id = id
        props.appDataSetter(appStateCopy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const HandleId = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setId(event.target.value)
    }

    return(
        <div className="flex flex-row space-x-2 items-baseline border-2 border-black rounded-md p-2">
            <div>
                <label>id:</label>
            </div>
            <div>
                <input type="text" value={id} className="input input-bordered w-full max-w-xs" onChange={HandleId} />
            </div>
        </div>
    )
}


export {IdContainer}
