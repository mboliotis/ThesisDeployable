"use client"
import Link from "next/link";
export default function Home() {

  return (

    <div className="flex flex-row w-full bg-slate-500 ">
      <div className="card  h-screen rounded-box grid  flex-grow place-items-center">
        <a href="/home" className="btn">File</a>
      </div>
      <div className="divider divider-horizontal text-white">OR</div>
      <div className=" grid  flex-grow place-items-center">
        <a href="/manually" className="btn">Manually</a>
      </div>
    </div>
  );
}



