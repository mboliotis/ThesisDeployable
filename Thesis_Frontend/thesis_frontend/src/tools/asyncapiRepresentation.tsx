class AsyncapiObject{

    asyncapi:string|null;
    id:string|null;
    info:Info|null;
    servers:Map<string, Server|ReferenceObject>;
    channels:Map<string, Channel|ReferenceObject>;
    operations:Map<string, Operation|ReferenceObject>;
    defaultContentType:string|null;
    components:Components|null;

    constructor(asyncVersion:string|null, id:string|null, info:Info|null, defaultContentType:string|null, components:Components|null){
        this.asyncapi = asyncVersion;
        this.id = id;
        this.info = info
        this.servers = new Map<string, Server|ReferenceObject>;
        this.channels = new Map<string, Channel|ReferenceObject>;
        this.operations = new Map<string, Operation|ReferenceObject>;
        this.defaultContentType = defaultContentType;
        this.components = components;
    }

    

    public AppendServer(serverID:string, serverObject:Server|ReferenceObject):void{
        this.servers.set(serverID, serverObject);
    }

    public AppendChannel(channelID:string, channelObject:Channel|ReferenceObject):void{
        this.channels.set(channelID, channelObject);
    }

    public AppendOperation(operationID:string, operationObject:Operation|ReferenceObject):void{
        this.operations.set(operationID, operationObject);
    }


    public ToObject():any{
        return {
            "asyncapi":this.asyncapi, 
            "id":this.id,
            "info":this.info,
            "servers": this.servers,
            "channels":this.channels,
            "operations":this.operations,
            "defaultContentType":this.defaultContentType,
            "components":this.components
        }
    }
}

class Info{
    title:string|null;
    version:string|null;
    description:string|null;
    termsOfService:string|null;
    tags:Tag[];
    externalDocs:ExternalDocs|ReferenceObject|null;

    constructor(title:string|null, version:string|null, description:string|null, 
        termsOfService:string|null, externalDocs:ExternalDocs|null){
            
        this.title = title;
        this.version = version;
        this.description = description;
        this.termsOfService = termsOfService;
        this.tags = [];
        this.externalDocs = externalDocs;
    }

    public AppendTag(newTag:Tag):void {
        this.tags.push(newTag);
    }
}

class Server{
    host:string;
    protocol:string;
    protocolVersion:string|null;
    pathname:string|null;
    description:string|null;
    title:string|null;
    summary:string|null;
    tags:Tag[];
    externalDocs:ExternalDocs|ReferenceObject|null;

    constructor(host:string, protocol:string, protocolVersion:string|null, pathname:string|null,
        description:string|null, title:string|null, summary:string|null, externalDocs:ExternalDocs|ReferenceObject|null){

            this.host = host;
            this.protocol = protocol;
            this.protocolVersion = protocolVersion;
            this.pathname = pathname;
            this.description = description;
            this.title = title;
            this.summary = summary;
            this.externalDocs = externalDocs;
            this.tags = [];
    }

    public AppendTag(newTag:Tag):void {
        this.tags.push(newTag);
    }
}

class Channel{
    address:string|null;
    title:string|null;
    summary:string|null;
    description:string|null;
    servers:ReferenceObject[];
    tags:Tag[]
    messages: Map<string, Message|ReferenceObject>;
    externalDocs:ExternalDocs|ReferenceObject|null;

    constructor(address:string|null, title:string|null, summary:string|null, description:string|null, externalDocs:ExternalDocs|ReferenceObject|null){
        this.tags = [];
        this.servers = [];
        this.address = address;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.externalDocs = externalDocs;
        this.messages = new Map<string, Message|ReferenceObject>();
    }

    public AppendTag(newTag:Tag):void {
        this.tags.push(newTag);
    }

    public AppendServer(newServer:ReferenceObject):void {
        this.servers.push(newServer);
    }

    public AppendMessage(messageID:string, messageObject:Message|ReferenceObject){
        this.messages.set(messageID, messageObject);
    }
}

class Message{
    headers:any;
    payload:any;
    contentType:string|null;
    name:string|null;
    title:string|null;
    tags:Tag[];
    externalDocs:ExternalDocs|ReferenceObject|null;

    constructor(headers:any, payload:any, contentType:string|null, name:string|null, title:string|null, externalDocs:ExternalDocs|ReferenceObject|null){
        this.tags = [];
        this.headers = headers;
        this.payload = payload;
        this.contentType = contentType;
        this.name = name;
        this.title = title;
        this.externalDocs = externalDocs;
    }
}

enum Actions{
    sendAction = "send",
    receiveAction = "receive"
}

class Operation{
    action:Actions;
    channel:ReferenceObject;
    title:string|null
    summary:string|null
    description:string|null
    tags:Tag[];
    externalDocs:ExternalDocs|ReferenceObject|null;

    constructor(action:Actions, channel:ReferenceObject, title:string|null, summary:string|null,description:string|null,
        externalDocs:ExternalDocs|ReferenceObject|null){
        this.tags = [];

        this.action = action;
        this.channel = channel;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.externalDocs = externalDocs;
    }

    public AppendTag(newTag:Tag):void {
        this.tags.push(newTag);
    }
}

class ReferenceObject{
    $ref:string;

    constructor(infilePath:string){
        this.$ref = infilePath;
    }
}


class Tag{
    name:string|null;
    description:string|null;
    externalDocs:ExternalDocs|null;

    constructor(name:string|null, description:string|null, externalDocs:ExternalDocs|null){
        this.name = name;
        this.description = description;
        this.externalDocs = externalDocs;
    }
}

class ExternalDocs{
    description:string|null;
    url:string|null;

    constructor(descr:string|null, url:string|null){
        this.description = descr;
        this.url = url;
    }
}


class Components{
    schemas:Map<string, any>;
    servers:Map<string, Server>;
    channels:Map<string, Channel|ReferenceObject>;
    operations:Map<string, Operation|ReferenceObject>;
    messages:Map<string, Message|ReferenceObject>;
    externalDocs:Map<string, ExternalDocs|ReferenceObject>;
    tags:Map<string, Tag|ReferenceObject>;

    constructor(){
        this.schemas = new Map<string, any>();
        this.servers = new Map<string, Server>();
        this.externalDocs = new Map<string, ExternalDocs|ReferenceObject>();
        this.tags = new Map<string, Tag|ReferenceObject>();
        this.channels = new Map<string, Channel|ReferenceObject>();
        this.operations = new Map<string, Operation|ReferenceObject>();
        this.messages = new Map<string, Message|ReferenceObject>();
    }

    public AppendChannel(channelID:string, channelObj:Channel|ReferenceObject){
        this.channels.set(channelID, channelObj);
    }

    public AppendOperation(operationID:string, operationObj:Operation|ReferenceObject){
        this.operations.set(operationID, operationObj);
    }

    public AppendMessage(messageID:string, messageObj:Message|ReferenceObject){
        this.messages.set(messageID, messageObj);
    }

    public AppendSchema(schemaID:string, schemaObject:any):void{
        this.schemas.set(schemaID, schemaObject);
    }

    public AppendServer(serverID:string, serverObject:Server):void{
        this.servers.set(serverID, serverObject);
    }

    public AppendExternalDocs(externalDocsID:string, externalDocsObj:ExternalDocs|ReferenceObject):void{
        this.externalDocs.set(externalDocsID, externalDocsObj);
    }

    public AppendTag(tagID:string, tagObject:Tag|ReferenceObject):void{
        this.tags.set(tagID, tagObject);
    }
}


export {AsyncapiObject, Info, Server, Message, Channel, Operation, Actions, ReferenceObject, Tag, ExternalDocs, Components}