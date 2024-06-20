import {useEffect, useState} from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function UsersList() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    getUserData();
  }, []);

  function getUserData(){
    axios.get('http://localhost/timetofill/users.php').then(function(response){
        setUserData(response.data);
    });
    
}

  return (
    <>
      <div>
      <NavBar />
      <div className="flex items-center justify-between w-screen px-20 my-10">
          <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest"> List User</p>
          <div className="w-80 flex items-center gap-x-4 py-1 justify-end">
            <button onClick={() => {navigate('/class')}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Class</button>
            <button className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Upload User</button>
          </div>
      </div>
      <div className="flex items-center w-screen px-20 ">
        <table className="w-full align-middle table-auto tracking-widest text-center">
          <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
            <tr>
              <th scope="col" className="w-12" >#</th>
              <th scope="col" >Username</th>
              <th scope="col" >Name</th>
              <th scope="col" >Category</th>
              <th scope="col" >Class</th>
              <th scope="col" >Status</th>
              <th scope="col" >Action</th>
            </tr>
          </thead>
          <tbody className="align-middle text-blue-900 font-normal">
            {
              userData.map((userData, index) =>(
              <tr className="border border-y-slate-600" key={index}>
                <td>{index+1}</td>
                <td>{userData.username}</td>
                <td>{userData.name}</td>
                <td>{userData.category}</td>
                <td>{userData.class}</td>
                <td>{userData.status_user}</td>
                <td>
                  <Link to={`./${userData.user_id}/edit`} style={{marginRight: "10px"}}>Edit</Link>
                </td>
              </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}