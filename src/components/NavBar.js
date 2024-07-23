import React from "react";
import Logo from "../assets/timetofill.png";
import Logout from "../assets/logout.png";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const logged_data = JSON.parse(localStorage.getItem("logged_data"));
  

  function logoutSubmit(){
     localStorage.setItem("login", "");
     localStorage.setItem("logged_data", "");
     localStorage.setItem("loginStatus", "Logged out successfully!");
     navigate("/");
  }

  //TESTING git
  return (
//     <div className="flex justify-between h-16 w-full bg-[#577BC1] px-8">
//       <div className="flex items-center py-1 justify-start">
//         <img className="size-14" src={Logo} alt="TimeToFill Logo" />
//         <p className="text-[#F2F7FF] text-2xl tracking-widest ml-4">TimeToFill</p>
//       </div>
//       <div className="hidden lg:flex items-center gap-x-4 py-1 justify-end">
//         <Link to="/home" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Home</Link>
//         {logged_data && logged_data['category'] === "Admin" ? (
//           <>
//             <Link to="/response" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Response</Link>
//             <Link to="/users" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Users</Link>
//           </>
//         ): null}
//         <Link to={`/profile/${logged_data.user_id}`} className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Profile</Link>
//         <button onClick={logoutSubmit}>
//           <img className="size-8" src={Logout} alt="Logout" />
//         </button>
//       </div>
//     </div>
    <div className="flex justify-between h-16 w-screen bg-[#577BC1]">
      <div className="flex items-center py-1 ml-8 justify-start">
        <img className="size-14" src={Logo} alt="TimeToFill Logo" />
        <p className="text-[#F2F7FF] text-2xl tracking-widest ml-4">TimeToFill</p>
      </div>
      <div className="hidden lg:flex items-center gap-x-4 py-1 justify-end">
        <Link to="/home" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Home</Link>
        {logged_data && logged_data['category'] === "Admin" ? (
          <>
            <Link to="/response" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Response</Link>
            <Link to="/users" className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Users</Link>
          </>
        ): null}
        <Link to={`/profile/${logged_data.user_id}`} className="w-28 h-8 py-2 text-sm align-middle text-center rounded hover:bg-blue-100 text-[#f8fafc] tracking-widest hover:bg-blue-700 hover:text-indigo-950">Profile</Link>
        <button onClick={logoutSubmit}>
          <img className="size-8" src={Logout} alt="Logout" />
        </button>
      </div>
    </div>
  );
}