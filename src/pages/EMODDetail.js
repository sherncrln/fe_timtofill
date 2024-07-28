import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EMODDetail() {
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
  const [statusEDOM, setStatusEDOM] = useState("On Process");
  const [classData, setclassData] = useState([]);
  const [noSurat, setNoSurat] = useState([]);

  const backToResponseList = () => {
    navigate('/response');
  };

  useEffect(() => {
    getResponseList();
    getclassData();
    console.log("ini merupakan response", responseList);
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

        const firstItemHeaders = headerArray.flatMap((itemArray, index) => {
          if (qtypeArray[index] == "multi-rating") {
            return itemArray[0];
          }else{
            return[];
          }
        });

        setHeader(firstItemHeaders);
        
        // if(parameter.status == ""){
        //   setHeader(headerArray);
        // } else if(parameter.status == "Dosen" || parameter.status == "Class"){
        //   const p = parameter.paramList;
        //   const firstItemHeaders = headerArray.flatMap((itemArray, index) => {
        //     if (qtypeArray[index] == "multi-rating") {
        //       return p.map(param => `${param} ${itemArray[0]}`);
        //     } else {              
        //       return itemArray[0];
        //     }
        //   });
        //   setHeader(firstItemHeaders);
        // }
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }    
    console.log("ini merupakan headData", headData);
    console.log("ini merupakan HEADER", header);
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
    console.log("ini adalah answer ajaaa", answer);
  }, [responseList]);
  
  function getclassData() {
    axios.get('http://localhost/timetofill/class.php').then(function (response) {
      setclassData(response.data);
    });
  }

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

  const totalPages = Math.ceil(classData.length / itemsPerPage);

  const currentData = classData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <>
      <div className="min-h-screen flex flex-col w-full">
        <NavBar />
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-4">
          <div className="flex justify-between w-full ">
              <h1 className="flex items-center w-10/12 h-24 text-3xl text-blue-800 font-semibold bg-transparent text-wrap">Result : {headData.name_form}</h1>
              <div className="w-3/12 flex items-center gap-x-1 justify-end">
                  <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2">Publish</button>
                  {statusEDOM === "Published" ? (
                    <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2">Cancel Publish</button>
                  ) : (null)}
                  <button onClick={backToResponseList} className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2">Back</button>
              </div>
          </div>
          <div className="flex w=full mb-4 justify-start text-blue-950">
            <p><b>Status : </b> {statusEDOM}</p>
            <p className="px-8"><b>Published : </b> {statusEDOM}</p>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <table className="min-w-full align-middle table-auto text-left overflow text-sm">
              <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr className="align-middle">
                  <th scope="col" className="w-12">#</th>
                  <th scope="col" className="w-20">Class</th>              
                  {
                    header.map((header, index) => (
                      <th key={index} scope="col" className="w-32" title={header} ><p className="line-clamp-3" >{header}</p></th>
                    ))
                  }
                  <th scope="col" className="w-24">Total</th>                  
                  <th scope="col" className="w-24">Dosen</th>                  
                  <th scope="col" className="w-24">Result</th>                   
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 text-sm">
                {
                  currentData.map((classData, index) => (
                    <tr className="border border-gray-300 h-8" key={index}>
                      <td className="w-12 text-center ">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-gray-300 text-center ">{classData.class}</td>                  
                      
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