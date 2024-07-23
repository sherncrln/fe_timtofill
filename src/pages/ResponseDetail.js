import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ResponseDetail() {
  const [responseList, setResponseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const {id} = useParams();
  const itemsPerPage = 10; // jumlah item per halaman
  const navigate = useNavigate();

  useEffect(() => {
    getResponseList();
    console.log(responseList);
  }, 
  // [currentPage]
  );
  
  function getResponseList(){
    axios.get(`http://localhost/timetofill/response.php?form_id=${id}`, responseList).then(function(response){
      setResponseList(response.data);
    });  
  }

  const totalPages = Math.ceil(responseList.length / itemsPerPage);

  // const currentData = responseList.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col items-center px-20 my-10">
          <p className="w-full text-3xl mb-8 text-blue-800 font-semibold tracking-widest">FORM NAME</p>
          <div className="w-full">
            <table className="w-full align-middle table-auto text-left overflow-hidden">
              <thead className="h-10 bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr>
                  <th scope="col" className="w-12">#</th>
                  <th scope="col" className="w-36">Timestamp</th>
                  <th scope="col" className="w-36">Responder</th>
                  <th scope="col" className="w-20 ">Class</th>
                  <th scope="col" className="">Question</th>
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 text-sm">
                {
                  // currentData.map((response, index) => (
                  //   <tr className="border border-y-slate-600 h-8" key={index}>
                  //     <td  className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  //     <td className="">{response.timestamp}</td>
                  //     <td className="">{response.name}</td>
                  //     <td className="">{response.class}</td>
                  //     <td>
                  //       {/* <Link to={`/response/${response.form_id}/view`} style={{ marginRight: "10px" }}>Open</Link> */}
                  //       {response ? 
                  //         ( response.respondent === "Dosen" && response.show_username === "N" ? (
                  //           <Link to={`/response/class`} style={{ marginRight: "10px" }}>Open</Link>
                  //         ): response.respondent === "Mahasiswa" && response.show_username === "N" ? (
                  //           <Link to={`/response/dosen`} style={{ marginRight: "10px" }}>Open</Link>
                  //         ): (<Link to={`/response/${response.form_id}/view`} style={{ marginRight: "10px" }}>Opem</Link>)
                  //       ): null}
                  //     </td>
                  //   </tr>
                  // ))
                }
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex list-none">
                {/* {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#577BC1] text-white' : 'bg-white text-gray-700'}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))} */}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
