import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function EDOMDetailView() {
    const [edomData, setEdomData] = useState([]);
    const navigate = useNavigate();
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const dosen_id = logged_data ? logged_data.username : null;

    useEffect(() => {
        getEdomData();
        console.log(edomData);
    }, []);
    
    
    function getEdomData() {
        axios.get(`http://localhost/timetofill/publish_edom.php?dosen_id=${dosen_id}`)
            .then(response => {
                // Pastikan data yang diterima adalah array
                if (Array.isArray(response.data)) {
                    setEdomData(response.data);
                } else {
                    console.error("Data is not an array:", response.data);
                    setEdomData([]);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the EDOM data!", error);
                setEdomData([]);
            });
    }

    return (
        <>
        <div>
            <NavBar />
            <div className="flex-row">
            <div className="flex items-center px-20 my-10">
                <p className="w-2/3 text-3xl text-blue-800 font-semibold tracking-widest">Result : Evaluasi Dosen Oleh Mahasiswa</p>
                <div className="w-1/3 flex justify-end items-center gap-x-4 py-1 justify-end">
                <button onClick={() => { navigate('/home') }} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
                </div>
            </div>
            <div className="flex items-center w-screen px-20 ">
                <table className="w-full align-middle table-auto tracking-widest text-center">
                <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
                    <tr>
                    <th scope="col" className="w-1/12">#</th>
                    <th scope="col" className="w-4/12">Form Name</th>
                    <th scope="col" className="w-2/12">Published Date</th>
                    <th scope="col" className="w-1/12">Total</th>
                    <th scope="col" className="w-1/12">Class</th>
                    <th scope="col" className="w-1/12">Result</th>
                    <th scope="col" className="w-1/12">Rank</th>
                    <th scope="col" className="w-1/12">Predikat</th>
                    </tr>
                </thead>
                <tbody className="align-middle text-blue-900 font-normal">
                {edomData.length > 0 ? (
                    edomData.map((data, index) => (
                        <tr className="border border-y-slate-600 h-8" key={index}>
                            <td>{index + 1}</td>
                            <td className="text-left">{data.name_form}</td>
                            <td>{data.last_published}</td>
                            <td>{data.total}</td>
                            <td>{data.class}</td>
                            <td>{data.result}</td>
                            <td>{data.rank}</td>
                            <td>{data.predikat}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No data available</td>
                    </tr>
                )}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </>
    );
}
