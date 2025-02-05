import { ApplicationDataProps } from "@/tools/interfaces"
import { isEmpty } from "@/tools/usefulFunctions"
import { Dispatch, SetStateAction, useState } from "react"

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


export {InfoContainer}