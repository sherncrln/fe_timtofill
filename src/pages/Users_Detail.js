import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

export default function UsersDetail() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const navigate = useNavigate();


  return (
    <>
      <div>
        <NavBar />
        <p className="text-5xl text-blue-800 text-center tracking-widest mt-14 mb-6">Profile</p>
        <div className="flex items-center justify-center">
          <form>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Username
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="username"
                    name="username"
                    placeholder=""
                    value={logged_data['username']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Name
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="name"
                    name="name"
                    placeholder=""
                    value={logged_data['name']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Category
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="category"
                    name="category"
                    placeholder=""
                    value={logged_data['category']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Class
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="class"
                    name="class"
                    placeholder=""
                    value={logged_data['class']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Email
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="email"
                    name="email"
                    placeholder=""
                    value={logged_data['email']}
                />
            </div>
            <div className= "w-80 mb-6">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Password
                </label>
                <input
                    type="password"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="password"
                    name="password"
                    placeholder=""
                    value={logged_data['password']}
                />
            </div>
            <div className= " mb-2 px-4 tracking-widest text-[#f8fafc]">
                <button className="w-32 h-8 rounded bg-[#577BC1] mr-6 ">Save</button>
                <button  className="w-32 h-8 rounded bg-[#577BC1] ">Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}