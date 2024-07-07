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
    const [formList, setFormList] = useState([]);
    const navigate = useNavigate();
    const [popupDeleteVisible, setPopupDeleteVisible] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);
    const [popupDuplicateVisible, setPopupDuplicateVisible] = useState(false);
    const [formToDuplicate, setFormToDuplicate] = useState(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            left: -200,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    };

  
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

    const openPopupDelete = (form_id) => {
        setFormToDelete(form_id);
        setPopupDeleteVisible(true);
    };

    const closePopupDelete = () => {
        setPopupDeleteVisible(false);
        setFormToDelete(null);
    };

    const deleteForm = () => {
        console.log(formToDelete);
        if (formToDelete) {
            axios.delete(`http://localhost/timetofill/form.php?form_id=${formToDelete}`)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 1) {
                    getFormList();
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
                closePopupDelete();
            })
            .catch(error => {
                console.error("There was an error deleting the form!", error);
                closePopupDelete();
            });
        }
    };
    
    const openPopupDuplicate = (form_id) => {
        setFormToDuplicate(form_id);
        setPopupDuplicateVisible(true);
    };

    const closePopupDuplicate = () => {
        setPopupDuplicateVisible(false);
        setFormToDuplicate(null);
    };

    const duplicateForm = () => {
        console.log(formToDuplicate);
        if (formToDuplicate) {
            axios.post(`http://localhost/timetofill/form.php?form_id=${formToDuplicate}`)
            .then(response => {
                console.log(response.data);
                if (response.data.status === 1) {
                    getFormList();
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
                closePopupDuplicate();
            })
            .catch(error => {
                console.error("There was an error duplicating the form!", error);
                closePopupDuplicate();
            });
        }
    };

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
                                    <img className="size-10 cursor-pointer" src={deleteform} alt="deleteform" onClick={() => openPopupDelete(formList.form_id)} />
                                    <Link to={`/form/${formList.form_id}/edit`} > <img className="size-8 cursor-pointer" src={editform} alt="editform" /> </Link>
                                    <img className="size-8 cursor-pointer" src={duplicateform} alt="duplicateform" onClick={() => openPopupDuplicate(formList.form_id)} />
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

            {/* Popup konfirmasi hapus */}
            {popupDeleteVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-blue-100 items-center justify-center rounded shadow-md max-w-md w-full">
                        <h2 className="text-lg px-12 pt-4 font-semibold align-center">Are you sure you want to delete this form?</h2>
                        <div className="flex my-4 justify-center space-x-4">
                            <button onClick={closePopupDelete} className="w-24 bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">No</button>
                            <button onClick={deleteForm} className="w-24 bg-[#577BC1] hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Yes</button>
                        </div>
                        <div className="w-full bg-blue-300 px-12 py-2"><p className="text-gray-900 font-semibold">WARNING: The response history will be deleted</p></div>
                    </div>
                </div>
            )}

            {/* Popup konfirmasi hapus */}
            {popupDuplicateVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-blue-100 items-center justify-center rounded shadow-md max-w-md w-full">
                        <h2 className="text-lg px-8 pt-4 font-semibold align-center">Are you sure you want to Duplicate this form?</h2>
                        <div className="flex my-4 justify-center space-x-4">
                            <button onClick={closePopupDuplicate} className="w-24 bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">No</button>
                            <button onClick={duplicateForm} className="w-24 bg-[#577BC1] hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Yes</button>
                        </div>
                        <div className="w-full bg-blue-300 px-6 py-2"><p className="text-gray-900 font-semibold">WARNING: The response history will not be duplicated</p></div>
                    </div>
                </div>
            )}

        </div>
    );
};