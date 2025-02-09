import { ApplicationDataProps } from "@/tools/interfaces";
import { isEmpty } from "@/tools/usefulFunctions";
import { ReactNode, useEffect, useState } from "react";

function ExternalDocsContainer(props: ApplicationDataProps): ReactNode {
    const [description, setDescription] = useState<string>("")
    const [url, setUrl] = useState<string>("")


    const HandlerUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value)
    }

    const HandlerDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    const Save = ()=>{
        if (isEmpty(url)){
            alert("If you need this to be saved, you shall provide a url!")
            return
        }
        const appDataCopy = {...props.appData}
        appDataCopy.externalDocs = {
            description:description,
            url:url
        }
        props.appDataSetter(appDataCopy)
    }

    return (
        <div className="flex flex-col border-2 border-black rounded-md space-y-2 p-2 w-full">
            <div>
                <label>externalDocs:</label>
            </div>
            <div className="flex flex-row items-baseline space-x-2 w-full">
                <div className="indent-10">
                    <label>description:</label>
                </div>
                <div className="">
                    <input type="text" value={description} className="input input-bordered w-full" onChange={HandlerDescription} />
                </div>
            </div>
            <div className="flex flex-row items-baseline space-x-2 w-full">
                <div className="indent-10">
                    <label>url:</label>
                </div>
                <div className="">
                    <input type="text" value={url} className="input input-bordered w-full" onChange={HandlerUrl} />
                </div>
            </div>
            <div className="flex flex-row justify-end">
                <button className="btn bg-green-300" onClick={Save}>Save</button>            
            </div>
        </div>
    )

}

export { ExternalDocsContainer }

