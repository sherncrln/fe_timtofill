import React from "react";
import Logo from "../assets/timetofill.png";
import Logout from "../assets/logout.png";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  function logoutSubmit(){
     localStorage.setItem("login", "");
     localStorage.setItem("loginStatus", "Logged out successfully!");
     navigate("/");
  }

  //TESTING git
  return (
    <div className="flex justify-between h-16 w-screen bg-[#577BC1]">
      <div className="flex items-center py-1 ml-8 justify-start">
        <img className="size-14" src={Logo} alt="TimeToFill Logo" />
        <p className="text-[#F2F7FF] text-2xl tracking-widest ml-4">TimeToFilliiii</p>
      </div>
      <div className="hidden lg:flex items-center gap-x-4 py-1 mr-8 justify-end">
        <Link to="/home" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-300 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Home</Link>
        <Link to="/response" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-300 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Response</Link>
        <Link to="/users" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-300 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Users</Link>
        <Link to="/profile" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-300 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">
          {/* {user && <p className="text-sm align-middle text-center rounded">{user.name}</p>} */}
          {user}
        </Link>
        <button onClick={logoutSubmit}>
          <img className="size-8" src={Logout} alt="Logout" />
        </button>
      </div>
    </div>
  );
}