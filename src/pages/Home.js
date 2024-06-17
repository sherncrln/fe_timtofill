import React from "react";
// import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {


  return (
    <>
      <div className="">
        <NavBar />
        <div className="px-16">
          <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest mt-14 mb-6">It’s time to fill the form! </p>
          <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-[#f8fafc]">History</button>
          <div className="w-full">

          </div>
        </div>
      </div>
    </>
  );
}