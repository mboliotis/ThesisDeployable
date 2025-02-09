import { ReactNode, useEffect, useState } from "react";
import { ApplicationDataProps, Message } from "@/tools/interfaces" 
import { isEmpty } from "@/tools/usefulFunctions";

enum MessageType {
    Property = "Property",
    Action = "Action",
    WebThing = "WebThing"
}

enum PipelineMessages {
    Delete,
    Update
}

interface PipelineMessageStructure {
    command: PipelineMessages,
    messageKey: string,
    data?: {
        messageID: string,
        type: MessageType,
        headers?: any,
        payload?: any
    }
}

function MessagesContainer(props: ApplicationDataProps): ReactNode {
    const [messages, setMessages] = useState<{
        [key: string]: {
            messageID: string,
            type: MessageType,
            headers?: any,
            payload?: any
        }
    }>({})
    const [serialNumber, setSerialNumber] = useState<number>(0)

    // Init
    useEffect(() => {
        if (typeof props.appData.messages === "undefined") return

        const initMessages: {
            [key: string]: {
                messageID: string,
                type: MessageType,
                headers?: any,
                payload?: any
            }
        } = {}
        for (const key in props.appData.messages) {
            const messageID = key
            const headers = props.appData.messages[key].headers
            const payload = props.appData.messages[key].payload
            const messageKey: string = "messages_serial_number_" + serialNumber.toString()
            initMessages[messageKey] = {
                messageID: messageID,
                type: MessageType.Property,
                headers: headers,
                payload: payload
            }
            setSerialNumber(serialNumber + 1)
        }
        setMessages(initMessages)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Autosave changes
    useEffect(()=>{
        const appStateCopy = {...props.appData}
        appStateCopy.messages = messages
        
        props.appDataSetter(appStateCopy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    const CommunicationPipeline = (params: PipelineMessageStructure) => {
        if (params.command === PipelineMessages.Delete) {
            try {
                const messagesCopy: {
                    [key: string]: {
                        messageID: string,
                        type: MessageType,
                        headers?: any,
                        payload?: any
                    }
                } = {}

                for (const key in messages) {
                    if (key === params.messageKey) continue
                    messagesCopy[key] = messages[key]
                }
                setMessages(messagesCopy)
                return
            }
            catch (e) {
                alert("Error: Message can not be deleted!")
            }

        }

        if (params.command === PipelineMessages.Update) {
            
            try {
                const messagesCopy = {...messages}
                if (typeof params.data === "undefined") throw new Error("No Data!")
                
                messagesCopy[params.messageKey] = params.data 
                setMessages(messagesCopy)
                return
            }
            catch (e) {
                alert("Error: Message can not be deleted!")
            }
            return
        }


    }




    const displayMessage: JSX.Element[] = []
    for (const key in messages) {
        const selectedMsg = messages[key]
        if (typeof selectedMsg !== "undefined") {
            displayMessage.push(
                <SingleMessage
                    messageKey={key}
                    key={key}
                    messageID={selectedMsg.messageID}
                    headers={selectedMsg.headers}
                    payload={selectedMsg.payload}
                    messageType={selectedMsg.type}
                    communicationPipeline={CommunicationPipeline}
                />
            )
        }
    }

    const CreateMessage = () => {
        const messagesCopy = { ...messages }
        const messageKey: string = "messages_serial_number_" + serialNumber.toString()
        messagesCopy[messageKey] = {
            messageID: "Message " + serialNumber.toString(),
            type: MessageType.Property,
            headers: undefined,
            payload: undefined
        }
        setSerialNumber(serialNumber + 1)
        setMessages(messagesCopy)
    }



    return (
        <div className="flex flex-col border-2 border-black rounded-md space-y-2 w-full p-2">
            {displayMessage}
            <div className=" grid grid-cols-3 gap-2  w-full ">
                <div >
                    <button className="btn" onClick={CreateMessage}>New Message</button>
                </div>
            </div>

        </div>
    )
}

interface SingleMessageProps {
    messageKey: string,
    messageID: string,
    messageType: MessageType
    headers?: any,
    payload?: any
    communicationPipeline: (params: PipelineMessageStructure) => void
}
function SingleMessage(props: SingleMessageProps) {
    const [msgHeader, setMsgHeader] = useState<string>("{ }")
    const [msgPayload, setMsgPayload] = useState<string>('{ "type": "string"}')
    const [msgType, setMsgType] = useState<MessageType>(MessageType.Property)
    const [msgID, setMsgID] = useState<string>(props.messageID)

    useEffect(() => {
        if (typeof props.headers !== "undefined") {
            setMsgHeader(props.headers)
        }

        if (typeof props.payload !== "undefined") {
            setMsgPayload(props.payload)
        }

        if (typeof props.messageType !== "undefined") {
            setMsgType(props.messageType)
        }
    }, [props.headers, props.messageType, props.payload])


    const HandlerMsgType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === MessageType.WebThing){
            setMsgType(MessageType.WebThing)
        }
        else if (event.target.value === MessageType.Action){
            setMsgType(MessageType.Action)
        }
        else{
            setMsgType(MessageType.Property)
        }
        
    }

    const HandlerMsgID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsgID(event.target.value)
    }

    const HandleMsgHeader = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsgHeader(event.target.value)
    }

    const HandleMsgPayload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsgPayload(event.target.value)
    }

    const DeleteMessage = () => {

        props.communicationPipeline(
            {
                command: PipelineMessages.Delete,
                messageKey: props.messageKey
            }
        )
    }

    const SaveMessage = () =>{ 
        let headers = msgHeader
        let payload = msgPayload
        if (isEmpty(msgHeader)){
            headers = "{}"
        }
        if(isEmpty(msgPayload)){
            payload = "{}"
        }
        props.communicationPipeline(
            {
                command: PipelineMessages.Update,
                messageKey: props.messageKey,
                data: {
                    messageID: msgID,
                    type: msgType,
                    headers: headers,
                    payload: payload
                }
            }
        )
    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="grid grid-cols-10 items-baseline">
                <div className="col-span-1">
                    <label>
                        Message ID:
                    </label>
                </div>
                <div className="col-span-8">
                    <input type="text" value={msgID} className="input input-bordered w-full " onChange={HandlerMsgID} />
                </div>
                <div className="col-span-1 justify-self-end">
                    <button className="btn bg-red-300" onClick={DeleteMessage}>Delete</button>
                </div>
            </div>
            <div className="flex flex-row w-full items-baseline space-x-2">
                <div>
                    <label className=" ">
                        Type:
                    </label>
                </div>
                <div>
                    <select className="select select-bordered  " value={msgType} onChange={HandlerMsgType}>
                        <option value={MessageType.Property} >Property</option>
                        <option value={MessageType.Action}>Action</option>
                        <option value={MessageType.WebThing}>Web Thing</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col space-y-2 h-[5000]">
                <label>
                    headers (JSON Schema):
                </label>
                <textarea className="textarea textarea-bordered  h-[200px]" value={msgHeader} onChange={HandleMsgHeader}></textarea>
            </div>
            <div className="flex flex-col space-y-2">
                <label>
                    payload (JSON Schema):
                </label>
                <textarea className="textarea textarea-bordered h-[200px]" value={msgPayload} onChange={HandleMsgPayload}></textarea>
            </div>
            <div className="flex flex-row w-full justify-end" >
                <button className="btn bg-green-300" onClick={SaveMessage}>Save</button>
            </div>
            <hr />
        </div>

    )
}

export { MessagesContainer }