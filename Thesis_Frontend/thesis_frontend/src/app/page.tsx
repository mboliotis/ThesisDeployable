"use client"
import Link from "next/link";
export default function Home() {

  return (
    
    <div className="flex w-full ">
      <div className="card  h-screen rounded-box grid  flex-grow place-items-center">
        <Link href="/home" className="btn btn-primary">Asyncapi</Link> 
      </div>
      <div className="divider divider-horizontal text-white">OR</div>
      <div className=" grid  flex-grow place-items-center">
        <button className="btn btn-primary" onClick={OnOpenapiButton}>Openapi</button>
      </div>
    </div>
  );
}


function OnOpenapiButton(){
  alert("Not ready yet!")
}

