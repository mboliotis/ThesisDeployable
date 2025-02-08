import { ApplicationDataProps, AsyncAPI_server, IServerVariable, IServerVariables, Servers } from "@/tools/interfaces";
import { isEmpty, undefined2string } from "@/tools/usefulFunctions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from 'next/image'

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

    /*
     *  This function generates a new server and store it in app state.
     *  Also creates a key that will be used by react at render.
     */
    const CreateNewServer = () => {
        const serversCopy = { ...servers }
        const serverKey = "server_serial_number_" + serialNumber.toString() // Generate a key for render (immutable)
        const serverDefaultID = serverKey // Generate a default ID
        setSerialNumber(serialNumber + 1)
        serversCopy[serverDefaultID] = {
            host: "Default Value",
            protocol: "Default Value"
        }
        setServers(serversCopy)
        const serverKeysCopy = { ...serverKeys }
        serverKeysCopy[serverDefaultID] = serverKey // assign a key to a server ID
        setServerKeys(serverKeysCopy)
    }

    /*
     * Update the server ID and also match this new ID with the render key.
     * @param activeServerID The current server ID.
     * @param newServerID New, user defined, ID.
     * @returns void
     */
    const UpdateServerID = (activeServerID: string, newServerID: string) => {
        let count = 0;
        // Check for doubles
        for (const serverID in serverKeys) {
            if (newServerID === serverID) {
                count++
            }
        }
        if (count > 0) {
            alert("Error: High probability of doublicated server IDs!")
            return
        }
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

    const DeleteServer = (activeServerID: string) => {
        const serversCopy: Servers = {}
        for (const serverID in servers) {
            if (serverID === activeServerID) {
                continue;
            }
            else {
                serversCopy[serverID] = servers[serverID]
            }
        }
        setServers(serversCopy)
        const appStateCopy = { ...props.appData }
        appStateCopy.servers = serversCopy
        props.appDataSetter(appStateCopy)
    }

    const UpdateServerData = (activeServerID: string, serverData: AsyncAPI_server) => {
        const serversCopy = { ...servers }
        try {
            // Local State
            serversCopy[activeServerID] = serverData
            setServers(serversCopy)
            // Application State
            const appStateCopy = { ...props.appData }
            appStateCopy.servers = serversCopy
            props.appDataSetter(appStateCopy)
        }
        catch (e) {
            alert("Error while storing new server data!")
        }
    }

    // For every server object in app state generate a component.
    const DisplayServers: JSX.Element[] = []
    for (const serverID in servers) {
        DisplayServers.push(
            <ServerUnit
                key={serverKeys[serverID]}
                server_id={serverID}
                server_id_setter={UpdateServerID}
                server_data={servers[serverID]}
                server_delete={DeleteServer}
                server_update={UpdateServerData}
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
        </div>
    )
}

interface ServerUnitProps {
    server_id: string,
    server_data: AsyncAPI_server,
    server_id_setter: (activeServerID: string, newServerID: string) => void,
    server_delete: (activeServerID: string) => void,
    server_update: (activeServerID: string, serverData: AsyncAPI_server) => void
}
function ServerUnit(props: ServerUnitProps) {
    const [serverHost, setServerHost] = useState(props.server_data.host)
    const [serverProtocol, setServerProtocol] = useState(props.server_data.protocol)
    const [serverProtocolVersion, setServerProtocolVersion] = useState(undefined2string(props.server_data.protocolVersion))
    const [serverPathname, setServerPathname] = useState(undefined2string(props.server_data.pathname))
    const [serverDescription, setServerDescription] = useState(undefined2string(props.server_data.description))
    const [serverTitle, setServerTitle] = useState(undefined2string(props.server_data.title))
    const [serverSummary, setServerSummary] = useState(undefined2string(props.server_data.summary))
    const [serverVariables, setServerVariables] = useState<IServerVariables | undefined>(props.server_data.variables)

    const HostSetter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServerHost(event.target.value)
    }

    const ProtocolSetter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServerProtocol(event.target.value)
    }

    const ServerIDUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.server_id_setter(props.server_id, event.target.value)
    }

    const SaveChanges = () => {
        if (isEmpty(serverHost)){
            alert("Host can not be empty!")
            return
        }
        if (isEmpty(serverProtocol)){
            alert("Protocol can not be empty!")
            return
        }
        const serverData: AsyncAPI_server = {
            host: serverHost,
            protocol: serverProtocol,
            protocolVersion: serverProtocolVersion,
            pathname: serverPathname,
            description: serverDescription,
            title: serverTitle,
            summary: serverSummary,
            variables: serverVariables
        }
        props.server_update(props.server_id, serverData)
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
                <div className="text-red-600">
                    <label>*Required</label>
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>protocol:</label>
                </div>
                <div>
                    <input type="text" value={serverProtocol} className="input input-bordered w-full max-w-xs" onChange={ProtocolSetter} />
                </div>
                <div className="text-red-600">
                    <label>*Required</label>
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>protocolVersion:</label>
                </div>
                <div>
                    <input type="text" value={serverProtocolVersion} className="input input-bordered w-full max-w-xs" onChange={(e) => setServerProtocolVersion(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>pathname:</label>
                </div>
                <div>
                    <input type="text" value={serverPathname} className="input input-bordered w-full max-w-xs" onChange={(e) => setServerPathname(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>description:</label>
                </div>
                <div>
                    <input type="text" value={serverDescription} className="input input-bordered w-full max-w-xs" onChange={(e) => setServerDescription(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>title:</label>
                </div>
                <div>
                    <input type="text" value={serverTitle} className="input input-bordered w-full max-w-xs" onChange={(e) => setServerTitle(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-row space-x-2 items-baseline">
                <div>
                    <label>summary:</label>
                </div>
                <div>
                    <input type="text" value={serverSummary} className="input input-bordered w-full max-w-xs" onChange={(e) => setServerSummary(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-col space-y-2 items-baseline border-2 border-black rounded-md p-2 w-full">
                <div className="w-full" >
                    <label>variables:</label>
                </div>
                <div className="w-full" >
                    <ServerVariablesContainer
                        serverID={props.server_id}
                        variablesSetter={setServerVariables}
                        variables={serverVariables}
                    />
                </div>
            </div>
            <div className="flex flex-row space-x-4 justify-end">
                <button className="btn bg-red-300" onClick={() => props.server_delete(props.server_id)}>Delete</button>
                <button className="btn bg-green-300" onClick={SaveChanges}>Save</button>
            </div>
        </div>
    )
}

interface ServerVariablesContainerProps {
    serverID: string,
    variablesSetter: Dispatch<SetStateAction<IServerVariables | undefined>>,
    variables: IServerVariables | undefined
}
function ServerVariablesContainer(props: ServerVariablesContainerProps) {
    const [serialNumber, setSerialNumber] = useState(0)
    const [keyRegistry, setKeyRegistry] = useState<Map<string, string>>(new Map<string, string>())

    const ChangeVariableID = (oldVariableID: string, newVariableID: string) => {
        
        if (typeof props.variables !== "undefined"){
            if (newVariableID in props.variables){
                alert("This ID already exists!")
                return
            }
        }
        

        const varaiblesCopy: IServerVariables = {}

        for (const key in props.variables) {
            if (key === oldVariableID) {
                varaiblesCopy[newVariableID] = props.variables[oldVariableID]
            }
            else{
                varaiblesCopy[key] = props.variables[key]
            }
        }
        
        const keyRegistryCopy = new Map(keyRegistry)
        const registryValue = keyRegistry.get(oldVariableID)
        if (typeof registryValue !== "undefined"){
            keyRegistryCopy.set(newVariableID, registryValue)
            keyRegistryCopy.delete(oldVariableID)
            setKeyRegistry(keyRegistryCopy)
            props.variablesSetter(varaiblesCopy)
        }
        
        
    }

    const ChangeVariableData = (variableID: string, newVariableData: string) => {
        // Convert json string to object
        const varData = JSON.parse(newVariableData)
        const variablesCopy = { ...props.variables }
        variablesCopy[variableID] = varData 
        props.variablesSetter(variablesCopy)
    }

    // Initialize
    useEffect(() => {
        if (typeof props.variables === "undefined") return
        const keyRegistryCopy = new Map<string, string>(keyRegistry)
        for (const variableID in props.variables) {
            const varKey = "server_variable_serial_" + serialNumber.toString()
            setSerialNumber(serialNumber + 1)
            keyRegistryCopy.set(variableID, varKey)
        }
        setKeyRegistry(keyRegistryCopy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const DeleteVariable = (variableID: string) => {
        const varaiblesCopy: IServerVariables = {}

        for (const key in props.variables) {
            if (key === variableID) continue
            varaiblesCopy[key] = props.variables[key]
        }

        props.variablesSetter(varaiblesCopy)
    }

    // Create an array with components to be displayed
    const displayVars: JSX.Element[] = []
    if (typeof props.variables !== "undefined") {
        for (const key in props.variables) {
            if (!keyRegistry.has(key)) continue
            displayVars.push(
                <ServerVariable
                    key={keyRegistry.get(key)}
                    variableID={key}
                    dataCallBack={ChangeVariableData}
                    idCallBack={ChangeVariableID}
                    variableData={props.variables[key]}
                    deleteVariableCallback={DeleteVariable}
                />
            )
        }
    }

    const CreateVariable = () => {
        if (typeof props.variables !== "undefined") {

            const variablesCopy = { ...props.variables } // Copy state variable
            const newVar: IServerVariable = {
                enum: [],
                default: "Default Value",
                description: "Here shall go the description",
                examples: []
            }

            const keyRegistryCopy = new Map<string, string>(keyRegistry)
            const varKey = "server_variable_serial_" + serialNumber.toString()
            const newVariableID = "server_variable_serial_" + serialNumber.toString()
            keyRegistryCopy.set(newVariableID, varKey)
            setSerialNumber(serialNumber + 1)
            setKeyRegistry(keyRegistryCopy)
            variablesCopy[newVariableID] = newVar
            props.variablesSetter(variablesCopy)
        }
        else {
            const variablesCopy: IServerVariables = {}
            const newVar: IServerVariable = {
                enum: [],
                default: "Default Value",
                description: "Here shall go the description",
                examples: []
            }
            const keyRegistryCopy = new Map<string, string>(keyRegistry)
            const varKey = "server_variable_serial_" + serialNumber.toString()
            const newVariableID = "server_variable_serial_" + serialNumber.toString()
            variablesCopy[newVariableID] = newVar
            keyRegistryCopy.set(newVariableID, varKey)
            setSerialNumber(serialNumber + 1)
            setKeyRegistry(keyRegistryCopy)
            props.variablesSetter(variablesCopy)
        }
    }

    return (
        <div className="flex flex-col w-full space-y-2" >
            <div className="flex flex-col w-full space-y-2" >
                {displayVars}
            </div>
            <div>
                <button className="btn" onClick={CreateVariable}>Add</button>
            </div>
        </div>
    )
}

interface ServerVariableProps {
    variableID: string,
    deleteVariableCallback: (variableID: string) => void,
    dataCallBack: (variableID: string, newVariableData: string) => void,
    idCallBack: (oldVariableID: string, newVariableID: string) => void,
    variableData: IServerVariable
}
function ServerVariable(props: ServerVariableProps) {
    const [svEnum, setSVEnum] = useState<string[]>([])
    const [svDefault, setSVDefault] = useState<string>("")
    const [svDescription, setSVDescription] = useState<string>("")
    const [svExamples, setSVExamples] = useState<string[]>([])

    useEffect(() => {
        if (typeof props.variableData.enum !== "undefined") {
            setSVEnum(props.variableData.enum)
        }

        if (typeof props.variableData.default !== "undefined") {
            setSVDefault(props.variableData.default)
        }

        if (typeof props.variableData.description !== "undefined") {
            setSVDescription(props.variableData.description)
        }

        if (typeof props.variableData.examples !== "undefined") {
            setSVExamples(props.variableData.examples)
        }
    }, [props])

    const SaveChanges = (source: string, value: string) => {

        if (source === "variableID") {
            props.idCallBack(props.variableID, value)
            return
        }

        let variableState = {
            enum: svEnum,
            default: svDefault,
            description: svDescription,
            examples: svExamples
        }

        if (source === "enum") {
            try {
                const enumData = JSON.parse(value) as { enum: string[] }
                variableState = {
                    enum: enumData.enum,
                    default: svDefault,
                    description: svDescription,
                    examples: svExamples
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        else if (source === "default") {
            variableState = {
                enum: svEnum,
                default: value,
                description: svDescription,
                examples: svExamples
            }
        }
        else if (source === "description") {
            variableState = {
                enum: svEnum,
                default: svDefault,
                description: value,
                examples: svExamples
            }
        }
        else if (source === "examples") {
            try {
                const examplesData = JSON.parse(value) as { examples: string[] }
                variableState = {
                    enum: svEnum,
                    default: svDefault,
                    description: svDescription,
                    examples: examplesData.examples
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        else {
            return
        }

        // Serialize data to pass them to parent component
        const serverVariableAsJson = JSON.stringify(variableState)
        props.dataCallBack(props.variableID, serverVariableAsJson)
    }



    return (
        <div className="flex flex-col space-y-2 items-baseline border-2 border-black rounded-md p-2 w-full">
            <div className="flex flex-row items-center space-x-2 w-full">
                <div>
                    <label>
                        variableID:
                    </label>
                </div>
                <div className="w-full">
                    <input type="text" value={props.variableID} onChange={(e) => SaveChanges("variableID", e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <button className="btn " onClick={() => props.deleteVariableCallback(props.variableID)}>
                        <Image
                            src="/icons/trash.png"
                            width={30}
                            height={30}
                            alt="delete button"
                        />
                    </button>
                </div>
            </div>
            <div className="flex flex-row items-baseline space-x-2 w-full">
                <div >
                    <label>
                        default:
                    </label>
                </div>
                <div className="w-full">
                    <input type="text" value={svDefault} onChange={(e) => SaveChanges("default", e.target.value)} className="input input-bordered w-full " />
                </div>
            </div>
            <div className="flex flex-row items-baseline space-x-2 w-full">
                <div>
                    <label>
                        description:
                    </label>
                </div>
                <div className="w-full">
                    <input type="text" value={svDescription} onChange={(e) => SaveChanges("description", e.target.value)} className="input input-bordered w-full " />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div>
                    <label>
                        enum:
                    </label>
                </div>
                <ServerVariablesEnumValue
                    variableID={props.variableID}
                    enumValues={svEnum}
                    dataCallback={SaveChanges}
                />
            </div>
            <div>

            </div>
        </div>
    )
}

interface ServerVariablesEnumValueProps {
    variableID: string,
    enumValues: string[]
    dataCallback: (source: string, dataJson: string) => void
}
function ServerVariablesEnumValue(props: ServerVariablesEnumValueProps) {
    const [keyRegistry, setKeyRegistry] = useState<{ [key: string]: string }>({})
    const [serialNumber, setSerialNumber] = useState(0)

    useEffect(() => {
        // Generate react Keys
        if (props.enumValues.length === 0) return
        const temp = { ...keyRegistry } as { [key: string]: string }
        for (let i = 0; i < props.enumValues.length; i++) {
            temp[props.enumValues[i]] = props.variableID + "_serial-number_" + serialNumber.toString()
            setSerialNumber(serialNumber + 1)
        }
        setKeyRegistry(temp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const InputHandler = (fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
        for (const key in keyRegistry) {
            if (key === event.target.value) {
                alert("You are about to create a duplicate value! Try something else.")
                return
            }
        }

        const enumValuesCopy = [...props.enumValues]
        const keyRegistryCopy = { ...keyRegistry }
        const newValue = event.target.value
        let oldValue: string = ""
        // Find the old value
        for (const key in keyRegistry) {
            if (keyRegistry[key] === fieldKey) {
                oldValue = key
                break
            }
        }
        // Replace old value with new value
        for (let i = 0; i < enumValuesCopy.length; i++) {
            if (enumValuesCopy[i] === oldValue) {
                enumValuesCopy[i] = newValue
            }
        }
        // Update registry with new value
        const temp = {} as { [key: string]: string }
        for (const key in keyRegistryCopy) {
            if (key === oldValue) {
                temp[newValue] = keyRegistryCopy[oldValue]
            }
            else {
                temp[key] = keyRegistryCopy[key]
            }
        }
        // Save all changes
        setKeyRegistry(temp)
        props.dataCallback(
            "enum",
            JSON.stringify(
                {
                    enum: enumValuesCopy
                }
            )
        )

    }

    const DeleteField = (value: string) => {

        // Remove key from registry
        const keyRegistryCopy: { [key: string]: string } = {}
        for (const key in keyRegistry) {
            if (key === value) continue
            keyRegistryCopy[key] = keyRegistry[key]
        }
        setKeyRegistry(keyRegistryCopy)


        // Update app state
        const enumValuesCopy = []
        let index = 0
        for (let i = 0; i < props.enumValues.length; i++) {
            if (props.enumValues[i] === value) {
                continue
            }
            enumValuesCopy[index] = props.enumValues[i]
            index++
        }
        props.dataCallback(
            "enum",
            JSON.stringify(
                {
                    enum: enumValuesCopy
                }
            )
        )
    }

    const displayVals: JSX.Element[] = []
    for (const key in keyRegistry) {
        displayVals.push(
            <div className="flex flex-row space-x-2 items-center w-full" key={keyRegistry[key]}>
                <div className="w-full">
                    <input type="text" key={keyRegistry[key]} value={key} onChange={(e) => InputHandler(keyRegistry[key], e)} className="input input-bordered  w-full" />
                </div>
                <div>
                    <button className="btn" onClick={() => DeleteField(key)}>
                        <Image
                            src="/icons/trash.png"
                            width={20}
                            height={20}
                            alt="delete button"
                        />
                    </button>
                </div>
            </div>
        )
    }



    const CreateNewField = () => {
        const DefaultValue = "Default Value " + serialNumber.toString()
        const keyRegistryCopy = { ...keyRegistry }
        keyRegistryCopy[DefaultValue] = props.variableID + "_enum_serial-number_" + serialNumber.toString()
        setSerialNumber(serialNumber + 1)
        setKeyRegistry(keyRegistryCopy)
        const enumValuesCopy = [...props.enumValues]
        enumValuesCopy.push(
            DefaultValue
        )
        props.dataCallback(
            "enum",
            JSON.stringify(
                {
                    enum: enumValuesCopy
                }
            )
        )

    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1">
                {displayVals}
            </div>
            <div className="flex justify-end">
                <button className="btn" onClick={CreateNewField}>New Value</button>
            </div>
        </div>
    )
}

export { ServersContainer }