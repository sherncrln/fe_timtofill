import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function FormOpen() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const user_id = logged_data ? logged_data.user_id : null;
    
    const [error, setError] = useState([]);
    const [paramDetail, setParameterDetail] = useState([]);
    const [paramName, setParameterName] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [response, setResponse] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formDetail, setFormDetail] = useState({
        form_id: id,
        name_form: "",
        status_form: "",
        show_username: "",
        respondent: "",
        description: "",
        question: [],
        qtype: [],
        section: [],
        section_rule: []
    });

    const backToHomePage = () => {
        navigate('/home');
    };

    useEffect(() => {
        getParameterDetail(user_id);
        getParameterName(paramDetail);
        getFormDetail();
        console.log(paramDetail);
    }, []);
    
    useEffect(() => {
        if (formDetail.section.length > 0) {
            const maxSection = Math.max(...formDetail.section.map(s => parseInt(s)));
            setTotalPages(maxSection);
        }
    }, [formDetail]);

    function getFormDetail() {
        axios.get(`http://localhost/timetofill/form.php?form_id=${id}`, formDetail)
        .then(function(response) {
            const { form_id, name_form, respondent, show_username, status_form, description, question, qtype, section, section_rule } = response.data;
            setFormDetail({
                form_id,
                name_form,
                respondent,
                show_username,
                status_form,
                description,
                question: JSON.parse(question),
                qtype: JSON.parse(qtype),
                section: JSON.parse(section),
                section_rule: JSON.parse(section_rule),
            });
        })
        .catch(function(error) {
            console.error("Error fetching form details:", error);
        });

    }

    function getParameterDetail(user_id) {
        axios.get(`http://localhost/timetofill/parameter.php?user_id=${user_id}`)
            .then(function(response) {
                if (logged_data['category'] === "Mahasiswa") {
                    const valuesArray = Object.values(response.data);
                    setParameterDetail(valuesArray);
                } else if (logged_data['category'] === "Dosen") {
                    const classesArray = response.data.classes.split(',').map(item => item.trim());
                    setParameterDetail(classesArray);
                }
            })
            .catch(function(error) {
                console.error("Error fetching parameter details:", error);
            });
    }

    async function getParameterName(paramDetail) {
        const names = await Promise.all(paramDetail.map(async (p) => {
            const response = await axios.get(`http://localhost/timetofill/parameter.php?p=${p}`);
            return response.data.name;
        }));
        setParameterName(names);
    }

    const handleChange = (event) => {
        setError("");
        const { name, value, type, checked } = event.target;

        setResponse((prevResponse) => ({
            ...prevResponse,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const resplen = Object.keys(response).length;   
        const questionsForCurrentPage = formDetail.question.filter((q, index) => formDetail.section[index] == currentPage);
        
        let allFilled = true;
        questionsForCurrentPage.forEach((q) => {
            if (!response[q[0]]) {
                allFilled = false;
            }
        });
        
        if (allFilled && resplen === formDetail.question.length) {
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                console.log("Data Berhasil Disimpan", response);
            }
        } else {
            setError("Semua input harus diisi sebelum disimpan.");
        }
        
        console.log(response);
    };

    const handleNext = () => {
        const questionsForCurrentPage = formDetail.question.filter((q, index) => formDetail.section[index] == currentPage);
        
        let allFilled = true;
        questionsForCurrentPage.forEach((q) => {
            if (!response[q[0]]) {
                allFilled = false;
            }
        });

        if (allFilled) {
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
            }
        } else {
            setError("Semua input harus diisi sebelum melanjutkan.");
        }
    };

    const handlePrevious = () => {
        setError("");
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const questionsForCurrentPage = formDetail.question.filter((q, index) => formDetail.section[index] == currentPage);
    const qtypeForCurrentPage = formDetail.qtype.filter((q, index) => formDetail.section[index] == currentPage);

    return (
        <>
            <div className="w-screen min-h-screen h-full">
                <NavBar />
                <div className="flex flex-col">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between w-screen px-20 mb-4 mt-8">
                            <h1 className="flex items-center w-10/12 h-20 text-3xl text-blue-800 font-semibold tracking-wider bg-transparent text-wrap">{formDetail.name_form}</h1>
                            <div className="w-2/12 flex items-center gap-x-4 justify-end">
                                <button onClick={backToHomePage} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
                                {/* <button type="submit" className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Save</button> */}
                            </div>
                        </div>
                        <div className="w-screen px-20 py-2">
                            <pre className="whitespace-pre-wrap w-full h-auto py-2 px-4 bg-blue-200 placeholder-black-700 rounded shadow-sm font-sans">{formDetail.description}</pre>
                        </div>
                        <div className="w-screen px-20 py-2 flex flex-col justify-center">
                            {questionsForCurrentPage.map((q, index) => (
                                <Question
                                    key={index}
                                    index={index}
                                    quest={q}
                                    type={qtypeForCurrentPage}
                                    parameter={formDetail.respondent}
                                    handleChange={handleChange}
                                    response={response}
                                    paramDetail={paramDetail}
                                    paramName={paramName}
                                />
                            ))}
                        </div>
                        {error && <span className="w-screen px-20 text-red-500 font-bold">{error}</span>}
                        <div className="flex justify-between w-screen px-20 mt-4 mb-8">
                            {currentPage > 1 && (
                                <button type="button" onClick={handlePrevious} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Previous</button>
                            )}
                            {currentPage < totalPages ? (
                                <button type="button" onClick={handleNext} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] ml-auto">Next</button>
                            ) : (
                                <button type="submit" className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc] ml-auto">Submit</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function Question({ index, quest, type, parameter, handleChange, paramDetail, paramName, response }) {
    const subQuestions = quest.slice(1);
    const subQtypes = type[index].slice(1);

    // useEffect(() => {
    //     console.log(subQuestions);
    //     console.log(subQtypes);
    // });

    return (
        <div className="mb-4">
            <div className="w-full flex row bg-blue-200 rounded-t-md">
                <p className="w-full pl-8 py-2 text-lg text-blue-800 font-semibold bg-blue-200 tracking-wider">{quest[0] || ""}</p>
            </div>
            <div className="w-full flex-row py-4 px-8 bg-[#f8fafc] rounded-b-md shadow-sm">
                {type[index][0] ? (
                    type[index][0] === "text" ? (
                        <input 
                            type="text" 
                            id="answer"
                            name={quest[0]}
                            placeholder="Answer"
                            className="w-full px-4 py-2 text-md font-semibold bg-transparent border-2 border-gray-300" 
                            onChange={handleChange}
                            value={response[quest[0]] || ""}
                        />
                    ) : type[index][0] === "date" ? (
                        <input 
                            type="date" 
                            id="answer"
                            name={quest[0]}
                            className="w-full px-4 py-2 text-md font-semibold bg-transparent border-2 border-gray-300" 
                            onChange={handleChange}
                            value={response[quest[0]] || ""}
                        />
                    ) : type[index][0] === "radio-rating" ? (
                        <div className="flex-col">
                            <label className="px-4">
                                <input type="radio" name={quest[0]} value="Sangat Baik" /> Sangat Baik
                            </label>
                            <label className="px-4">
                                <input type="radio" name={quest[0]} value="Baik" /> Baik
                            </label>
                            <label className="px-4">
                                <input type="radio" name={quest[0]} value="Cukup" /> Cukup
                            </label>
                            <label className="px-4">
                                <input type="radio" name={quest[0]} value="Kurang" /> Kurang
                            </label>
                            <label className="px-4">
                                <input type="radio" name={quest[0]} value="Sangat Kurang" /> Sangat Kurang
                            </label>
                        </div>
                    ) : type[index][0] === "checkbox" || type[index][0] === "radio" ? (
                        <div>
                            {subQtypes.map((subType, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                    <input 
                                        key={subIndex}
                                        type={type[index][0]} 
                                        name={quest[0]}
                                        id={subType}
                                        onChange={handleChange}
                                        value={subType}
                                        // checked={response[quest[0]] === subType || (Array.isArray(response[quest[0]]) && response[quest[0]].includes(subType))}
                                    />
                                    <label htmlFor={subType} className="px-4">{subType}</label>
                                </div>
                            ))}
                        </div>
                    ) : type[index][0] === "dropdown" ? (
                        <div>
                            <select  
                                name={quest[0]}
                                className="w-full px-2 py-2 mr-44 text-grey-200 font-semibold bg-transparent cursor-pointer"
                                onChange={handleChange}
                                value={response[quest[0]] || ""}
                            >
                                <option value="">Choose Answer</option>
                                {subQtypes.map((subType, subIndex) => (
                                    <option key={subIndex} value={subType}>{subType}</option>
                                ))}
                            </select>
                        </div>
                    ) : type[index][0] === "multi-text" ? (
                        <div className="flex flex-row">
                            {(parameter === "Mahasiswa" || parameter === "Dosen") && (
                                <p name="multi-text" className="w-1/4 px-4 py-2 text-md text-gray-600 font-semibold bg-transparent">
                                    Parameter : {parameter === "Mahasiswa" ? "Variable" : "Class"}
                                </p>
                            )}
                            <input
                                disabled
                                type="text"
                                id="multi-text"
                                name="multi-text"
                                className="w-3/4 px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                                onChange={handleChange}
                            />
                        </div>
                    ) : type[index][0] === "multi-rating" ? (
                        <div className="justify-center items-center">
                            <div className="flex flex-row pb-2">
                                <div className="w-6/12"></div>
                                {(parameter === "Mahasiswa") ? paramName.map((pname, index) => (
                                    <p key={index} name="multi-text" className="w-1/12 max-h-16 text-sm text-center font-semibold">{pname}</p>
                                )): (parameter === "Dosen") && paramDetail.map((param, index) => (
                                    <p key={index} name="multi-text" className="w-1/12 max-h-16 text-sm text-center font-semibold">{param}</p>
                                ))}    
                            </div>
                            {subQuestions.map((subQuestion, subIndex) => (
                                <div key={subIndex} className="flex w-full border-b border-gray-400">
                                    <div className="w-6/12">
                                        <p
                                            key={subIndex}
                                            className="py-2 max-h-16 text-sm text-blue-800 font-semibold bg-transparent"
                                        >{subQuestion || ""}</p>
                                    </div>
                                    <div className="w-6/12 flex justify-start items-center">
                                        {paramDetail.map((param, index) => (
                                            <select
                                                key={index}
                                                name={`${param} ${quest[0]}`} 
                                                className="w-1/6 py-2 text-sm "
                                                onChange={handleChange}>
                                                <option value="">Pilih</option>
                                                <option value="5">Sangat Baik</option>
                                                <option value="4">Baik</option>
                                                <option value="3">Cukup</option>
                                                <option value="2">Kurang</option>
                                                <option value="1">Sangat Kurang</option>
                                            </select>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <input disabled
                            type="text" 
                            placeholder="Choose Question Type"
                            className="w-full pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent"
                        />
                    )
                ) : (
                    <input disabled
                        type="text" 
                        placeholder="No Question Type"
                        className="w-full pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent"
                    />
                )}
            </div>
        </div>
    );
}
