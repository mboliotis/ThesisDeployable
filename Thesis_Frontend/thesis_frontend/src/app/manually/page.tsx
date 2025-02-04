/**
 *  This file contains everything needed for displaying a form for the user to insert the data.
 *  In the future this may need to divide in more files but for the time being it works... 😁
 */
"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
interface AsyncAPI_info_license {
    name: string,
    url?: string
}
interface AsyncAPI_info_contact {
    name?: string,
    url?: string,
    email?: string
}

interface AsyncAPI_server {
    host: string,
    protocol: string,
    protocolVersion?: string,
    pathname?: string,
    description?: string,
    title?: string,
    summary?: string
}

interface AsyncAPI_info {
    title: string,
    version: string,
    description?: string,
    termsOfService?: string,
    contact?: AsyncAPI_info_contact,
    license?: AsyncAPI_info_license
}

interface Servers {
    [key: string]: AsyncAPI_server
}

interface ApplicationData {
    asyncapi: string,
    info?: AsyncAPI_info
    servers?: Servers
}
interface ApplicationDataProps {
    appData: ApplicationData,
    appDataSetter: Dispatch<SetStateAction<ApplicationData>>
}


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


// These interfaces are used only for the component and must not be deleted!
interface InfoContact {
    name: string,
    url: string,
    email: string
}
interface InfoLicense {
    name: string,
    url?: string
}
function InfoContainer(props: ApplicationDataProps) {
    const [infoTitle, setInfoTitle] = useState<string>("")
    const [infoVersion, setInfoVersion] = useState<string>("")
    const [infoDescription, setInfoDescription] = useState<string>("")
    const [infoTermsOfService, setInfoTermsOfService] = useState<string>("")
    const [infoContact, setInfoContact] = useState<InfoContact>(
        {
            "name": "",
            "email": "",
            "url": ""
        }
    )
    const [infoLicense, setInfoLicense] = useState<InfoLicense>({
        "name": "",
        "url": ""
    })


    const SetInfoTitleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfoTitle(event.target.value)
    }

    const SetInfoVersionValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfoVersion(event.target.value)
    }

    const SetInfoDescriptionValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfoDescription(event.target.value)
    }

    const SetInfoTermsOfServiceValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfoTermsOfService(event.target.value)
    }

    const SaveInfo = () => {
        const appStateCopy = { ...props.appData }
        if (infoTitle.trim().length === 0) {
            alert("Info title can not be empty!")
            return
        }

        if (infoVersion.trim().length === 0) {
            alert("Info version can not be empty!")
            return
        }
        if (!appStateCopy.info) {
            appStateCopy.info = {
                title: infoTitle,
                version: infoVersion
            }
        }


        if (!isEmpty(infoDescription)) {
            appStateCopy.info.description = infoDescription;
        }
        if (!isEmpty(infoTermsOfService)) {
            appStateCopy.info.termsOfService = infoTermsOfService;
        }
        if (!isEmpty(infoContact.name)) {
            if (!appStateCopy.info.contact) {
                appStateCopy.info.contact = {
                    name: infoContact.name
                }
            }
            else {
                appStateCopy.info.contact.name = infoContact.name;
            }
        }
        if (!isEmpty(infoContact.email)) {
            if (!appStateCopy.info.contact) {
                appStateCopy.info.contact = {
                    email: infoContact.email
                }
            }
            else {
                appStateCopy.info.contact.email = infoContact.email;
            }
        }
        if (!isEmpty(infoContact.url)) {
            if (appStateCopy.info.contact) {
                appStateCopy.info.contact.url = infoContact.url;
            }
            else {
                appStateCopy.info.contact = {
                    url: infoContact.url
                }
            }
        }

        if (isEmpty(infoLicense.name) && typeof infoLicense.url !== "undefined" && !isEmpty(infoLicense.url)) {

        }
        // License exist
        if (!appStateCopy.info.license) {
            //Check if required field: name exists
            if (!isEmpty(infoLicense.name)) {
                appStateCopy.info.license = {
                    name: infoLicense.name
                }
                if (typeof infoLicense.url !== "undefined" && !isEmpty(infoLicense.url)) {
                    appStateCopy.info.license.url = infoLicense.url
                }
            }
        }
        else {
            if (!isEmpty(infoLicense.name)) {
                appStateCopy.info.license.name = infoLicense.name;

                if (typeof infoLicense.url !== "undefined" && !isEmpty(infoLicense.url)) {
                    appStateCopy.info.license.url = infoLicense.url
                }
            }

        }

        if (isEmpty(infoLicense.name) && typeof infoLicense.url !== "undefined" && !isEmpty(infoLicense.url)) {
            alert("You must set a name first.")
        }

        props.appDataSetter(appStateCopy)
    }

    return (
        <div className="flex flex-col space-y-2 w-full border-2 border-black p-2 rounded-md">
            <div  >
                <label>
                    info:
                </label>
            </div>
            <div className="flex flex-col space-y-5">
                <div id={"info_title"} className="flex flex-row  items-baseline space-x-2 ">
                    <div className="indent-10 ">
                        <label>
                            title:
                        </label>
                    </div>
                    <div>
                        <input type="text" value={infoTitle} onChange={SetInfoTitleValue} required className="input input-bordered max-w-screen-md" />
                    </div>
                    <div className="text-red-600">
                        <span >*Required</span>
                    </div>
                </div>
                <div id={"info_version"} className="flex flex-row  items-baseline space-x-2 ">
                    <div className="indent-10 ">
                        <label>
                            version:
                        </label>
                    </div>
                    <div>
                        <input type="text" value={infoVersion} onChange={SetInfoVersionValue} required className="input input-bordered max-w-screen-md" />
                    </div>
                    <div className="text-red-600">
                        <span >*Required</span>
                    </div>
                </div>
                <div id={"info_description"} className="flex flex-row  items-baseline space-x-2 ">
                    <div className="indent-10 ">
                        <label>
                            description:
                        </label>
                    </div>
                    <div>
                        <input type="text" value={infoDescription} onChange={SetInfoDescriptionValue} required className="input input-bordered max-w-screen-md" />
                    </div>
                </div>
                <div id={"info_termsOfService"} className="flex flex-row  items-baseline space-x-2 ">
                    <div className="indent-10 ">
                        <label>
                            termsOfService:
                        </label>
                    </div>
                    <div>
                        <input type="url" value={infoTermsOfService} onChange={SetInfoTermsOfServiceValue} required className="input input-bordered max-w-screen-md" />
                    </div>
                </div>
                <InfoContactContainer
                    contactObject={infoContact}
                    contactObjectSetter={setInfoContact}
                />
                <InfoLicenseContainer
                    licenseObject={infoLicense}
                    licenseObjectSetter={setInfoLicense} />
                <div id={"info_save_button"} className="flex flex-row justify-end">
                    <button className="btn bg-green-300" onClick={SaveInfo}>Save</button>
                </div>
            </div>
        </div>
    )
}

interface InfoContactContainerProps {
    contactObject: InfoContact,
    contactObjectSetter: Dispatch<SetStateAction<InfoContact>>
}
function InfoContactContainer(props: InfoContactContainerProps) {
    const SetContactObject = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (typeof props.contactObject === "undefined") return

        const contactObjectCopy = { ...props.contactObject }

        if (fieldName === "name") {
            contactObjectCopy.name = event.target.value
        }
        else if (fieldName === "url") {
            contactObjectCopy.url = event.target.value
        }
        else {
            contactObjectCopy.email = event.target.value
        }
        props.contactObjectSetter(contactObjectCopy)
    }


    return (
        <div className="flex flex-col space-y-2 p-2 border-2 border-black rounded-md">
            <div className=" indent-10 ">
                <label>
                    contact:
                </label>
            </div>
            <div id={"info_contact_name"} className="flex flex-row space-x-2 items-baseline">
                <div className=" indent-20">
                    <label>
                        name:
                    </label>
                </div>
                <div>
                    <input type="url" value={props.contactObject.name} onChange={(e) => SetContactObject(e, "name")} required className="input input-bordered max-w-screen-md" />
                </div>
            </div>
            <div id={"info_contact_url"} className="flex flex-row space-x-2 items-baseline">
                <div className=" indent-20">
                    <label>
                        url:
                    </label>
                </div>
                <div>
                    <input type="url" value={props.contactObject.url} onChange={(e) => SetContactObject(e, "url")} required className="input input-bordered max-w-screen-md" />
                </div>
            </div>
            <div id={"info_contact_email"} className="flex flex-row space-x-2 items-baseline">
                <div className=" indent-20">
                    <label>
                        email:
                    </label>
                </div>
                <div>
                    <input type="url" value={props.contactObject.email} onChange={(e) => SetContactObject(e, "email")} required className="input input-bordered max-w-screen-md" />
                </div>
            </div>
        </div>
    )
}



interface InfoLicenseContainerProps {
    licenseObject: InfoLicense,
    licenseObjectSetter: Dispatch<SetStateAction<InfoLicense>>
}
function InfoLicenseContainer(props: InfoLicenseContainerProps) {
    const SetLicenseObject = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (typeof props.licenseObject === "undefined") return

        const contactObjectCopy = { ...props.licenseObject }

        if (fieldName === "name") {
            contactObjectCopy.name = event.target.value
        }
        else if (fieldName === "url") {
            contactObjectCopy.url = event.target.value
        }
        props.licenseObjectSetter(contactObjectCopy)
    }


    return (
        <div className="flex flex-col space-y-2 p-2 border-2 border-black rounded-md">
            <div className=" indent-10 ">
                <label>
                    license:
                </label>
            </div>
            <div id={"info_license_name"} className="flex flex-row space-x-2 items-baseline">
                <div className=" indent-20">
                    <label>
                        name:
                    </label>
                </div>
                <div>
                    <input type="url" value={props.licenseObject.name} onChange={(e) => SetLicenseObject(e, "name")} required className="input input-bordered max-w-screen-md" />
                </div>
            </div>
            <div id={"info_license_url"} className="flex flex-row space-x-2 items-baseline">
                <div className=" indent-20">
                    <label>
                        url:
                    </label>
                </div>
                <div>
                    <input type="url" value={props.licenseObject.url} onChange={(e) => SetLicenseObject(e, "url")} required className="input input-bordered max-w-screen-md" />
                </div>
            </div>

        </div>
    )
}


function ServersContainer(props: ApplicationDataProps) {
    const [servers, setServers] = useState<Servers>();
    const [serverKeys, setServerKeys] = useState<{ [key: string]: string }>({}) // match serverIDs with keys (required by react)
    const [serialNumber, setSerialNumber] = useState<number>(0)

    // Initialize servers
    useEffect(() => {
        const appDataCopy = { ...props.appData }
        if (!appDataCopy.servers) {
            appDataCopy.servers = {

            }
            props.appDataSetter(appDataCopy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const CreateNewServer = () => {
        const serversCopy = { ...servers }
        const serverKey = "server_" + serialNumber.toString() // Generate a key for render (immutable)
        const serverDefaultID = serverKey // Generate a default ID
        setSerialNumber(serialNumber + 1)
        serversCopy[serverDefaultID] = {
            host: "",
            protocol: ""
        }
        setServers(serversCopy)
        const serverKeysCopy = { ...serverKeys }
        serverKeysCopy[serverDefaultID] = serverKey // assign a key to a server ID
        setServerKeys(serverKeysCopy)
    }

    const UpdateServerID = (activeServerID: string, newServerID: string) => {
        let count = 0;
        // Check for doubles
        for (const serverID in serverKeys) {
            if (newServerID === serverID){
                count++
            }
        }
        if(count>0){
            alert("Error: High probability of doublicated server IDs!")
            return
        }
        console.log(count)
        // Update serverID -> key matching
        const temp = {} as { [key: string]: string }
        for (const serverID in serverKeys) {
            if (serverID === activeServerID) {
                temp[newServerID] = serverKeys[serverID]
            }
            else {
                temp[serverID] = serverKeys[serverID]
            }
        }
        setServerKeys(temp)

        // Update servers
        const serversCopy = {} as Servers
        for (const key in servers) {
            if (key === activeServerID) {
                serversCopy[newServerID] = servers[key]
            }
            else {
                serversCopy[key] = servers[key]
            }
        }
        setServers(serversCopy)
    }

    const DisplayServers: JSX.Element[] = []

    for (const serverID in servers) {
        DisplayServers.push(
            <ServerUnit
                key={serverKeys[serverID]}
                server_id={serverID}
                server_id_setter={UpdateServerID}
                server_data={servers[serverID]}
            />
        )
    }



    return (
        <div className="flex flex-col border-2 border-black rounded-md space-y-2 p-2">
            <div className="flex flex-col space-y-2">
                {DisplayServers}
            </div>
            <div>
                <button className="btn" onClick={CreateNewServer}>Add Server</button>
            </div>
            <div>
                <button className="btn" onClick={() => { console.log(servers) }}>Print</button>
            </div>
        </div>
    )
}

interface ServerUnitProps {
    server_id: string,
    server_id_setter: (activeServerID: string, newServerID: string) => void,
    server_data: AsyncAPI_server
}
function ServerUnit(props: ServerUnitProps) {
    const [serverHost, setServerHost] = useState(props.server_data.host)
    const [serverProtocol, setServerProtocol] = useState(props.server_data.protocol)
    

    const HostSetter = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setServerHost(event.target.value)
    }

    const ProtocolSetter = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setServerProtocol(event.target.value)
    }

    const ServerIDUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.server_id_setter(props.server_id, event.target.value)
    }

    return (
        <div className="flex flex-col space-y-2 p-2 border-2 border-black rounded-md">
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>Server ID:</label>
                </div>
                <div>
                    <input type="text" value={props.server_id} className="input input-bordered w-full max-w-xs" onChange={ServerIDUpdate} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>host:</label>
                </div>
                <div>
                    <input type="text" value={serverHost} className="input input-bordered w-full max-w-xs" onChange={HostSetter} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>protocol:</label>
                </div>
                <div>
                    <input type="text" value={serverProtocol} className="input input-bordered w-full max-w-xs" onChange={ProtocolSetter} />
                </div>
            </div>
            <div className="flex flex-row space-x-4 justify-end">
                <button className="btn bg-red-300">Delete</button>
                <button className="btn bg-green-300">Save</button>
            </div>
        </div>
    )
}


// ============================================== Tools ============================================== //

/**
 * Check if a string is empty or filled with white spaces only.
 * @param str The string that may be empty. 
 * @returns true / false
 */
function isEmpty(str: string): boolean {
    return str.trim().length === 0
}

// ============================================== Tools ============================================== //