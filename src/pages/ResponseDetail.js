import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ResponseDetail() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const {id} = useParams();
  const itemsPerPage = 15; // jumlah item per halaman
  const navigate = useNavigate();

  useEffect(() => {
    getResponseList();
    // const answerArray = answer.split('"],["').map(item => item.replace(/^"|"$|\\/g, ''));
    // setAnswer(answerArray);
  }, [currentPage]);

  useEffect(() => {
    if (headData.question) {
      try {
        // Parsing the question field and cleaning up the string
        const headerString = headData.question.replace(/^\[\[|\]\]$/g, '');
        const headerArray = headerString.split('"],["').map(item => item.replace(/^"|"$|\\/g, ''));
        setHeader(headerArray);
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
    console.log("ini merupakan response", answer);
  }, [headData]);

  function getResponseList() {
    axios.get(`http://localhost/timetofill/response.php?form_id=${id}`).then(function(response) {
      if (response.data) {
        setResponseList(response.data.response || []);
        setHeadData(response.data.head || {});
      } else {
        setResponseList([]);
        setHeadData({});
      }
    }).catch(error => {
      console.error("Error fetching data:", error);
      setResponseList([]);
      setHeadData({});
    });
  }

  const totalPages = Math.ceil(responseList.length / itemsPerPage);

  const currentData = responseList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col items-center px-20 my-10">
          <p className="w-full text-3xl mb-8 text-blue-800 font-semibold">Response : {headData.name_form}</p>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <table className="w-full align-middle table-auto text-left overflow-hidden text-sm">
              <thead className="h-10 bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr>
                  <th scope="col" className="w-12">#</th>
                  <th scope="col" className="w-36">Timestamp</th>
                  <th scope="col" className="w-24">Responder</th>
                  <th scope="col" className="w-20 ">Class</th>
                  {
                  header.map((header, index) => (
                    <th key={index} scope="col" className="max-w-100">{header}</th>
                  ))
                }
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 text-sm">
                {
                  currentData.map((response, index) => (
                    <tr className="border border-y-slate-600 h-8" key={index}>
                      <td  className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="">{response.timestamp}</td>
                      <td className="text-center">{response.name}</td>
                      <td className="text-center">{response.class}</td>
                      <td>
                        {/* <Link to={`/response/${response.form_id}/view`} style={{ marginRight: "10px" }}>Open</Link> */}
                        {response ? 
                          ( response.respondent === "Dosen" && response.show_username === "N" ? (
                            <Link to={`/response/class`} style={{ marginRight: "10px" }}>Open</Link>
                          ): response.respondent === "Mahasiswa" && response.show_username === "N" ? (
                            <Link to={`/response/dosen`} style={{ marginRight: "10px" }}>Open</Link>
                          ): (<Link to={`/response/${response.form_id}/view`} style={{ marginRight: "10px" }}>Opem</Link>)
                        ): null}
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
