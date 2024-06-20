import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ClassList() {
  const [classData, setclassData] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    getclassData();
  }, []);

  function getclassData(){
    axios.get('http://localhost/timetofill/class.php').then(function(response){
        setclassData(response.data);
  });
  }
  
  function getStatus(valid_to) {
    const today = new Date();
    const validToDate = new Date(valid_to);
    return validToDate >= today ? "Active" : "Non Active";
  }

  return (
    <>
      <div>
      <NavBar />
      <div className="flex items-center justify-between w-screen px-20 my-10">
          <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest"> List Class</p>
          <div className="w-80 flex items-center gap-x-4 py-1 justify-end">
            <button onClick={() => {navigate('/users')}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
            <button className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Upload Class</button>
          </div>
      </div>
      <div className="flex items-center w-screen px-20 ">
        <table className="w-full align-middle table-auto tracking-widest text-center">
          <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
            <tr>
              <th scope="col" className="w-12" >#</th>
              <th scope="col" >Class</th>
              <th scope="col" >Category</th>
              <th scope="col" >Semester</th>
              <th scope="col" >Status</th>
              <th scope="col" >Action</th>
            </tr>
          </thead>
          <tbody className="align-middle text-blue-900 font-normal">
            {
              classData.map((classData, index) =>(
              <tr className="border border-y-slate-600" key={index}>
                <td>{index+1}</td>
                <td>{classData.class}</td>
                <td>{classData.category}</td>
                <td>{classData.semester}</td>
                <td>{getStatus(classData.valid_to)}</td>
                <td>
                  <Link to={`/class/${classData.class_id}/edit`} style={{ marginRight: "10px" }}>Edit</Link>
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