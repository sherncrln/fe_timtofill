import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FormList from "./FormList";

export default function Home() {
  const logged_data = JSON.parse(localStorage.getItem("logged_data"));
  const navigate = useNavigate();

  return (
    <>
      <div className="w-screen">
        <NavBar />
        <div className="px-16">
          {logged_data ? ( 
            logged_data['category'] === "Admin" ?(
            <>
              <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest mt-14 mb-6"> Craft your dream website effortlessly! Build your online presence with our intuitive form builder - no coding required. </p>
              <button onClick={() => {navigate('/form')}} className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-[#f8fafc]">Add Form</button>
            </>
            ): logged_data['category'] === "Dosen" ? (
            <>
              <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest mt-14 mb-6"> It’s time to fill the form!</p>
              <button onClick={() => {navigate('/history')}} className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-[#f8fafc] mr-4">History</button>
              <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-[#f8fafc]">EDOM Result</button>
            </>
            ): logged_data['category'] === "Mahasiswa" || logged_data['category'] === "Staff" ? (
            <>
              <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest mt-14 mb-6"> It’s time to fill the form!</p>
              <button onClick={() => {navigate('/history')}} className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-[#f8fafc]">History</button>
            </>
            ): null
          ): null}
          <div className="w-full">
            <FormList />
          </div>
        </div>
      </div>
    </>
  );
}