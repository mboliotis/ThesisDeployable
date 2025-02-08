import { ReactNode, useEffect, useState } from "react";
import { ApplicationDataProps, Message } from "@/tools/interfaces"

function MessagesContainer(props: ApplicationDataProps): ReactNode {
    const [messages, setMessages] = useState<{
        [key: string]: {
            messageID: string,
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
                headers: headers,
                payload: payload
            }
            setSerialNumber(serialNumber + 1)
        }
        setMessages(initMessages)
    }, [])



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
                />
            )
        }
    }

    const CreateMessage = () => {
        const messagesCopy = { ...messages }
        const messageKey: string = "messages_serial_number_" + serialNumber.toString()
        messagesCopy[messageKey] = {
            messageID: "Message " + serialNumber.toString(),
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
                <div className="col-span-2 justify-self-end" >
                    <button className="btn bg-green-300" onClick={() => console.log("here")}>Save</button>
                </div>
            </div>

        </div>
    )
}

interface SingleMessageProps {
    messageKey: string,
    messageID: string,
    headers?: any,
    payload?: any
}
function SingleMessage(props: SingleMessageProps) {


    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row items-baseline space-x-2 w-full">
                <label>
                    Message ID:
                </label>
                <input type="text" value={props.messageID} className="input input-bordered w-3/4 " />
                <button className="btn">Delete</button>
            </div>
            <div className="flex flex-col space-y-2 h-[5000]">
                <label>
                    headers:
                </label>
                <textarea className="textarea textarea-bordered" ></textarea>
            </div>
            <div className="flex flex-col space-y-2">
                <label>
                    payload:
                </label>
                <textarea className="textarea textarea-bordered"></textarea>
            </div>
            <hr/>
        </div>

    )
}

export { MessagesContainer }