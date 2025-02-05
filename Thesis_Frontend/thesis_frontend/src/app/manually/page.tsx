/**
 *  This file contains everything needed for displaying a form for the user to insert the data.
 *  In the future this may need to divide in more files but for the time being it works... 😁
 */
"use client"
import {useState } from "react"
import  {ApplicationData, ApplicationDataProps} from "@/tools/interfaces"
import { VersionContainer } from "../components/manually/asyncapiVersion";
import { InfoContainer } from "../components/manually/asyncapiInfo";
import { ServersContainer } from "../components/manually/asyncapiServers";

export default function MainContainer() {
    const [appSate, setAppState] = useState<ApplicationData>({ asyncapi: "3.0.0" });
    const GenerateTD = () => {
        console.log(JSON.stringify(appSate))
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
            <InfoContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
            <ServersContainer
                appData={props.appData}
                appDataSetter={props.appDataSetter}
            />
        </div>
    )
}


