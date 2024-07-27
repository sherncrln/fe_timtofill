import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function UsersList() {
  const [userData, setUserData] = useState([]);
  const [mode, setMode] = useState('add');
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const itemsPerPage = 15; // Jumlah data per halaman

  useEffect(() => {
    getUserData();
  }, []);

  function getUserData() {
    axios.get('http://localhost/timetofill/users.php').then(function (response) {
      setUserData(response.data);
    });
  }

  function handleFileChange(event) {
    setFile(event.target.files[0]);
    console.log(mode);
  }

  function handleUpload() {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    axios.post('http://localhost/timetofill/user_upload.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      if (response.data.status === 1) {
        getUserData();
        alert(response.data.message);
      } else {
        alert(response.data.message);
        console.log(response.data);
      }
    }).catch(function (error) {
      console.log("Error during file upload: ", error);
      alert('Failed to upload file.');
    });
    setFile(null);
    fileInputRef.current.value = '';
  }

  // Menghitung data yang akan ditampilkan berdasarkan halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = userData.slice(indexOfFirstItem, indexOfLastItem);

  // Mengganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div>
        <NavBar />
        <div className="flex items-center justify-between w-screen px-20 my-10">
          <p className="w-1/3 text-3xl text-blue-800 font-semibold tracking-widest">List Users</p>
          <div className="w-2/3 flex justify-end items-center gap-x-4 py-1 justify-end">
            <div className="flex-row">
              <input ref={fileInputRef} className="text-blue-900 bg-transparent " type="file" onChange={handleFileChange} />
              <select value={mode} onChange={(e) => setMode(e.target.value)}
                className="px-2 mx-2 text-blue-900 bg-transparent " >
                <option value="add">Add</option>
                <option value="edit">Edit</option>
              </select>
              <button onClick={handleUpload} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Upload Users</button>
            </div>
            <button onClick={() => { navigate('/class') }} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Class</button>
          </div>
        </div>
        <div className="flex items-center w-screen px-20 ">
          <table className="w-full align-middle table-auto tracking-widest text-center">
            <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
              <tr>
                <th scope="col" className="w-1/12">#</th>
                <th scope="col" className="w-1/12">Username</th>
                <th scope="col" className="w-3/12">Name</th>
                <th scope="col" className="w-1/12">Category</th>
                <th scope="col" className="w-1/12">Class</th>
                <th scope="col" className="w-1/12">Status</th>
                <th scope="col" className="w-1/12">Action</th>
              </tr>
            </thead>
            <tbody className="align-middle text-blue-900 font-normal">
              {
                currentData.map((userData, index) => (
                  <tr className="border border-y-slate-600 h-8" key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{userData.username}</td>
                    <td>{userData.name}</td>
                    <td>{userData.category}</td>
                    <td>{userData.class}</td>
                    <td>{userData.status_user}</td>
                    <td>
                      <Link to={`./${userData.user_id}/edit`} style={{ marginRight: "10px" }}>Edit</Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="flex justify-center my-5">
          {Array.from({ length: Math.ceil(userData.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#577BC1] text-white' : 'bg-blue-100 text-blue-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
