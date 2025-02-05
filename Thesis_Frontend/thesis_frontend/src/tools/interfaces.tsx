import { Dispatch, SetStateAction} from "react"
interface AsyncAPI_info_license {
    name: string,
    url?: string
}
interface AsyncAPI_info_contact {
    name?: string,
    url?: string,
    email?: string
}

interface IServerVariable {
    enum?: string[],
    default?: string,
    description?: string,
    examples?: string[]
}
interface IServerVariables {
    [key: string]: IServerVariable
}
interface AsyncAPI_server {
    host: string,
    protocol: string,
    protocolVersion?: string,
    pathname?: string,
    description?: string,
    title?: string,
    summary?: string,
    variables?: IServerVariables
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


export type {AsyncAPI_info_license, AsyncAPI_info_contact, IServerVariable, IServerVariables, AsyncAPI_server, AsyncAPI_info, Servers, ApplicationData, ApplicationDataProps}