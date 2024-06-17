import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Users() {

  return (
    <>
      <div>
      <NavBar />
      <div className="flex items-center justify-between w-screen px-20 my-10">
          <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest"> List User</p>
          <div className="w-80 flex items-center gap-x-4 py-1 justify-end">
            <button className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Class</button>
            <button className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Upload User</button>
          </div>
      </div>
      </div>
    </>
  );
}