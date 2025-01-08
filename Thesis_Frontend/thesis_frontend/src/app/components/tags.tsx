import { useState } from "react"

interface DisplayTagsProps {
    appData: any,
    setAppData: any
}


function DisplayTags({ appData, setAppData }: DisplayTagsProps) {
    let content = <></>

    let tagElements: JSX.Element[] = [];
    for (let i = 0; i < appData["tags"].length; i++) {
        tagElements.push(
            <SingleTag value={appData["tags"][i]} key={"tagElement_index=" + i.toString()} tagIndex={i} appData={appData} setAppData={setAppData} />
        )
    }

    return (
        <div className="flex flex-col w-full" id="Tags_Container">
            <h1 key={"tagElement_index=-1"}>Tags:</h1>
            <div className="flex flex-col border-solid border-black	border-2 rounded-md p-5 space-y-2 w-full">
                {tagElements}
            </div>

        </div>)



}

interface SingleTagProps {
    value: any,
    tagIndex: number,
    appData: any,
    setAppData: any
}

const SingleTag = ({ value, appData, setAppData, tagIndex }: SingleTagProps) => {
    const [tagState, setTagState] = useState<any>(value)

    let content = <></>

    const NameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tagStateCopy = { ...tagState }
        tagStateCopy["name"] = event.target.value
        setTagState(tagStateCopy);

    }

    const DescriptionHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tagStateCopy = { ...tagState }
        tagStateCopy["description"] = event.target.value
        setTagState(tagStateCopy);


    }

    const SaveHandler = () => {
        try {
            let appDataCopy = { ...appData };
            for (let i = 0; i < appDataCopy["tags"].length; i++) {
                if (i === tagIndex) {
                    appDataCopy["tags"][i] = tagState;
                }
            }
            setAppData(appDataCopy)
            alert("Tag Saved!")
        }
        catch {
            alert("Failed to Save!")
        }

    }

    content = <div className="flex flex-col w-full">
        <div className="flex flex-col w-full">
            <div className="flex flex-row space-x-2">
                <label key="Thing Tag Name" >
                    Name:
                </label>
                <input className="	grow"
                    type="textarea"
                    key={"tag_name_" + tagState["name"]}
                    value={tagState["name"]}
                    onChange={NameHandler}
                />
            </div>
            <div className="flex flex-row space-x-2">
                <label key="Thing Tag Description" className="flex flex-row" > Description:</label>
                <input className="grow"
                    type="textarea"
                    key={"tag_description_Index=" + tagIndex.toString()}
                    value={tagState["description"]}
                    onChange={DescriptionHandler}
                />

            </div>
            <div className="flex flex-row  justify-end">
                <button className="btn btn-success m-2   " onClick={SaveHandler}>Save</button>
            </div>



        </div>



    </div>




    return (
        <div className=" flex flex-col border-solid	border-2 border-black rounded-md p-5">
            {content}
        </div>
    )
}

export { DisplayTags }