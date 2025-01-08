import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";

interface DisplayMessageSchemasProps {
    appData: any,
    setAppData: any
}
export default function DisplayMessageSchemas(props: DisplayMessageSchemasProps) {
    // Load available messages
    let messages: string[] = [];
    if ("web_thing_resource" in props.appData) {
        messages.push(...props.appData["web_thing_resource"])
    }
    if ("web_thing_state" in props.appData) {
        messages.push(...props.appData["web_thing_state"])
    }
    if ("web_thing_actions" in props.appData) {
        messages.push(...props.appData["web_thing_actions"])
    }

    let saveMessageData = (newMessage: any) => {
        let appDataCopy = { ...props.appData }

        for (let i = 0; i < appDataCopy["messagesSchemas"].length; i++) {
            if (appDataCopy["messagesSchemas"][i]["messageID"] === newMessage["messageID"]) {
                appDataCopy["messagesSchemas"][i] = newMessage
                props.setAppData(appDataCopy)
            }
        }
    }


    let content = []
    for (let i = 0; i < props.appData["messagesSchemas"].length; i++) {
        content.push(
            <SingleSchema key={((Math.random() + 301) * i).toString()}
                messages={messages}
                messageID={props.appData["messagesSchemas"][i]["messageID"]}
                channelID={props.appData["messagesSchemas"][i]["channelID"]}
                headers={props.appData["messagesSchemas"][i]["headers"]}
                payload={props.appData["messagesSchemas"][i]["payload"]}
                notifyParent={saveMessageData} />
        )
    }
    return (
        <div className="flex flex-col">
            <h1>Message Schemas:</h1>
            <div className="flex flex-col space-y-2 p-2 border-2 border-black rounded-md" >
                {content}
            </div>

        </div>);
}

interface SingleSchemaProps {
    notifyParent: any,
    messages: string[]
    messageID: string,
    channelID: string,
    headers: any,
    payload: any
}
function SingleSchema(props: SingleSchemaProps) {
    const [selectedMessage, setSelectedMessage] = useState(props.messageID)
    const [selectedChannel, setSelectedChannel] = useState(props.channelID)
    const [headers, setHeaders] = useState(props.headers)
    const [payload, setPayload] = useState(props.payload)

    let availableChannles = [
        "webthing_resource_channel",
        "properties_resource_channel",
        "actions_resource_channel"
    ]

    let saveHandler = () => {
        props.notifyParent(
            {
                messageID: selectedMessage,
                channelID: selectedChannel,
                headers: headers,
                payload: payload
            }
        )
    }

    return (
        <div key={"key:" + props.channelID + "," + props.messageID} className="flex flex-col space-y-2 p-2 border-2 border-black rounded-md">
            <div key={"messageID:" + props.messageID} className="flex flex-row items-baseline space-x-2">
                <h1>MessageID:</h1>
                <TextInputComponent key={props.messageID}
                    value={selectedMessage}
                    parentCallback={setSelectedMessage} />
            </div>
            <div key={"channelIDfor" + selectedMessage} className="flex flex-row items-baseline space-x-2 ">
                <h1>channelID:</h1>
                <TextInputComponent key={props.messageID}
                    value={selectedChannel}
                    parentCallback={setSelectedMessage} /> 
            </div>
            <div key={"headers_" + props.messageID}>
                <h1>Headers:</h1>
                <MessageSchemasHeader messageID={props.messageID} headerData={headers} parentCallback={setHeaders} />
            </div>
            <div key={"payload_" + props.messageID}>
                <h1>Payload:</h1>
                <MessageSchemasPayload 
                    messageID={props.messageID} 
                    payloadData={props.payload} 
                    parentCallback={setPayload} 
                />
            </div>
        </div>

    )

}

interface DropdownSelectProps {
    options: string[],
    defaultValue: string,
    parentCallback: any
}
function DropdownSelect(props: DropdownSelectProps) {
    const [myVal, setMyVal] = useState(props.defaultValue);

    let optionsContent = []
    for (let i = 0; i < props.options.length; i++) {

        optionsContent.push(
            <option key={props.options[i]} value={props.options[i]} >{props.options[i]}</option>
        )
    }

    let selectedOption = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setMyVal(event.target.value)
        props.parentCallback(event.target.value)
    }


    return (
        <select onChange={selectedOption} value={myVal} className="select select-info w-full max-w-xs">
            {optionsContent}
        </select>
    )
}


interface TextInputComponentProps {
    value: string,
    parentCallback: any
}
function TextInputComponent(props: TextInputComponentProps) {

    let setInputVal = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.parentCallback(event.target.value)
    }

    return (
        <input type="text" readOnly value={props.value} className="input input-bordered w-full  " onChange={setInputVal} />
    )
}


interface MessageSchemasHeaderProps {
    messageID: string,
    headerData: any,
    parentCallback: any
}
function MessageSchemasHeader(props: MessageSchemasHeaderProps) {

    // For every field in the header extract it's type
    function HeaderFieldAnalyzer(): JSX.Element {
        const fieldTypes = {
            typeString: "string",
            typeBoolean: "boolean",
            typeNumber: "number"
        }
        let headerFields = []
        if (props.headerData["type"] === "object") {
            for (let key in props.headerData["properties"]) {
                headerFields.push(
                    <div key={props.messageID+"_"+key}>
                        <label>Field Name: {key},</label>
                        <label>Type: {props.headerData["properties"][key]["type"]}</label>
                    </div>
                )
            }
        }


        return (<>{headerFields}</>)
    }

    return (<div className="flex flex-col border-2 border-black rounded-md p-2">
        <HeaderFieldAnalyzer />
    </div>)
}


interface MessageSchemasPayloadProps {
    messageID: string,
    payloadData: any,
    parentCallback: any
}
function MessageSchemasPayload(props:MessageSchemasPayloadProps) {
    // For every field in the header extract it's type
    function PayloadFieldAnalyzer(): JSX.Element {
        
        let payloadFields = []
        if (props.payloadData["type"] === "object") {
            for (let key in props.payloadData["properties"]) {
                payloadFields.push(
                    <div key={props.messageID+"_"+key}>
                        <label>Field Name: {key},</label>
                        <label>Type: {props.payloadData["properties"][key]["type"]}</label>
                    </div>
                )
            }
        }
        else{
            payloadFields.push(
                <div key={props.messageID+"_"+props.payloadData["type"]}> 
                    <label>Type: {props.payloadData["type"]}</label>
                </div>
            )
        }

        return (<>{payloadFields}</>)
    }


    return (<div className="flex flex-col border-2 border-black rounded-md p-2">
        <PayloadFieldAnalyzer   />
    </div>)
}