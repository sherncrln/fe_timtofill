import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import formpic from "../assets/formlist.png";
import openform from "../assets/openform.png";
import editform from "../assets/editform.png";
import deleteform from "../assets/deleteform.png";
import duplicateform from "../assets/duplicateform.png";

export default function FormList() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const scrollContainerRef = React.useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    };

    const [formList, setFormList] = useState([]);
    const navigate = useNavigate();
  
    useEffect( () => {
        getFormList();
    }, []);
  
    function getFormList(){
        axios.get('http://localhost/timetofill/form.php')
        .then(function(response) {
            let filteredForms = response.data;
            if (logged_data['category'] === "Mahasiswa") {
                filteredForms = filteredForms.filter(form => form.respondent === "Mahasiswa" || form.respondent === "Semua");
            } else if (logged_data['category'] === "Dosen") {
                filteredForms = filteredForms.filter(form => form.respondent === "Dosen" || form.respondent === "Semua");
            } else if (logged_data['category'] === "Staff") {
                filteredForms = filteredForms.filter(form => form.respondent === "Staff" || form.respondent === "Semua");
            }
            setFormList(filteredForms);
        });
      
  }

    return (
        <div className="relative max-w-full mt-8">
            {/* Button for scrolling left */}
            <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 focus:outline-none">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>

            {/* Scrollable card container */}
            <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto scrollbar-hide flex-nowrap">
                {formList.map((formList, index) => (
                    <div key={index} className="min-w-[300px] bg-white shadow-md rounded-lg overflow-hidden">
                        <img src={formpic} alt={formList.form_id} className="w-full h-72 object-cover" />
                        <div className="p-4 flex-col">
                            <h3 className="text-lg text-blue-900 font-semibold line-clamp-2">{formList.name_form}</h3>
                            <p className="mt-2 text-gray-600 overflow-hidden line-clamp-1">{formList.description}.</p>
                            <div className="flex mt-2 space-x-4 items-center justify-center">
                                {logged_data && logged_data['category'] === "Admin" ? (
                                    <>
                                    <img className="size-10 cursor-pointer" src={deleteform} alt="deleteform" />
                                    <Link to={`/form/${formList.form_id}/edit`} > <img className="size-8 cursor-pointer" src={editform} alt="editform" /> </Link>
                                    <img className="size-8 cursor-pointer" src={duplicateform} alt="duplicateform" />
                                </>): 
                                <>
                                    <img className="size-8 cursor-pointer" src={openform} alt="openform" />
                                </>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Button for scrolling right */}
            <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 focus:outline-none">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
    );
};