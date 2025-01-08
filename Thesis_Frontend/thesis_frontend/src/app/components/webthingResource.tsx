
interface WebthingResourceProps {
    appData: any,
    setAppData: any
}
export default function WebthingResource({ appData, setAppData }: WebthingResourceProps) {

    let web_thing_resource = []

    for (let i = 0; i < appData["web_thing_resource"].length; i++) {
        web_thing_resource.push(
            <input key={"web_thing_resource"+"__"+appData["web_thing_resource"][i]} type="text" value={appData["web_thing_resource"][i]} readOnly className="input border-2 border-black w-full " />
        )
    }

    return (
        <div>
            <h1>Webthing Resource:</h1>
            <div className="flex flex-col w-full border-2 border-black rounded-md space-y-2 p-2">
                {web_thing_resource}
            </div>
        </div>

    )
}