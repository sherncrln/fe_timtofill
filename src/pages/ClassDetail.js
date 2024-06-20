import {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams  } from "react-router-dom";
import axios from "axios";

export default function ClassDetail() {
    const navigate = useNavigate();
    const [classData, setClassData] = useState([]);
    const {id} = useParams();
    const [dosen, setDosen] = useState([]);

    const backToClassPage = () => {
        navigate('/class');
    };
    
    useEffect( () => {
        getClassData();
        getDosenList();
    }, []);
    
    function getClassData(){
        axios.get(`http://localhost/timetofill/class.php?class_id=${id}`, classData).then(function(response){
            setClassData(response.data);
        });
        
    }
    
    function getDosenList(){
        axios.get(`http://localhost/timetofill/dosen.php`).then(function(response){
            setDosen(response.data);
        });
        
    }
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setClassData(values => ({...values, [name]: value}));
    }
    
    const handleSubmit = (event)=>{
        event.preventDefault();
        // axios.put(`http://localhost/timetofill/users.php/${id}`, JSON.stringify(classData))
        //     .then(function(response){
        //         console.log(response.data);
        //         setClassData(response.data);
        //         // backToClassPage();
        //     })
        //     .catch(function(error){
        //         console.error("There was an error!", error);
        //     });
    }

  return (
    <>
      <div>
        <NavBar />
        <p className="text-5xl text-blue-800 text-center tracking-widest mt-14 mb-6">Class Detail</p>
        <div className="w-full flex justify-center">
          <form className="flex justify-center mb-12" >
          <div className="w-1/2 flex mr-4">
              <div className= "w-72 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Class
                </label>
                <input
                    type="text"
                    className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="class"
                    name="class"
                    placeholder=""
                    value={classData.class}
                    onChange={handleChange}
                />
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Category
                </label>
                <input
                    type="text"
                    className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="category"
                    name="category"
                    placeholder=""
                    value={classData.category}
                    onChange={handleChange}
                />
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Semester
                </label>
                <input
                    type="number"
                    className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="semester"
                    name="semester"
                    placeholder=""
                    min="1" max="8"
                    value={classData.semester}
                    onChange={handleChange}
                />
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Valid From
                </label>
                <input
                    type="date"
                    className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="valid_from"
                    name="valid_from"
                    placeholder=""
                    value={classData.valid_from}
                    onChange={handleChange}
                />
            
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Valid To
                </label>
                <input
                    type="date"
                    className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="valid_to"
                    name="valid_to"
                    placeholder=""
                    value={classData.valid_to}
                    onChange={handleChange}
                />
              </div>
          </div>
          <div className="w-1/2 flex ml-2">
            <div className= "w-72 mb-2 ">
                {Array.from({ length: 6 }, (_, index) => (
                    <div key={index}>
                        <label className="text-sm text-blue-950 text-bold font-semibold">
                            Variable {index + 1}
                        </label>
                        <select
                            id={`variable_${index + 1}`}
                            name={`variable_${index + 1}`}
                            className="w-72 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                            value={classData[`variable_${index + 1}`] || ''}
                            onChange={handleChange}
                        >
                            <option value="">Select Dosen</option>
                            {dosen.map((d, id) => (
                                <option key={id} value={d.username}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
          </div>
          </form>
      </div >
      <div className= " w-full flex items-center justify-center mb-2 px-4 tracking-widest text-[#f8fafc]">
          <button className="w-28 h-8 rounded bg-[#577BC1] mr-6 ">Save</button>
          <button onClick={backToClassPage} className="w-32 h-8 rounded bg-[#577BC1] ">Back</button>
      </div>
      </div>
    </>
);
}