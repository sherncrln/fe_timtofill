import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { Bar } from "react-chartjs-2";
// import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import NavBar from "../components/NavBar";
import axios from "axios";

export default function AnalyzeResponse() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sumby, setSumBy] = useState("Question");
  const [parameter, setCheckParameter] = useState({
    status : "",
    paramList : [],
  });
  const { id } = useParams();
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const backToResponseList = () => {
    navigate(`/response`);
  };

  useEffect(() => {
    getResponseList();
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
    });
    // console.log("ini merupakan response list", responseList);
    // console.log("ini merupakan Head Data", headData);
  }
   
  const handleSumBy = (event) => {
    setSumBy(event.target.value);
  };
      
  const handleSubmit = (event)=>{
    event.preventDefault();
    processHeaderData();
    console.log("HEADER : ",header, sumby);
  }
  
  const processHeaderData = () => {
    if (headData.question) {
      try {
        const headerString = headData.question;
        const headerArray = JSON.parse(headerString);
        setHeader(headerArray);
        // const qtypeString = headData.qtype;
        // const qtypeArray = JSON.parse(qtypeString);

        // if(parameter.status == ""){
        //     setHeader(headerArray);
        // }else if(parameter.status == "Dosen" || parameter.status == "Class"){
        //   const p = [1,2,3,4,5];
        //   // const p = parameter.paramList;
        //   const firstItemHeaders = headerArray.flatMap((itemArray, index) => {
        //     if (qtypeArray[index] == "multi-rating" || sumby == "Dosen" || sumby == "Class") {
        //       return p.map(param => `${param} ${itemArray[0]}`);
        //     } else {              
        //       return itemArray[0];
        //     }
        //   });
        //   setHeader(firstItemHeaders);
        // }
        // console.log("qtypeArray : ", qtypeArray);
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
    // console.log("ini adalah header ajaaa", header);
  };
  
 

  // useEffect(() => {
  //   if (headData.qtype?.includes("multi-rating")) {
  //     const respondent = headData.respondent;
  //     if (respondent === "Dosen") {
  //       setCheckParameter(prevState => ({
  //         ...prevState,
  //         status: "Class",
  //       }));
  //     } else if (respondent === "Mahasiswa") {
  //       setCheckParameter(prevState => ({
  //         ...prevState,
  //         status: "Dosen",
  //       }));
  //     }
  //     getParameter();
  //   }
  // }, [headData]);

  // function getParameter() {
  //   axios.get(`http://localhost/timetofill/response_parameter.php?form_id=${id}`).then(function(response) {
  //     if (response.data.parameter) {
  //       const param = response.data.parameter.split(',');
  //       setCheckParameter(prevState => ({
  //         ...prevState,
  //         paramList: param,
  //       }));
  //     }
  //   }).catch(error => {
  //     console.error("Error fetching data:", error);
  //   });
  // }  


  // useEffect(() => {
    //   const newAnswer = responseList.map(response => {
  //     try {
  //       const parsedAnswer = JSON.parse(response.answer);
  //           // Iterate over each key in parsedAnswer
  //           Object.keys(parsedAnswer).forEach(key => {
  //               if (Array.isArray(parsedAnswer[key])) {
  //                   parsedAnswer[key] = parsedAnswer[key].join(', ');
  //               }
  //           });
  //           return parsedAnswer;
  //     } catch (error) {
  //       console.error("Error parsing answer:", error);
  //       return [];
  //     }
  //   });
  //   setAnswer(newAnswer);
  //   // console.log("ini adalah answer ajaaa", answer);
  // }, [responseList]);

  // useEffect(() => {
  //   getResponseList();
  // }, [currentPage]);



  // const totalPages = Math.ceil(header.length / itemsPerPage);

  // const currentData = header.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-4">
          <div className="flex justify-between w-full mb-4">
              <h1 className="flex items-center w-10/12 h-24 text-3xl text-blue-800 font-semibold bg-transparent text-wrap">Analyze : {headData.name_form}</h1>
              <div className="w-3/12 flex items-center gap-x-1 justify-end">
                  <button  className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Export</button>
                  <button onClick={backToResponseList} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
              </div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
            <div className="w-full flex h-12 bg-blue-300 text-blue-950 font-semibold items-center rounded">
                <div className="w-3/5 flex">
                    <h1 className="pl-12 pr-4">Period</h1>
                    <input type="date" className="px-2 bg-gray-300 rounded" name="period_from"/>
                    <h1 className="px-4">to</h1>
                    <input type="date" className="px-2 bg-gray-300 rounded" name="period_to"/>
                </div>
                <div className="w-2/5 flex justify-end mr-10">
                    <label className="px-4">
                    <input 
                            type="radio"
                            name="sumby" 
                            onChange={handleSumBy} 
                            value="Question" 
                        /> Sum by Question
                    </label>
                    {headData.qtype?.includes("multi-rating") && headData.respondent == "Mahasiswa"? (
                      <label className="px-4">
                          <input 
                              type="radio" 
                              name="sumby" 
                              onChange={handleSumBy} 
                              value="Dosen" 
                          /> Sum by Variable
                      </label>
                    ) : headData.qtype?.includes("multi-rating") && headData.respondent == "Dosen"? (
                      <label className="px-4">
                          <input 
                              type="radio" 
                              name="sumby" 
                              onChange={handleSumBy} 
                              value="Class"
                          /> Sum by Class
                      </label>
                    ) : null }
                </div>
            </div>
            <div className="w-full py-4 flex justify-end">
              <button onClick={handleSubmit} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] justify-end">Apply</button>
            </div>
            <div className="w-full py-4 flex items-center justify-center">
            </div>
            </div>
            
            {/* <div className="w-full">
            {
                currentData.map((header, index) => (
                  <div key={`${header} ${index}`}>
                    <div className="bg-blue-200 flex rounded-t-md border border-y-slate-300 min-h-10 max-h-32 items-center py-2 mt-4" key={index}>
                        <p className="px-10 w-12 text-left">{(currentPage - 1) * itemsPerPage + index + 1}</p>
                        <p className="px-10 text-left" >{header}</p>
                    </div>
                    <div className="bg-white flex rounded-b-md border border-y-slate-300 min-h-10 max-h-32 items-center py-2 mb-4" key={index}>
                        <p className="px-10 w-12 text-left">{(currentPage - 1) * itemsPerPage + index + 1}</p>
                        {headData.qtype.map((option, opIndex) => (<p className="px-2 text-left" >{option[index][opIndex]}</p>))}
                    </div>
                  </div>
                ))
            }
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
            </div> */}
        </div>
      </div>
    </>
  );
}
