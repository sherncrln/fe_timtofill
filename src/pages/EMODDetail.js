import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";
import * as XLSX from "xlsx";

export default function EDOMDetail() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [parameter, setCheckParameter] = useState({
    status: "",
    paramList: [],
  });
  const { id } = useParams();
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const [classData, setClassData] = useState([]);
  const backToResponseList = () => {
    navigate('/response');
  };

  useEffect(() => {
    getResponseList();
    getClassData();
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
          } else {
            return [];
          }
        });

        const dHeader = headerArray.flatMap((itemArray, index) => {
          if (qtypeArray[index] == "multi-rating") {
            if (parameter.status == "Dosen" || parameter.status == "Class") {
              const p = parameter.paramList;
              return p.map(param => `${param} ${itemArray[0]}`);
            }
          } else {
            return [];
          }
        });

        setHeader(firstItemHeaders);
      } catch (error) {
        console.error("Error parsing header data:", error);
      }
    }
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
  }, [responseList]);

  useEffect(() => {
    const currentData = classData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [classData, currentPage, answer, header]);


  function getParameter() {
    axios.get(`http://localhost/timetofill/response_parameter.php?form_id=${id}`).then(function (response) {
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
    axios.get(`http://localhost/timetofill/response.php?form_id=${id}`).then(function (response) {
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

  function getClassData() {
    axios.get('http://localhost/timetofill/class.php').then(function (response) {
      const filteredData = response.data.filter(item => 
        item.class !== 'DOSEN' && item.class !== 'STAFF' && item.class !== 'ADMIN'
      );
      setClassData(filteredData);
    });
  }

  const totalPages = Math.ceil(classData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterScore = (headerItem, classData) => {
    let totalSum = 0;
    let count = 0;

    answer.forEach(row => {
      Object.entries(row).forEach(([key, values]) => {
        if (key.includes(headerItem) && key.includes(classData)) {
          const valueArray = values.split(", ").map(Number);
          totalSum += valueArray.reduce((acc, val) => acc + val, 0);
          count += 1; // Jumlah nilai yang cocok
        }
      });
    });
    // Jika ada data yang cocok, hitung rata-rata
    return count > 0 ? (totalSum / count).toFixed(2) : 0.00;
  };

  const handleTotal = (data) => {
    let totalSum = 0;

    header.forEach(headerItem => {
      // Konversi hasil ke angka sebelum penjumlahan
      totalSum += parseFloat(handleFilterScore(headerItem, data));
    });

    // Format total dengan dua angka desimal
    return totalSum.toFixed(2);
  };

  const handleResult = (data) => {
    const total = handleTotal(data);
    return (total / 4).toFixed(2); // Membagi total dengan 4 dan membulatkan hasilnya
  };

  const countClassOccurrences = (data) => {
    let count = 0;
    const today = new Date();

    classData.forEach(item => {
      const validToDate = new Date(item.valid_to);

      if (validToDate > today) {
        for (let i = 1; i <= 6; i++) {
          const variableKey = `variable_${i}`;
          if (item[variableKey] && item['class'].includes(data)) {
            count++;
          }
        }
      }
    });

    return count;
  };

  const exportToXLSX = () => {
    // Membuat array data untuk diekspor
    const exportData = classData.map((data, index) => {
      const row = {
        No: (currentPage - 1) * itemsPerPage + index + 1,
        Class: data.class,
        Dosen: countClassOccurrences(data.class),
      };

      // Tambahkan data header ke dalam baris
      header.forEach((head, headIndex) => {
        row[head] = handleFilterScore(head, data.class);
      });

      return row;
    });

    // Membuat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EDOM Data");

    // Menyimpan file XLSX
    XLSX.writeFile(workbook, "EDOM_Data.xlsx");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col w-full">
        <NavBar />
        <div className="w-screen flex-grow flex flex-col items-center px-20 my-4">
          <div className="flex justify-between w-full ">
            <h1 className="flex items-center w-10/12 h-24 text-3xl text-blue-800 font-semibold bg-transparent text-wrap">Result : {headData.name_form}</h1>
            <div className="w-3/12 flex items-center gap-x-1 justify-end">
              <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2" onClick={exportToXLSX}>Export</button>
              <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2" onClick={backToResponseList}>Back</button>
            </div>
          </div>
          <table className="table-auto w-full mt-5">
            <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal text-sm">
              <tr>
                <th className="w-1/12 px-4 py-2 border">No</th>
                <th className="w-1/12 px-4 py-2 border">Class</th>
                <th className="w-1/12 px-4 py-2 border">Dosen</th>
                <th className="w-4/12 px-4 py-2 border">Penilaian</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {classData.map((classData, index) => (
                <tr key={classData.class}>
                  <td className="border px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border px-4 py-2">{classData.class}</td>
                  <td className="border px-4 py-2">{countClassOccurrences(classData.class)}</td>
                  {header.map((head, headIndex) => (
                    <td key={headIndex} className="border px-4 py-2">{handleFilterScore(head, classData.class)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {/* {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#577BC1] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))} */}
          </div>
        </div>
      </div>
    </>
  );
}
