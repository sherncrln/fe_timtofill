import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";
import * as XLSX from "xlsx";

export default function EDOMDetail() {
  const [responseList, setResponseList] = useState([]);
  const [headData, setHeadData] = useState([]);
  const [header, setHeader] = useState([]);
  const [dosenHeader, setDosenHeader] = useState([]);
  const [newHeaderData, setNewHeaderData] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [parameter, setCheckParameter] = useState({
    status: "",
    paramList: [],
  });
  const { id } = useParams();
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const [statusEDOM, setStatusEDOM] = useState("On Process");
  const [publishDate, setPublishDate] = useState("");
  const [dosen, setDosen] = useState([]);
  const [classData, setClass] = useState([]);
  const [rankedData, setRankedData] = useState([]);
  const [publishMessage, setPublishMessage] = useState("");

  const backToResponseList = () => {
    navigate('/response');
  };

  useEffect(() => {
    getResponseList();
    getDosenList();
    getClass();
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
        setDosenHeader(dHeader);
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
    const currentData = dosen.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const rankedData = calculateRank(currentData, handleResult);
    setRankedData(rankedData);
  }, [dosen, currentPage, answer, header]);

  const handlePublish = () => {
    // Ambil data dari rankedData dan buat array dengan data yang akan dikirim
    const publishData = rankedData.map(dosen => ({
      form_id: id,
      status_edom: "Published",
      dosen_id: (dosen.username),
      last_published: new Date().toISOString().slice(0, 10),
      total: handleTotal(dosen.username) || 0,
      class: countUsernameOccurrences(dosen.username) || 0,
      result: handleResult(dosen.username) || 0,
      rank: dosen.rank || '',
      predikat: handleTotal(dosen.username) != 0 ? "Sangat Baik" : ""
    }));
    
    console.log("Data yang akan diposting:", publishData); // Tambahkan log ini
  
    axios.post(`http://localhost/timetofill/publish_edom.php`, publishData)
      .then((response) => {
        setStatusEDOM("Published");
        setPublishDate(new Date().toISOString().slice(0, 10));
        setPublishMessage("EDOM has been successfully published!");
      })
      .catch((error) => {
        console.error("Error publishing EDOM:", error);
        setPublishMessage("Failed to publish EDOM. Please try again.");
      });
  };

  const handleUnpublish = () => {
    axios.post(`http://localhost/timetofill/unpublish_edom.php`, {
      form_id: id,
      status_edom: "On Process",
    })
    .then((response) => {
      setStatusEDOM("On Process");
      setPublishMessage("EDOM has been successfully unpublished!");
    })
    .catch((error) => {
      console.error("Error unpublishing EDOM:", error);
      setPublishMessage("Failed to unpublish EDOM. Please try again.");
    });
  };

  function getDosenList() {
    axios.get(`http://localhost/timetofill/dosen.php`).then(function (response) {
      setDosen(response.data);
    });
  }

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

  function getClass() {
    axios.get('http://localhost/timetofill/class.php').then(function (response) {
      setClass(response.data);
    });
  }

  const calculateRank = (data, handleResult) => {
    const dataWithResult = data.map((dosen) => {
      const result = handleResult(dosen.username);
      return { ...dosen, result: parseFloat(result) };
    });

    // Urutkan dosen berdasarkan result dari terbesar ke terkecil
    const sortedData = dataWithResult.sort((a, b) => b.result - a.result);

    // Tetapkan rank berdasarkan urutan
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return rankedData;
  };

  const totalPages = Math.ceil(dosen.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterScore = (headerItem, dosen) => {
    let totalSum = 0;
    let count = 0;

    answer.forEach(row => {
      Object.entries(row).forEach(([key, values]) => {
        if (key.includes(headerItem) && key.includes(dosen)) {
          const valueArray = values.split(", ").map(Number);
          totalSum += valueArray.reduce((acc, val) => acc + val, 0);
          count += 1; // Jumlah nilai yang cocok
        }
      });
    });
    // Jika ada data yang cocok, hitung rata-rata
    return count > 0 ? (totalSum / count).toFixed(2) : 0.00;
  };

  const handleTotal = (dosen) => {
    let totalSum = 0;

    header.forEach(headerItem => {
      // Konversi hasil ke angka sebelum penjumlahan
      totalSum += parseFloat(handleFilterScore(headerItem, dosen));
    });

    // Format total dengan dua angka desimal
    return totalSum.toFixed(2);
  };

  const handleResult = (dosen) => {
    const total = handleTotal(dosen);
    return (total / 4).toFixed(2); // Membagi total dengan 4 dan membulatkan hasilnya
  };

  const countUsernameOccurrences = (username) => {
    let count = 0;
    const today = new Date();

    classData.forEach(item => {
      const validToDate = new Date(item.valid_to);

      if (validToDate > today) {
        for (let i = 1; i <= 6; i++) {
          const variableKey = `variable_${i}`;
          if (item[variableKey] && item[variableKey].includes(username)) {
            count++;
          }
        }
      }
    });

    return count;
  };

  const exportToXLSX = () => {
    // Membuat array data untuk diekspor
    const exportData = rankedData.map((dosen, index) => {
      const row = {
        No: (currentPage - 1) * itemsPerPage + index + 1,
        Username: dosen.username,
        Name: dosen.name,
        Total: handleTotal(dosen.username),
        Result: handleResult(dosen.username),
        Class: countUsernameOccurrences(dosen.username),
        Rank: dosen.rank
      };
  
      // Tambahkan data header ke dalam baris
      header.forEach((head, headIndex) => {
        row[head] = handleFilterScore(head, dosen.username);
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
              {statusEDOM === "Published" ?
                <>
                  <button className="w-32 h-10 rounded bg-[#f15b5b] tracking-widest text-sm text-[#f8fafc] px-2" onClick={handleUnpublish}>Unpublish</button>
                </> :
                <>
                  <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2" onClick={handlePublish}>Publish</button>
                </> 
              }
              <button className="w-32 h-10 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] px-2" onClick={backToResponseList}>Back</button>
            </div>
          </div>
            {publishMessage && <p className="mt-4 text-center text-red-600">{publishMessage}</p>}
          <div className="flex flex-row gap-x-4">
            <p><b>Status : </b>{statusEDOM}</p>
            <p><b>Publish : </b>{publishDate}</p>
          </div>
          <table className="table-auto w-full mt-5">
            <thead className="h-10 max-h-24 overflow-hidden bg-[#577BC1] text-center text-[#f8fafc] font-normal text-sm">
              <tr>
                <th className="w-20 px-4 py-2 border">No</th>
                <th className="w-20 px-4 py-2 border">Username</th>
                <th className="w-20 px-4 py-2 border">Name</th>
                {header.map((head, index) => (
                  <th key={index} className="w-20 px-4 py-2 border">{head}</th>
                ))}
                <th className="w-20 px-4 py-2 border">Total</th>
                <th className="w-20 px-4 py-2 border">Result</th>
                <th className="w-20 px-4 py-2 border">Class</th>
                <th className="w-20 px-4 py-2 border">Rank</th>
                <th className="w-20 px-4 py-2 border">Predikat</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rankedData.map((dosen, index) => (
                <tr key={dosen.username}>
                  <td className="border px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border px-4 py-2">{dosen.username}</td>
                  <td className="border px-4 py-2">{dosen.name}</td>
                  {header.map((head, headIndex) => (
                    <td key={headIndex} className="border px-4 py-2">{handleFilterScore(head, dosen.username)}</td>
                  ))}
                  <td className="border px-4 py-2">{handleTotal(dosen.username)}</td>
                  <td className="border px-4 py-2">{handleResult(dosen.username)}</td>
                  <td className="border px-4 py-2">{countUsernameOccurrences(dosen.username)}</td>
                  <td className="border px-4 py-2">{dosen.rank}</td>
                  <td className="border px-4 py-2">{handleTotal(dosen.username) != 0? "Sangat Baik" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#577BC1] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
