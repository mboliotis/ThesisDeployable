"use client"

import React, { useState } from "react"
import DisplayUserInput from "@/app/components/displayData"

export default function UserInput() {
    const [userInput, setUserInput] = useState<File | null>(null)
    const [navigateNext, setNavigateNext] = useState<boolean>(false)


    /**
     *  This handler will set the state variable so it will allow to render the next page.
     */
    const NextHandler = () => {
        if (userInput !== null) {
            setNavigateNext(true);
        }

    }

    /**
     * This handler check if the input is a json file. If it is it will be saved in the state variable.
     */
    const InputChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            if (event.target.files[0].type === "application/json") {

                setUserInput(event.target.files[0]) // Set state variable
            }
            else {
                // reset state
                setUserInput(null)
                alert("Wrong File Type!")
            }
        }

    }

    // Default value is to prompt for file input
    let content =
        <div className="flex justify-center  h-screen w-full place-items-center bg-slate-500 ">
            <div className="join">
                <input type="file" accept=".json" onChange={InputChangeHandler} className="file-input file-input-ghost file-input-bordered join-item w-full max-w-screen-sm bg-white" />
                <button className="join-item btn" onClick={NextHandler}>Next</button>
            </div>
        </div>

    // When the file is given we display the data
    if (navigateNext) {
        if (userInput !== null) {
            content = <DisplayUserInput userInput={userInput} />
        }

    }
    return (content)
}



