import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function FormOpen() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const user_id = logged_data ? logged_data.user_id : null;
    
    const className = logged_data.class;
    const userName = logged_data.username;

    const [error, setError] = useState([]);
    const [paramDetail, setParameterDetail] = useState([]);
    const [paramName, setParameterName] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [response, setResponse] = useState({});
    const [prevPage, setPrevPage] = useState(['0']);
    const [currentPage, setCurrentPage] = useState('1');
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
        if (user_id) {
            getParameterDetail(user_id).then((detail) => { 
                if (detail.length > 0) {
                    getParameterName(detail).then((names) => { 
                        setParameterName(names);
                    });
                }
            }).catch(error => { 
                console.error("Error fetching parameter details:", error);
            });
        }
        getFormDetail();
    }, [user_id, id]);

    useEffect(() => {
        if (formDetail.section.length > 0) {
            const maxSection = Math.max(...formDetail.section.map(s => parseInt(s)));
            setTotalPages(maxSection);
        }
    }, [formDetail]);

    function getFormDetail() {
        axios.get(`http://localhost/timetofill/form.php?form_id=${id}`)
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

    async function getParameterDetail(user_id) {
        try {
            const response = await axios.get(`http://localhost/timetofill/parameter.php?user_id=${user_id}`);
            if (logged_data['category'] === "Mahasiswa") {
                const valuesArray = Object.values(response.data);
                setParameterDetail(valuesArray);
                return valuesArray; 
            } else if (logged_data['category'] === "Dosen") {
                const classesArray = response.data.classes.split(',').map(item => item.trim());
                setParameterDetail(classesArray);
                return classesArray;
            }
        } catch (error) {
            console.error("Error fetching parameter details:", error);
            return [];
        }
    }

    async function getParameterName(paramDetail) {
        try {
            const names = await Promise.all(paramDetail.map(async (p) => {
                const response = await axios.get(`http://localhost/timetofill/parameter.php?p=${p}`);
                return response.data.name;
            }));
            setParameterName(names);
            return names;
        } catch (error) {
            console.error("Error fetching parameter names:", error);
            return []; 
        }
    }

    const handleChange = (e) => {
        setError("");
        const { name, value, type, checked } = e.target;
    
        setResponse(prevResponse => ({
            ...prevResponse,
            [name]: type === "checkbox" ? (checked ? [...(prevResponse[name] || []), value] : (prevResponse[name] || []).filter(item => item !== value)) : value,
        }));
    };
    
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const questionsForCurrentPage = formDetail.question.filter((q, index) => formDetail.section[index] == currentPage);
        const answer = Object.values(response);
        const resSubmit = [id, className, userName, answer];
        
        let allFilled = true;
        questionsForCurrentPage.forEach((q) => {
            if (!response[q[0]]) {
                allFilled = false;
            }
        });
        
        if (allFilled) {
            if (currentPage === totalPages) {
                axios.post(`http://localhost/timetofill/response.php/`, JSON.stringify(resSubmit))
                .then(function (response) {
                    console.log(response.data);
                    //backToHomePage(); 
                })
                .catch(function (error) {
                    console.error("There was an error!", error);
                });
                console.log("Data Berhasil Disimpan");
                console.log(resSubmit);
                //backToHomePage();
            }
        } else {
            setError("Semua input harus diisi sebelum disimpan.");
        }
        
        console.log(questionsForCurrentPage);
        console.log(response);
    };

    const handleNext = () => {
        setPrevPage([
            ...prevPage,
            currentPage
        ])
        const questionsForCurrentPage = formDetail.question.filter((q, index) => formDetail.section[index] == currentPage);
        var getLengthResponse = Object.keys(response).length;
        var getValueResponse = Object.values(response)

        let allFilled = true;
        questionsForCurrentPage.forEach((q) => {
            if (!response[q[0]]) {
                allFilled = false;
            }
        });

        if (allFilled) {
            if (currentPage < totalPages) {
                if(formDetail.section_rule[currentPage - 1].length > 1){
                    if(getValueResponse[getLengthResponse - 1] === 'Ya'){
                        setCurrentPage(formDetail.section_rule[currentPage - 1][0]);
                    } else {
                        setCurrentPage(formDetail.section_rule[currentPage - 1][1]);
                    }
                } else {
                    setCurrentPage(formDetail.section_rule[currentPage - 1][0]);
                }
            }
        } else {
            setError("Semua input harus diisi sebelum melanjutkan.");
        }
    };

    const handlePrevious = () => {
        setError("");
        console.log(prevPage)

        if (prevPage.length !== 1) {
            setCurrentPage(prevPage[prevPage.length-1])
            prevPage.splice(-1,1)
        } else {
            setCurrentPage(1)
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
                                    setResponse={setResponse}
                                    paramDetail={paramDetail}
                                    paramName={paramName}
                                    setError={setError}
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

function Question({ index, quest, type, parameter, handleChange, paramDetail, paramName, response, setResponse, setError }) {
    const subQuestions = quest.slice(1);
    const subQtypes = type[index].slice(1);

    const handleInputChange = (e) => {
        const { name, value, checked, type: inputType } = e.target;
    
        if (inputType === 'checkbox') {
            // Pastikan response[name] adalah array
            const currentValues = Array.isArray(response[name]) ? response[name] : [];
            
            const newValue = checked
                ? [...currentValues, value] // Tambah value ke array jika dicentang
                : currentValues.filter(item => item !== value); // Hapus value dari array jika tidak dicentang
    
            // Update state langsung di sini
            setResponse(prevResponse => ({
                ...prevResponse,
                [name]: newValue
            }));
        } else {
            handleChange(e);
        }
    };
    
    const handleMultiRatingChange = (param, subIndex, value) => {
        setError("");
        setResponse(prevResponse => {
            // Buat salinan dari array sebelumnya atau inisialisasi dengan array kosong
            const currentResponses = prevResponse[`${param} ${quest[0]}`] || Array(subQuestions.length).fill('');
            
            // Update nilai pada index yang sesuai
            const updatedResponses = [...currentResponses];
            updatedResponses[subIndex] = value;
            
            return {
                ...prevResponse,
                [`${param} ${quest[0]}`]: updatedResponses
            };
        });
    };
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
                                <input 
                                    type="radio"
                                    name={quest[0]} 
                                    onChange={handleChange} 
                                    value="Sangat Baik" 
                                    checked={response[quest[0]] === 'Sangat Baik'} 
                                /> Sangat Baik
                            </label>
                            <label className="px-4">
                                <input 
                                    type="radio" 
                                    name={quest[0]} 
                                    onChange={handleChange} 
                                    value="Baik" 
                                    checked={response[quest[0]] === 'Baik'} 
                                /> Baik
                            </label>
                            <label className="px-4">
                                <input 
                                    type="radio" 
                                    name={quest[0]} 
                                    onChange={handleChange} 
                                    value="Cukup"
                                    checked={response[quest[0]] === 'Cukup'}  
                                /> Cukup
                            </label>
                            <label className="px-4">
                                <input 
                                    type="radio" 
                                    name={quest[0]} 
                                    onChange={handleChange} 
                                    value="Kurang" 
                                    checked={response[quest[0]] === 'Kurang'}
                                /> Kurang
                            </label>
                            <label className="px-4">
                                <input 
                                    type="radio" 
                                    name={quest[0]} 
                                    onChange={handleChange} 
                                    value="Sangat Kurang"
                                    checked={response[quest[0]] === 'Sangat Kurang'} 
                                /> Sangat Kurang
                            </label>
                        </div>
                    ) : type[index][0] === "checkbox" ? (
                        <div>
                            {subQtypes.map((subType, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                    <input 
                                        key={subIndex}
                                        type={type[index][0]} 
                                        name={quest[0]}
                                        id={subType}
                                        onChange={handleInputChange}
                                        value={subType}
                                        checked={(Array.isArray(response[quest[0]]) && response[quest[0]].includes(subType))}
                                    />
                                    <label htmlFor={subType} className="px-4">{subType}</label>
                                </div>
                            ))}
                        </div>
                    ) : type[index][0] === "radio" ? (
                        <div>
                            {subQtypes.map((subType, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                    <input 
                                        key={subIndex}
                                        type={type[index][0]} 
                                        name={quest[0]}
                                        id={subType}
                                        onChange={handleInputChange}
                                        value={subType}
                                        checked={response[quest[0]] === subType}
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
                                                value={response[`${param} ${quest[0]}`]?.[subIndex] || ''}
                                                onChange={(e) => handleMultiRatingChange(param, subIndex, e.target.value)}
                                            >
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
