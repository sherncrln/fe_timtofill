import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ResponseList() {
  const [responseList, setResponseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // jumlah item per halaman
  const navigate = useNavigate();

  const backToHomePage = () => {
    navigate('/home');
  };

  useEffect(() => {
    getResponseList();
  }, [currentPage]);

  function getResponseList() {
    axios.get('http://localhost/timetofill/form.php').then(function (response) {
      setResponseList(response.data);
    });
  }

  // Fungsi untuk menghitung total halaman
  const totalPages = Math.ceil(responseList.length / itemsPerPage);

  // Fungsi untuk mendapatkan data berdasarkan halaman saat ini
  const currentData = responseList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk mengganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="w-screen min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col items-center px-20 mt-4">
          <div className="flex justify-between w-screen px-20 mb-4">
              <h1 className="flex items-center w-10/12 h-20 text-3xl text-blue-800 font-semibold tracking-wider bg-transparent text-wrap">List Form Response</h1>
              <div className="w-2/12 flex items-center gap-x-4 justify-end">
                  <button onClick={backToHomePage} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
              </div>
          </div>
          <div className="w-full">
            <table className="w-full align-middle table-auto tracking-widest text-center">
              <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
                <tr>
                  <th scope="col" className="w-1/12">#</th>
                  <th scope="col" className="w-8/12 text-left">Form Name</th>
                  <th scope="col" className="w-3/12">Action</th>
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 font-normal">
                {
                  currentData.map((response, index) => (
                    <tr className="border border-y-slate-600 h-10" key={index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="text-left">{response.name_form}</td>
                      <td>
                        <Link to={`/response/${response.form_id}/view`} style={{ marginRight: "10px" }}>Open</Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex list-none">
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#577BC1] text-white' : 'bg-white text-gray-700'}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
