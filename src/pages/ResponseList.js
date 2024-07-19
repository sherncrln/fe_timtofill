import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";


export default function ResponseList() {
  const [responseList, setResponseList] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    getResponseList();
  }, []);

  function getResponseList(){
    axios.get('http://localhost/timetofill/form.php').then(function(response){
        setResponseList(response.data);
  });
  }

  return (
    <>
      <div>
      <NavBar />
      <div className="flex-row">        
        <div className="flex items-center px-20 my-10">
            <p className="w-full text-3xl text-blue-800 font-semibold tracking-widest"> List Form Response</p>
            {/* <div className=" w-2/3 flex justify-end items-center gap-x-4 py-1 justify-end">
              <button onClick={() => {navigate('/home')}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
            </div> */}
        </div>
        <div className="flex items-center w-screen px-20 ">
          <table className="w-full align-middle table-auto tracking-widest text-center">
            <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
              <tr>
                <th scope="col" className="w-1/12" >#</th>
                <th scope="col" className="w-8/12 text-left" >Class</th>
                <th scope="col" className="w-3/12" >Action</th>
              </tr>
            </thead>
            <tbody className="align-middle text-blue-900 font-normal">
              {
                responseList.map((responseList, index) =>(
                <tr className="border border-y-slate-600 h-10" key={index}>
                  <td>{index+1}</td>
                  <td className="text-left" >{responseList.name_form}</td>
                  <td>
                    <Link to={`/response/${responseList.form_id}/edit`} style={{ marginRight: "10px" }}>Open</Link>
                  </td>
                </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}