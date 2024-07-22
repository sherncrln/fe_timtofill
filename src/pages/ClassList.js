import {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ClassList() {
  const [classData, setclassData] = useState([]);
  const [mode, setMode] = useState('add');
  const [file, setFile] = useState(null);
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

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  function handleUpload() {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    console.log("Uploading file: ", file);
    console.log("Mode: ", mode);

    axios.post('http://localhost/timetofill/class_upload.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function(response){
      if (response.data.status === 1) {
        getclassData();
        alert(response.data.message);
      } else {
        alert(response.data.message);
        console.log(response.data);
      }
    }).catch(function(error){
      console.log("Error during file upload: ", error);
      alert('Failed to upload file.');
    });
  }


  return (
    <>
      <div>
      <NavBar />
      <div className="flex-row">        
        <div className="flex items-center px-20 my-10">
            <p className="w-1/3 text-3xl text-blue-800 font-semibold tracking-widest"> List Class</p>
            <div className=" w-2/3 flex justify-end items-center gap-x-4 py-1 justify-end">
              <div className="flex-row">
                <input className="text-blue-900 bg-transparent " type="file" onChange={handleFileChange} />
                <select  value={mode} onChange={(e) => setMode(e.target.value)}
                  className="px-2 mx-2 text-blue-900 bg-transparent " >
                  <option selected="selected" value="add">Add</option>
                  <option value="edit">Edit</option>
                </select>
                <button onClick={handleUpload} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Upload Class</button>
              </div>
              <button onClick={() => {navigate('/users')}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
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
                <tr className="border border-y-slate-600 h-8" key={index}>
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
      </div>
    </>
  );
}