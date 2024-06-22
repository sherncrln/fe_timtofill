import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function FormCreate() {
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const [formDetail, setFormDetail] = useState({
        name_form: "",
        status_form: "",
        show_username: "",
        respondent: "",
        description: ""
    });

    // useEffect( () => {
        
    // }, []);

    const handleChange = (event) => {
        setError("");
        const name = event.target.name;
        const value = event.target.value;
        setFormDetail(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event)=>{
        event.preventDefault();
        const { name_form, status_form, show_username, respondent, description } = formDetail;

        // Validasi untuk memastikan semua field terisi
        if (!name_form || !status_form || !show_username || !respondent || !description) {
            setError("Please fill out all fields.");
        } else {
            console.log(formDetail);
            // Lanjutkan dengan logika lain yang diperlukan (misalnya mengirim data ke server)
        }
    }

  return (
    <>
      <div className="w-screen h-auto">
        <NavBar />
        <div className="flex flex-col">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between w-screen px-20 my-8">
                    <input 
                        type="text" 
                        id="name_form"
                        name="name_form"
                        placeholder="Input Form Name"
                        className="w-3/4  h-12 py-4 text-3xl text-blue-800 font-semibold tracking-widest bg-transparent text-wrap focus:bg-blue-100" 
                        onChange={handleChange}
                        /> 
                    <div className=" w-max-w-72 flex items-center gap-x-4 py-1 justify-end">
                    <button onClick={() => {navigate('/home')}} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm  text-[#f8fafc]">Back</button>
                    <button type="submit" className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Save</button>
                    </div>
                </div>
                {error && <span className="w-screen px-20 my-2 text-red-500 font-bold">{error}</span>}
                <div className="flex flex-row gap-x-4 items-center justify-start w-screen px-20 py-2 bg-transparent">
                    <div className="">
                        <label className="px-2 py-1 text-blue-900 bg-white rounded-l-md">
                            Status
                        </label>
                        <select  
                        id="status_form"
                        name="status_form"
                        className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md " 
                        onChange={handleChange}
                        >
                        <option selected>Set Status</option>
                        <option value="Active">Active</option>
                        <option value="Non Active">Non Active</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="px-2 py-1 text-blue-900 bg-white rounded-l-md">
                            Result Show Username
                        </label>
                        <select  
                        id="show_username"
                        name="show_username"
                        className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md " 
                        onChange={handleChange}
                        >
                        <option selected>Set Result</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="px-2 py-1 text-blue-900 bg-white rounded-l-md">
                            Respondent
                        </label>
                        <select  
                        id="respondent"
                        name="respondent"
                        className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md " 
                        onChange={handleChange}
                        >
                        <option selected>Choose Respondent</option>
                        <option value="Semua">Semua</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Dosen">Dosen</option>
                        <option value="Staff">Staff</option>
                        </select>
                    </div>
                </div>
                <div className="w-screen px-20 py-2">
                    <textarea
                        id="description"
                        name="description"
                        className="w-full max-h-48 py-2 px-4 bg-blue-200 placeholder-gray-700 rounded"
                        rows="4"
                        placeholder="Deskripsi formulir"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="w-screen px-20 py-2">
                    <button className="size-16 text-6xl pb-4 bg-[#f8fafc] flex items-center justify-center text-[#577BC1] rounded">+</button>
                </div>
            </form>
        </div>
      </div>
    </>
  );
}