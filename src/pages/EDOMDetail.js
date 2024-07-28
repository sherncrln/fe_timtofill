import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EDOMDetail() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [dosenHeader, setDosenHeader] = useState([]);
  const [newHeaderData, setNewHeaderData] = useState([]);
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
  const [publishDate, setPublishDate] = useState("");
  const [dosen, setDosen] = useState([]);
  const [noSurat, setNoSurat] = useState([]);

  const backToResponseList = () => {
    navigate('/response');
  };

  useEffect(() => {
    getResponseList();
    getDosenList();
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

        const dHeader = headerArray.flatMap((itemArray, index) => {
          if (qtypeArray[index] == "multi-rating") {
            if(parameter.status == "Dosen" || parameter.status == "Class"){
              const p = parameter.paramList;
              return p.map(param => `${param} ${itemArray[0]}`);
            }
          }else{
            return[];
          }
        });

        setHeader(firstItemHeaders);
        setDosenHeader(dHeader);
        
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
    // console.log("ini merupakan headData", headData);
    // console.log("ini merupakan HEADER", header);
    // console.log("ini merupakan response", responseList);
    // console.log("ini merupakan dHeader", dosenHeader);
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
  
  function getDosenList(){
    axios.get(`http://localhost/timetofill/dosen.php`).then(function(response){
        setDosen(response.data);
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

  const totalPages = Math.ceil(dosen.length / itemsPerPage);

  const currentData = dosen.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const cleanDataKeys = (data) => {
    const cleanedData = {};
  
    Object.entries(data).forEach(([key, value]) => {
      // Remove numbers and spaces from the beginning of the key
      const cleanedKey = key.replace(/^\d+\s*/, '');
      cleanedData[cleanedKey] = value;
    });
  
    return cleanedData;
  };

  const handleFilterScore = (headerItem, dosen) =>{
    var filteredData = {}
    answer.forEach((row, index)=>{
      filteredData = Object.entries(row)
      .filter(([key]) => key.includes(headerItem && dosen))
      .map(([key, values]) => {
        var sum = 0
        for (let i = 0; i < values.split(", ").length; i++) {
          sum += parseInt(values.split(", ")[i]);
        }
        return sum
        // return (
        //   <div key={key} className="text-center">
        //     {sum}
        //   </div>
        // )
      });
    })
    handleTotal(filteredData)
    // setNewHeaderData(filteredData[1])
    return filteredData[1]
  }

  const handleTotal = (dosen) =>{

      var totalValue = 0
      header.map(rows=>{
        answer.forEach((row, index)=>{
          totalValue = Object.entries(row)
          .filter(([key]) => key.includes(rows, dosen))
          .map(([key, values]) => {
            var sum = 0
            for (let i = 0; i < values.split(", ").length; i++) {
              sum += parseInt(values.split(", ")[i]);
            } 
            return sum
          });
        })
      })
      var totalResult = 0
      for (let i = 0; i < totalValue.length; i++) {
        console.log(totalValue[i])
        totalResult += parseInt(totalValue[i]);
      }
      return totalResult
  }

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
            <p className="px-8"><b>Published : </b> {publishDate}</p>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <table className="min-w-full align-middle table-auto text-left overflow-x-auto scrollbar-thin text-sm">
              <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal">
                <tr className="align-middle">
                  <th scope="col" className="w-12">#</th>
                  <th scope="col" className="w-20">Username</th>
                  <th scope="col" className="w-48">Nama</th>                  
                  {
                    header.map((header, index) => (
                      <th key={index} scope="col" className="w-32" title={header} ><p className="line-clamp-3" >{header}</p></th>
                    ))
                  }
                  <th scope="col" className="w-24">Total</th>                  
                  <th scope="col" className="w-24">Class</th>                  
                  <th scope="col" className="w-24">Result</th>                  
                  <th scope="col" className="w-24">Rank</th>                  
                  <th scope="col" className="w-24">Predikat</th>                  
                  <th scope="col" className="w-24">Surat</th>                  
                </tr>
              </thead>
              <tbody className="align-middle text-blue-900 text-sm">
                {
                  currentData.map((dosen, index) => (
                    <tr className="border border-gray-300 h-8" key={index}>
                      <td className="w-12 text-center ">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-gray-300 text-center ">{dosen.username}</td>
                      <td className="text-center border border-gray-300">{dosen.name}</td>                        
                      {header.map((headerItem, ansIndex) => (
                        <td key={ansIndex} scope="col" className="text-center border border-gray-300 px-2">
                          {handleFilterScore(headerItem, dosen.username) || 0}
                        </td>
                      ))}
                      <td className="text-center border border-gray-300">
                        {handleTotal(dosen.username)}
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
