import { useContext } from "react";
import { DisplayUserInputContext } from "./displayData";
import { ServerNameInputElement, ServerForFieldInputElement, ServerGenericInputElement, ServerSecurityField, ServerVariablesField } from "@/app/components/SharedComponents"


interface DisplayServersProps {
    appData: any,
    setAppData: any
}


// Main Component
export default function DisplayServers({ appData, setAppData }: DisplayServersProps) {

    let content =
        <div className="flex items-center justify-center h-screen">
            <h1>Error: Loading Servers</h1>
        </div>

    try {

        let serversList: JSX.Element[] = [];
        serversList.push(
            <div key="Some randome servers key" id="servers_title">
                <p>Servers:</p>
            </div>
        )

        for (let i = 0; i < appData['servers'].length; i++) {
            serversList.push(
                <div id={"ServerID:" + appData['servers'][i]["name"]} className="flex flex-col w-full border-solid border-2 border-black rounded-md p-5" key={"Server Name:" + appData['servers'][i]["name"]}>
                    <SingleServer
                        key={"Server Name:" + appData['servers'][i]["name"] + "Sector"}
                        serverData={appData['servers'][i]}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </div>
            )
        }

        content = <div className="flex flex-col space-y-2" id="servers_container">{serversList}</div>
    }
    catch {
        content =
            <div className="flex items-center justify-center h-screen w-full">
                <h1>Error: Servers Object exists but something else gone wrong!</h1>
            </div>
    }


    return content;
}


// ************************* Helper Components ( Spaghetti Time! ) ************************* 
interface SingleServerProps {
    serverData: any,
    appData: any,
    setAppData: any
}
const SingleServer = ({ serverData, appData, setAppData }: SingleServerProps) => {

    // An enum
    const ServerFields = {
        for: "for",
        name: "name",
        host: "host",
        protocol: "protocol",
        pathname: "pathname",
        description: "description",
        title: "title",
        summary: "summary",
        variables: "variables",
        security: "security",
        bindings: "bindings"
    }
    const ServerForField = {
        all: "all",
        webthing_resource_channel: "webthing_resource_channel",
        properties_resource_channel: "properties_resource_channel",
        actions_resource_channel: "actions_resource_channel",
        webthing_resource_channel_and_properties_resource_channel: "webthing_resource_channel_&_properties_resource_channel",
        webthing_resource_channel_and_actions_resource_channel: "webthing_resource_channel_&_actions_resource_channel",
        properties_resource_channel_and_actions_resource_channel: "properties_resource_channel_&_actions_resource_channel"
    }


    let content: JSX.Element[] = [];

    for (const key in serverData) {
        if (key === ServerFields.name) {
            content.push(
                <div className="flex flex-row justify-start items-baseline space-y-2 w-full">
                    <div key={"servers_" + serverData['name'] + '_name'} className="flex flex-row items-center ">
                        <p>ServerID:</p>
                    </div>
                    <ServerNameInputElement
                        key={"servers." + serverData['name']}
                        name={"servers." + serverData['name']}
                        keyProp={"servers." + serverData['name']}
                        value={serverData['name']}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </div>
            )
        }
        if (key === ServerFields.for) {
            content.push(
                <div>
                    <div key={"servers_" + serverData['name'] + '_for'}>
                        <p>Channel:</p>
                    </div>
                    <ServerForFieldInputElement
                        key={"servers." + serverData['name'] + ".for"}
                        keyProp={"servers." + serverData['name'] + ".for"}
                        values={Object.values(ServerForField)}
                        startingVal={serverData[key]}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </div>
            )
        }

        if ([ServerFields.host, ServerFields.description, ServerFields.title, ServerFields.summary, ServerFields.pathname, ServerFields.protocol].includes(key)) {
            let displayedTitle = key.charAt(0).toUpperCase() + key.slice(1);
            content.push(
                <div className="flex flex-row justify-start items-baseline space-y-2 w-full">
                    <label key={"servers_" + serverData['name'] + '_' + key}>
                        {displayedTitle}:
                    </label>
                    <ServerGenericInputElement
                        serverID={serverData['name']}
                        fieldID={key}
                        key={"servers." + serverData['name'] + "." + key}
                        name={"servers." + serverData['name'] + "." + key}
                        keyProp={"servers." + serverData['name'] + "." + key}
                        value={serverData[key]}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </div>
            )
        }

        if (key === ServerFields.security) {
            content.push(
                <>
                    <div key={"servers_" + serverData['name'] + '_security'} className="w-96">
                        <p>Supported Security Schemas:</p>
                    </div>
                    <ServerSecurityField
                        serverID={serverData['name']}
                        fieldID={"security"}
                        keyProp={"servers." + serverData['name'] + "." + key}
                        id={"servers." + serverData['name'] + "." + key}
                        name={"servers." + serverData['name'] + "." + key}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </>

            )
        }

        if (key === ServerFields.variables){
            content.push(
                <>
                    <div key={"servers_" + serverData['name'] + '_variables'} className="w-96">
                        <p>Path Variables:</p>
                    </div>
                    <ServerVariablesField
                        serverID={serverData['name']}
                        fieldID={"variables"}
                        keyProp={"servers." + serverData['name'] + "." + key}
                        id={"servers." + serverData['name'] + "." + key}
                        name={"servers." + serverData['name'] + "." + key}
                        appData={appData}
                        setAppData={setAppData}
                    />
                </>

            )
        }

    }
    return (
        <div key={Math.random().toString()} className="">
            {content}
        </div>);
};

// ************************* Helper Components ( Spaghetti Time! ) ************************* 