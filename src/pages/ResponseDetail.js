import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function ResponseDetail() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [parameter, setCheckParameter] = useState({
    status : "",
    paramList : [],
  });
  const { id } = useParams();
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const backToResponseList = () => {
    navigate('/response');
  };

  useEffect(() => {
    getResponseList();
  }, [currentPage]);
  
  useEffect(() => {
    if (headData.qtype?.includes("multi-rating")) {
      if (headData.respondent === "Dosen") {
        setCheckParameter({status : "Class"});
      } else if (headData.respondent === "Mahasiswa") {
        setCheckParameter({status : "Dosen"});
      }
    }
    console.log(parameter.status);
  }, [headData]);

  useEffect(() => {
    if (headData.question) {
      try {
        const headerString = headData.question;
        const headerArray = JSON.parse(headerString);

        if(parameter.status === ""){
          setHeader(headerArray);
        }else if(parameter.status === "Dosen"){
          const firstItemHeaders = headerArray.map(itemArray => itemArray[0]);
          setHeader(firstItemHeaders);
        }else if(parameter.status === "Class"){
          const firstItemHeaders = headerArray.map(itemArray => itemArray[0]);
          setHeader(firstItemHeaders);
        }
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
    console.log("ini adalah header ajaaa", header);

  }, [headData]);

  useEffect(() => {
    // Update `answer` when `responseList` changes
    const newAnswer = responseList.map(response => {
      try {
        return JSON.parse(response.answer);
      } catch (error) {
        console.error("Error parsing answer:", error);
        return [];
      }
    });
    setAnswer(newAnswer);
  }, [responseList]);

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
    console.log("ini merupakan response", responseList);
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
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-10">
          <div className="flex justify-between w-full mb-4">
              <h1 className="flex items-center w-10/12 h-20 text-3xl text-blue-800 font-semibold bg-transparent text-wrap ">Response : {headData.name_form}</h1>
              <div className="w-2/12 flex items-center gap-x-4 justify-end">
                  <button onClick={backToResponseList} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
              </div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <table className="min-w-full align-middle table-auto text-left overflow text-sm">
              <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr className="align-middle">
                  <th scope="col" className="min-w-12">#</th>
                  <th scope="col" className="min-w-36">Timestamp</th>
                  <th scope="col" className="min-w-24">Responder</th>
                  <th scope="col" className="min-w-20">Class</th>
                  {
                  header.map((header, index) => (
                    <th key={index} scope="col" className="min-w-32 max-w-96" title={header} ><p className="line-clamp-3" >{header}</p></th>
                  ))
                  }
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 text-sm">
                {
                  currentData.map((response, index) => (
                    <tr className="border border-gray-300 h-8" key={index}>
                      <td className="w-12 text-center ">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-gray-300">{response.timestamp}</td>
                      <td className="text-center border border-gray-300">{response.name}</td>
                      <td className="text-center border border-gray-300">{response.class}</td>
                      {header.map((headerItem, ansIndex) => (
                      <td key={ansIndex} scope="col" className="border border-gray-300">
                        {answer[index][headerItem] || ''}
                      </td>
                    ))}
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
