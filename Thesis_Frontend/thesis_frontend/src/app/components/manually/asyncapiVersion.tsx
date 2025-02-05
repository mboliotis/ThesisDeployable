import { ApplicationDataProps } from "@/tools/interfaces"


/**
 *  This is the section that holds the asyncapi version.
 */
function VersionContainer(props: ApplicationDataProps) {

    return (
        <div className="flex flex-row space-x-2 w-full items-baseline border-2 border-black p-2 rounded-md">
            <div>
                <label>
                    asyncapi:
                </label>
            </div>
            <div  >
                <input type="text" value={"3.0.0"} readOnly className="input input-bordered" />
            </div>
        </div>
    )
}


export {VersionContainer}