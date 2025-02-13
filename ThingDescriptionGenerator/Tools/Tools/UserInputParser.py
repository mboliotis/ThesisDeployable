import traceback
"""
    This class is responsible for extracting and processing the objects of the user input.
    The input must follow the format of the: UserInputSchema.json.
    
"""
class UserInputParser:
    """
        Params:
            theInput: A dictionary representing the user input.
    """
    def __init__(self, theInput):
        self.user_input = theInput
        self.defaultServer = self.user_input["servers"][0]["name"]
        self.serverToChannelMap = {"webthing_resource_channel":[],
                                   "properties_resource_channel":[],
                                   "actions_resource_channel":[]
                                   }
        self.asyncapi_output = {"asyncapi":"3.0.0",
                                "info":{},
                                "servers":{},
                                "channels":{},
                                "operations":{},
                                "components":{}
                                }

    """ Check if the user input is set and ready for processing. """
    def inputIsSet(self):
        return isinstance(self.user_input, dict)
    
    def validateAndExtract(self):
        if not self.inputIsSet():
            return False
        
        isValid = True
        try:
            if "info" not in self.user_input:
                return False
            self.asyncapi_output["info"] = self.user_input["info"]
            if "servers" not in self.user_input:
                return False
            self.asyncapi_output["servers"] = self.extractServers(self.user_input["servers"])

            # Generate the channels
            if "web_thing_state" in self.user_input:
                self.channelGenerator("properties_resource_channel", self.user_input["web_thing_state"])

            if "web_thing_actions" in self.user_input:
                self.channelGenerator("actions_resource_channel", self.user_input["web_thing_actions"])

            if "web_thing_resource" in self.user_input:
                self.channelGenerator("webthing_resource_channel", self.user_input["web_thing_resource"]) 
            
            # Generate the operations
            if "web_thing_state" in self.user_input:
                self.operationGenerator("properties_resource_operation", self.user_input["web_thing_state"])

            if "web_thing_actions" in self.user_input:
                self.operationGenerator("actions_resource_operation", self.user_input["web_thing_actions"])

            if "web_thing_resource" in self.user_input:
                self.operationGenerator("webthing_resource_operation", self.user_input["web_thing_resource"]) 


            if "defaultContentType" in self.user_input:
                self.asyncapi_output["defaultContentType"] = self.user_input["defaultContentType"]

            if "id" in self.user_input:
                self.asyncapi_output["id"] = self.user_input["id"]

            if "externalDocs" in self.user_input:
                self.asyncapi_output["components"]["externalDocs"] = {"externalDocs": self.user_input["externalDocs"]}
            
            if "tags" in self.user_input:
                self.asyncapi_output["components"]["tags"] = self.extractTags(self.user_input["tags"])

            if "messagesSchemas" in self.user_input:
                self.ExtractMessagesSchemas()

            if "components" in self.user_input:
                self.extractNonMandatoryComponents()
                
        except Exception as e:
            isValid = False
            print(e)
            traceback.print_exc()
        
        return isValid

    def inComponents(self, field_name):
        if field_name in self.asyncapi_output["components"]:
            return True
        return False

    """
        This function will generate the operation based on the available channels.
        @params:
            opType:String -> One of the three tyes of channels.
            opData:String_Array -> Every entry in this array will generate a message for the defined channel.

    """
    def operationGenerator(self, opType, opData):
        self.asyncapi_output["operations"][opType] = {
            "messages":[]
        }

        if opType == "webthing_resource_operation" or opType ==  "properties_resource_operation":
            self.asyncapi_output["operations"][opType]["action"] = "send"
        else:
            self.asyncapi_output["operations"][opType]["action"] = "receive"
        
        if opType == "webthing_resource_operation":
            self.asyncapi_output["operations"][opType]["channel"] = {
                "$ref":"#/channels/webthing_resource_channel"
            }
            for data in opData:
                self.asyncapi_output["operations"][opType]["messages"].append(
                    {"$ref":"#/channels/webthing_resource_channel/messages/"+data}
                )

        elif opType == "properties_resource_operation":
            self.asyncapi_output["operations"][opType]["channel"] = {
                "$ref":"#/channels/properties_resource_channel"
            }
            for data in opData:
                self.asyncapi_output["operations"][opType]["messages"].append(
                    {"$ref":"#/channels/properties_resource_channel/messages/"+data}
                )
        else:
            self.asyncapi_output["operations"][opType]["channel"] = {
                "$ref":"#/channels/actions_resource_channel"
            }
            for data in opData:
                self.asyncapi_output["operations"][opType]["messages"].append(
                    {"$ref":"#/channels/actions_resource_channel/messages/"+data}
                )
        

    """
        This function will generate either of the following channels: webthing_resource_channel, properties_resource_channel, actions_resource_channel.
        @params:
            channelType:String -> One of the three tyes of channels.
            channelData:String_Array -> Every entry in this array will generate a message for the defined channel.
    """
    def channelGenerator(self, channelType, channelData):
        self.asyncapi_output["channels"][channelType] = {
                "messages":{},
                "servers":[]
            }
        # Create the servers object of the channel
        for server in self.serverToChannelMap[channelType]:
            self.asyncapi_output["channels"][channelType]["servers"].append(
                {
                    "$ref":"#/servers/"+server
                }
            )

        # check if messages in components
        if not self.inComponents("messages"):
            self.asyncapi_output["components"]["messages"] = {}
        
        # Add the messages in to the components field
        for msg in channelData:
                msgObj = {
                    "headers":{},
                    "payload":{
                        "description":"Read a value from the web thing.",
                        "type":"string"
                    }
                }
                self.asyncapi_output["components"]["messages"][msg] = msgObj
                self.asyncapi_output["channels"][channelType]["messages"][msg] = {
                    "$ref":"#/components/messages/"+msg
                }



    def extractTags(self, tagsArray):
        
        tags = {}
        for item in tagsArray:
            tagID = item["name"]
            tags[tagID] = item
        
        return tags

    def ExtractMessagesSchemas(self):

        availableChannels = [
            "webthing_resource_channel", 
            "properties_resource_channel", 
            "actions_resource_channel"
        ]

        if "messagesSchemas" in self.user_input:
            for value in self.user_input['messagesSchemas']:
                if value["channelID"] in availableChannels:
                    headersID = value['messageID']+'_headers'
                    payloadID = value['messageID']+'_payload'
                    self.AppendSchema(headersID, value['headers'])
                    self.AppendSchema(payloadID, value['payload'])
                    headerPath ='#/components/schemas/'+headersID
                    payloadPath ='#/components/schemas/'+payloadID


                    messageID = value['messageID']
                    channelID = value['channelID']
                    if messageID in self.asyncapi_output['components']['messages']:# Message already exists.
                        self.asyncapi_output['components']['messages'][messageID]['headers'] = {"$ref":headerPath}
                        self.asyncapi_output['components']['messages'][messageID]['payload'] = {"$ref":payloadPath}
                    else:# Message does not exist.
                        messagePath = '#/components/messages/'+messageID
                        self.asyncapi_output['components']['messages'][messageID] ={
                            "headers":{"$ref":headerPath},
                            "payload":{"$ref":payloadPath}
                        }
                        if channelID in self.asyncapi_output['channels']:
                            self.asyncapi_output['channels'][channelID]['messages'][messageID] = {"$ref":messagePath}
                        else:
                            self.asyncapi_output['channels'][channelID] = {}
                            self.asyncapi_output['channels'][channelID]['messages'][messageID] = {"$ref":messagePath}
    
    def AppendSchema(self, schemaID, schemaObj):
        if 'schemas' not in self.asyncapi_output['components']:
            self.asyncapi_output['components']['schemas'] = {}
        
        self.asyncapi_output['components']['schemas'][schemaID] = schemaObj
    
    def extractNonMandatoryComponents(self):
        nonMandatoryComponents = [
            "securitySchemes",
            "serverVariables",
            "parameters",
            "correlationIds",
            "replies",
            "replyAddresses",
            "operationTraits",
            "messageTraits",
            "serverBindings",
            "channelBindings",
            "operationBindings",
            "messageBindings"
        ]

        for field in nonMandatoryComponents:
            if field in self.user_input["components"]:
                if field in self.asyncapi_output['components']:
                    # if the field already exist append
                    self.asyncapi_output['components'][field].update(self.user_input[field])
                else:
                    # field does not exist, it's created
                    self.asyncapi_output['components'][field] = self.user_input[field]

    """
        Returns:
            Servers Object as defined in asyncapi specification version: 3.0.0
    """
    def extractServers(self, serversArray):
        servs = {}
        for item in serversArray:
            if "name" not in item:
                continue
            if "host" not in item:
                continue
            if "protocol" not in item:
                continue
            server_id = item["name"]
            server_host = item["host"]
            server_protocol = item["protocol"]
            if "for" in item:
                if item["for"] == "webthing_resource_channel_&_properties_resource_channel":
                    self.serverToChannelMap["webthing_resource_channel"].append(item["name"])
                    self.serverToChannelMap["properties_resource_channel"].append(item["name"])
                elif item["for"] == "webthing_resource_channel_&_actions_resource_channel":
                    self.serverToChannelMap["webthing_resource_channel"].append(item["name"])
                    self.serverToChannelMap["actions_resource_channel"].append(item["name"])
                elif item["for"] == "properties_resource_channel_&_actions_resource_channel":
                    self.serverToChannelMap["properties_resource_channel"].append(item["name"])
                    self.serverToChannelMap["actions_resource_channel"].append(item["name"])
                elif item["for"] ==  "all":
                    self.serverToChannelMap["properties_resource_channel"].append(item["name"])
                    self.serverToChannelMap["actions_resource_channel"].append(item["name"])
                    self.serverToChannelMap["webthing_resource_channel"].append(item["name"])
                else:
                    self.serverToChannelMap[item["for"]].append(item["name"])
            
            if "pathname" in item:
                server_pathname = item["pathname"]
            else:
                server_pathname = ""
            
            if "description" in item:
                server_description = item["description"]
            else:
                server_description = ""
            
            if "title" in item:
                server_title = item["title"]
            else:
                server_title = ""
            if "summary" in item:
                server_summary = item["summary"]
            else:
                server_summary = ""

            if "variables" in item:
                server_variables = item["variables"]
            else:
                server_variables = {}
            
            server_security = []
            if "bindings" in item:
                server_bindings = item["bindings"]
            else:
                server_bindings = {}

            # Extract Security schemas
            if "serverSecuritySchemas" in self.user_input and "security" in item:
                for security_schema in item["security"]:
                    for element in self.user_input["serverSecuritySchemas"]:
                        if element["type"] == security_schema:
                            server_security.append(element)
            
            servs[server_id] = {
                "host":server_host,
                "protocol":server_protocol,
                "pathname":server_pathname,
                "description":server_description,
                "title":server_title,
                "summary":server_summary,
                "variables":server_variables,
                "security": server_security,
                "bindings":server_bindings
            }
        
        return servs
    

    """
        Returns:
            A dictionary with the structure of the ASYNCAPI object as defined in specification 3.0.0
    """
    def convert2Asyncapi(self):
        if self.validateAndExtract() :
            return self.asyncapi_output
        else:
            return {}