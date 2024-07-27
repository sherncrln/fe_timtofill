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
    // console.log("ini merupakan response", responseList);
  }, [currentPage]);
  
  useEffect(() => {
    if (headData.qtype?.includes("multi-rating")) {
      const respondent = headData.respondent;
      if (respondent === "Dosen") {
        setCheckParameter(prevState => ({
          ...prevState,
          status: "Class",
        }));
      } else if (respondent === "Mahasiswa") {
        setCheckParameter(prevState => ({
          ...prevState,
          status: "Dosen",
        }));
      }
      getParameter();
    }
  }, [headData]);

  useEffect(() => {
    if (headData.question) {
      try {
        const headerString = headData.question;
        const headerArray = JSON.parse(headerString);
        const qtypeString = headData.qtype;
        const qtypeArray = JSON.parse(qtypeString);
  
        if(parameter.status == ""){
          setHeader(headerArray);
        } else if(parameter.status == "Dosen" || parameter.status == "Class"){
          const p = parameter.paramList;
          const firstItemHeaders = headerArray.flatMap((itemArray, index) => {
            if (qtypeArray[index] == "multi-rating") {
              return p.map(param => `${param} ${itemArray[0]}`);
            } else {              
              return itemArray[0];
            }
          });
          setHeader(firstItemHeaders);
        }
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }    
    // console.log("ini merupakan headData", headData);
  }, [headData, parameter]);
  
  useEffect(() => {
    const newAnswer = responseList.map(response => {
      try {
        const parsedAnswer = JSON.parse(response.answer);
            // Iterate over each key in parsedAnswer
            Object.keys(parsedAnswer).forEach(key => {
                if (Array.isArray(parsedAnswer[key])) {
                    parsedAnswer[key] = parsedAnswer[key].join(', ');
                }
            });
            return parsedAnswer;
      } catch (error) {
        console.error("Error parsing answer:", error);
        return [];
      }
    });
    setAnswer(newAnswer);
    // console.log("ini adalah answer ajaaa", answer);
  }, [responseList]);

  function getParameter() {
    axios.get(`http://localhost/timetofill/response_parameter.php?form_id=${id}`).then(function(response) {
      if (response.data.parameter) {
        const param = response.data.parameter.split(',');
        setCheckParameter(prevState => ({
          ...prevState,
          paramList: param,
        }));
      }
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }

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
      <div className="min-h-screen flex flex-col w-full">
        <NavBar />
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-4">
          <div className="flex justify-between w-full mb-4">
              <h1 className="flex items-center w-10/12 h-24 text-3xl text-blue-800 font-semibold bg-transparent text-wrap">Response : {headData.name_form}</h1>
              <div className="w-3/12 flex items-center gap-x-1 justify-end">
                  <button  className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Export</button>
                  <button onClick={() => {navigate(`/analyze/${id}/view`)}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Analyze</button>
                  <button onClick={backToResponseList} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
              </div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <table className="min-w-full align-middle table-auto text-left overflow text-sm">
              <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr className="align-middle">
                  <th scope="col" className="min-w-12">#</th>
                  <th scope="col" className="min-w-36">Timestamp</th>
                  {headData.show_username === "Y"? (
                    <th scope="col" className="min-w-24">Responder</th>
                  ) : (null)}
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
                      {headData.show_username === "Y"? (
                        <td className="text-center border border-gray-300">{response.name}</td>                        
                      ) : (null)}
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
