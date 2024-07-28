import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import NavBar from "../components/NavBar";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function AnalyzeResponse() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [qtypeList, setQtypeList] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sumby, setSumBy] = useState("Question");
  const [dataOption, setDataOption] = useState([]);
  const [dataCountOption, setDataCountOption] = useState([]);
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
    getAnswer();
    console.log("HEADER : ",header);
    console.log("qTYPE : ",qtypeList);
    console.log("ini adalah answer ajaaa", answer);
    console.log("ini adalah answer.header ajaaa", answer["Jenis Kelamin"]);
  }
  
  const processHeaderData = () => {
    if (headData.question) {
      try {
        const headerString = headData.question;
        const headerArray = JSON.parse(headerString);
        const qtypeString = headData.qtype;
        const qtypeArray = JSON.parse(qtypeString);

        if(headData.qtype?.includes("multi-rating")){
          const firstItemHeaders = headerArray.flatMap((itemArray, index) => {
            return itemArray[0];
          });
          const firstItemQtype = qtypeArray.flatMap((itemArray, index) => {
            return JSON.parse(itemArray[0]);
          });
          setHeader(firstItemHeaders);
          setQtypeList(firstItemQtype);
        }else {
          setHeader(headerArray);
          setQtypeList(qtypeArray);
        }
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
    console.log("ini adalah QTYPE ajaaa", qtypeList);
  };
  
  function getAnswer(){
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
    processDataAnswer(newAnswer);
  }

  const processDataAnswer = (answers) => {
    const options = [];
    const counts = [];

    header.forEach((question, index) => {
      const qtype = qtypeList[index][0];
      if (["dropdown", "checkbox", "radio", "radio-rating"].includes(qtype)) {
        let optionValues;
        
        if (qtype === "radio-rating") {
          optionValues = ["Sangat Baik", "Baik", "Cukup", "Kurang", "Sangat Kurang"];
        } else {
          optionValues = qtypeList[index].slice(1);
        }
        
        options.push(optionValues);
        
        const countValues = optionValues.map(option => 0);
        
        answers.forEach(answer => {
          const value = answer[question];
          if (value) {
            const values = value.split(', ');
            values.forEach(val => {
              const optionIndex = optionValues.indexOf(val);
              if (optionIndex !== -1) {
                countValues[optionIndex]++;
              }
            });
          }
        });
        
        console.log("optionValues: ", optionValues, index);
        counts.push(countValues);
      } else {
        options.push(['']);
        counts.push(['']);
      }
    });

    setDataOption(options);
    setDataCountOption(counts);
    console.log("DataOption: ", options);
    console.log("DataCountOption: ", counts);
  };

  const totalPages = Math.ceil(header.length / itemsPerPage);

  const currentData = header.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-4">
          <div className="flex justify-between w-full mb-4">
              <h1 className="flex items-center w-10/12 h-24 text-3xl text-blue-800 font-semibold bg-transparent text-wrap">Analyze : {headData.name_form}</h1>
              <div className="w-3/12 flex items-center gap-x-1 justify-end">
                <button onClick={handleSubmit} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] justify-end">Apply</button>
                <button onClick={backToResponseList} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
              </div>
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300">
          </div>
          <div className="w-full">
            {currentData.map((header, index) => (
                  <div key={`${header} ${index}`}>
                    <div className="bg-blue-200 flex rounded-t-md border border-y-slate-300 min-h-10 max-h-32 items-center py-2 mt-4">
                        <p className="px-10 w-12 text-left">{(currentPage - 1) * itemsPerPage + index + 1}</p>
                        <p className="px-10 text-left" >{header}</p>
                    </div>
                    <div className="px-20 bg-white flex rounded-b-md border border-y-slate-300 min-h-10  items-center py-2 mb-4">
                          {((qtypeList[index][0] == "radio") || (qtypeList[index][0] == "radio-rating") ||(qtypeList[index][0] == "dropdown") || (qtypeList[index][0] == "checkbox") )? (
                            <>
                              <div style={{ width: '800px', height: '400px' }}>
                              <Bar
                                data={{
                                  labels: dataOption[index],
                                  datasets: [
                                    {
                                      label: header,
                                      data: dataCountOption[index],
                                      backgroundColor: "rgba(75,192,192,0.4)",
                                      borderColor: "rgba(75,192,192,1)",
                                      borderWidth: 1,
                                    },
                                  ],
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    datalabels: {
                                      display: true,
                                      color: 'black',
                                      align: 'end',
                                      anchor: 'end',
                                      align: 'start', 
                                      formatter: (value, context) => {
                                        return value;
                                      },
                                      offset: 10, 
                                    },
                                    tooltip: {
                                      callbacks: {
                                        title: function (tooltipItem) {
                                          return tooltipItem[0].label;
                                        },
                                      },
                                    },
                                  },
                                  scales: {
                                    x: {
                                      beginAtZero: true,
                                    },
                                    y: {
                                      beginAtZero: true,
                                    },
                                  },
                                }}
                              />
                              {qtypeList[index][0]}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col w-full mb-4 max-h-48 overflow-y-auto scrollbar-thin ">
                            {answer.map((ans, index) => (
                              <p key={index} className="border-b-2 py-1">{ans[header]} {qtypeList[index][0]} {index}</p>
                            ))}
                          </div>
                          )}
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
            </div>
        </div>
      </div>
    </>
  );
}