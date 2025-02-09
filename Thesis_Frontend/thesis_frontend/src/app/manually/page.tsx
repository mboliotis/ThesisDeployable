/**
 *  This file contains everything needed for displaying a form for the user to insert the data.
 *  In the future this may need to divide in more files but for the time being it works... 😁
 */
"use client"
import { useState } from "react"
import { ApplicationData, ApplicationDataProps, MessageType } from "@/tools/interfaces"
import { VersionContainer } from "@/app/components/manually/asyncapiVersion";
import { InfoContainer } from "@/app/components/manually/asyncapiInfo";
import { ServersContainer } from "@/app/components/manually/asyncapiServers";
import { MessagesContainer } from "@/app/components/manually/asyncapiMessages"
import { IdContainer } from "../components/manually/asyncapiIdentifier";
import { ExternalDocsContainer } from "../components/manually/asyncapiExternalDocs";

enum AsyncapiOperationActions {
    send = "send",
    receive = "receive"
}

export default function MainContainer() {
    const [appSate, setAppState] = useState<ApplicationData>({ asyncapi: "3.0.0", id: "" });

    const GenerateTD = () => {
        if (!("info" in appSate)) {
            alert("Must fill info required fields")
            return
        }
        if (!("servers" in appSate)) {
            alert("Must fill servers required fields")
            return
        }
        if (!("messages" in appSate)) {
            alert("Must exist at least one message!")
            return
        }

        if (typeof appSate.messages !== "undefined") {
            if (Object.keys(appSate.messages).length === 0) {
                alert("Must exist at least one message!")
                return
            }
        }

        let externalDocs = {
            description: "",
            url: ""
        }

        if ("externalDocs" in appSate && typeof appSate.externalDocs !== "undefined") {
            externalDocs = appSate.externalDocs
        }

        const properties_resource_channel: any = {
            messages: {

            }
        }
        const actions_resource_channel: any = {
            messages: {

            }
        }
        const webthing_resource_channel: any = {
            messages: {

            }
        }

        const webthing_resource_operation: any = {
            action: AsyncapiOperationActions.send,
            channel: {
                "$ref": "#/channels/webthing_resource_channel"
            },
            messages: []
        }
        const properties_resource_operation: any = {
            action: AsyncapiOperationActions.send,
            channel: {
                "$ref": "#/channels/properties_resource_channel"
            },
            messages: []
        }
        const actions_resource_operation: any = {
            action: AsyncapiOperationActions.receive,
            channel: {
                "$ref": "#/channels/actions_resource_channel"
            },
            messages: []
        }

        for (const key in appSate.messages) {
            const selectedMessage = appSate.messages[key]
            if (selectedMessage.type === MessageType.Property) {
                // init message
                properties_resource_channel.messages[selectedMessage.messageID] = {}

                // Assign headers and payload
                if (typeof selectedMessage.headers === "string") {
                    properties_resource_channel.messages[selectedMessage.messageID]["headers"] = JSON.parse(selectedMessage.headers)
                }
                if (typeof selectedMessage.payload === "string") {
                    properties_resource_channel.messages[selectedMessage.messageID]["payload"] = JSON.parse(selectedMessage.payload)
                }

                // Assign operation
                properties_resource_operation.messages.push(
                    {
                        "$ref": "#/channels/properties_resource_channel/messages/" + selectedMessage.messageID
                    }
                )

            }
            else if (appSate.messages[key].type === MessageType.Action) {
                // init message
                actions_resource_channel.messages[selectedMessage.messageID] = {}

                // Assign headers and payload
                if (typeof selectedMessage.headers === "string") {
                    actions_resource_channel.messages[selectedMessage.messageID]["headers"] = JSON.parse(selectedMessage.headers)
                }
                if (typeof selectedMessage.payload === "string") {
                    actions_resource_channel.messages[selectedMessage.messageID]["payload"] = JSON.parse(selectedMessage.payload)
                }

                // Assign operation
                actions_resource_operation.messages.push(
                    {
                        "$ref": "#/channels/actions_resource_channel/messages/" + selectedMessage.messageID
                    }
                )
            }
            else {
                // init message
                webthing_resource_channel.messages[selectedMessage.messageID] = {}

                // Assign headers and payload
                if (typeof selectedMessage.headers === "string") {
                    webthing_resource_channel.messages[selectedMessage.messageID]["headers"] = JSON.parse(selectedMessage.headers)
                }
                if (typeof selectedMessage.payload === "string") {
                    webthing_resource_channel.messages[selectedMessage.messageID]["payload"] = JSON.parse(selectedMessage.payload)
                }

                // Assign operation
                webthing_resource_operation.messages.push(
                    {
                        "$ref": "#/channels/webthing_resource_channel/messages/" + selectedMessage.messageID
                    }
                )
            }
        }

        const asyncapiObj = {
            asyncapi: appSate.asyncapi,
            id: appSate.id,
            info: { ...appSate.info, externalDocs: externalDocs },
            servers: appSate.servers,
            channels: {
                webthing_resource_channel: webthing_resource_channel,
                properties_resource_channel: properties_resource_channel,
                actions_resource_channel: actions_resource_channel
            },
            operations: {
                webthing_resource_operation: webthing_resource_operation,
                properties_resource_operation: properties_resource_operation,
                actions_resource_operation: actions_resource_operation
            },
            components: {}
        }



        const appDataAsJson = JSON.stringify(asyncapiObj, null, 2)
        const blob = new Blob([appDataAsJson], { type: 'application/json' })
        const href = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.download = 'Thing Description.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
    }
    return (
        <div className="flex flex-col w-screen h-screen bg-slate-500 p-5 space-y-2 overflow-auto">
            <SectionsContainer
                appData={appSate}
                appDataSetter={setAppState} />
            <div  >
                <button className="btn bg-green-300" onClick={GenerateTD}>Generate Thing Description</button>
            </div>
        </div>
    );
}

function SectionsContainer(props: ApplicationDataProps) {

    return (
        <div className="flex flex-col space-y-2 w-full">
            <VersionContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <IdContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <ExternalDocsContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <InfoContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <ServersContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <MessagesContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
        </div>
    )
}


