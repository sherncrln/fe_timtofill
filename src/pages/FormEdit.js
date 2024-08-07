import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SectionEdit from "../components/SectionEdit";
import deleteQ from "../assets/deleteform.png";
import axios from "axios";

export default function FormCreate2() {
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const {id} = useParams();
    const [isSectionSetVisible, setIsSectionSetVisible] = useState(false);
    const [formDetail, setFormDetail] = useState({
        form_id: id,
        name_form: "",
        status_form: "",
        show_username: "",
        respondent: "",
        description: "",
        question: [],
        qtype: [],
        section : [],
        section_rule : []
    });
    
    const backToHomePage = () => {
        navigate('/home');
    };

    useEffect( () => {
        getFormDetail();
    }, []);
    
    function getFormDetail(){
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
    
    const handleChange = (event) => {
        setError("");
        const name = event.target.name;
        const value = event.target.value;
        setFormDetail(values => ({ ...values, [name]: value }));
    };

    const handleSectionSetClose = (newSection, newSectionRule) => {
        if (newSection && newSectionRule) {
            setFormDetail(prevState => {
                const updatedFormDetail = {
                    ...prevState,
                    section: newSection,
                    section_rule: newSectionRule
                };
                console.log("Updated formDetail inside setState:", updatedFormDetail);
                
                axios.put(`http://localhost/timetofill/form.php/${id}`, JSON.stringify(updatedFormDetail))
                .then(function(response){
                    console.log(response.data);                
                    backToHomePage();
                })
                .catch(function(error){
                    console.error("There was an error!", error);
                });

                return updatedFormDetail;
            });

            console.log(newSection);
            console.log(newSectionRule);
            
            
        }
        setIsSectionSetVisible(false);
    }
            
    const handleSubmit = (event) => {
        event.preventDefault();
        const { name_form, status_form, show_username, respondent, description, question, qtype } = formDetail;

        
        if (!name_form || !status_form || !show_username || !respondent || !description || question.length === 0 || qtype.length === 0) {
            setError("Please fill out all fields.");
        } else {
            setIsSectionSetVisible(true);
        }
    };

    const addQuestion = () => {
        setFormDetail(prevState => ({
            ...prevState,
            question: [...prevState.question, []],
            qtype: [...prevState.qtype, []]
        }));
    };

    const handleQuestionChange = (index, value) => {
        setFormDetail(prevState => {
            const newQuestions = [...prevState.question];
            newQuestions[index][0] = value;
            return { ...prevState, question: newQuestions };
        });
    };
    
    const handleQTypeChange = (index, value) => {
        if (!formDetail.respondent && (value === "multi-text" || value === "multi-rating")) {
            setError("Please select Respondent before choosing Multi-Text or Multi-Rating.");
            return;
        }

        setFormDetail(prevState => {
            const newQTypes = [...prevState.qtype];
            newQTypes[index][0] = value;
            return { ...prevState, qtype: newQTypes };
        });
        console.log(formDetail);
    };

    const handleSubQuestionChange = (qIndex, subIndex, value) => {
        setFormDetail(prevState => {
            const newSubQuestions = [...prevState.question];
            newSubQuestions[qIndex][subIndex+1] = value;
            return { ...prevState, question: newSubQuestions };
        });
    };

    const handleSubQtypeChange = (qIndex, subIndex, value) => {
        setFormDetail(prevState => {
            const newSubQtypes = [...prevState.qtype];
            newSubQtypes[qIndex][subIndex+1] = value;
            return { ...prevState, qtype: newSubQtypes };
        });
    };

    const deleteQuestion = (index) => {
        const newQuestions = [...formDetail.question];
        const newQTypes = [...formDetail.qtype];
    
        newQuestions.splice(index, 1);
        newQTypes.splice(index, 1);
    
        setFormDetail({
            ...formDetail,
            question: newQuestions,
            qtype: newQTypes
        });
    };


    return (
        <>
            <div className="w-screen h-full bg-blue-100">
                <NavBar />
                <div className="flex flex-col">
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between w-screen px-20 my-8">
                            <input 
                                type="text" 
                                id="name_form"
                                name="name_form"
                                placeholder="Input Form Name"
                                className="w-3/4 h-12 py-4 text-3xl text-blue-800 font-semibold tracking-widest bg-transparent text-wrap" 
                                onChange={handleChange}
                                value={formDetail.name_form}
                            /> 
                            <div className=" w-max-w-72 flex items-center gap-x-4 py-1 justify-end">
                                <button onClick={backToHomePage} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md cursor-pointer" 
                                    onChange={handleChange}
                                    value={formDetail.status_form}
                                >
                                    <option value="">Set Status</option>
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md cursor-pointer" 
                                    onChange={handleChange}
                                    value={formDetail.show_username}
                                >
                                    <option value="">Set Result</option>
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md cursor-pointer" 
                                    onChange={handleChange}
                                    value={formDetail.respondent}
                                >
                                    <option value="">Choose Respondent</option>
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
                                className="w-full max-h-48 py-2 px-4 bg-blue-200 placeholder-gray-700 rounded shadow-sm"
                                rows="4"
                                placeholder="Deskripsi formulir"
                                onChange={handleChange}
                                value={formDetail.description}
                            ></textarea>
                        </div>
                        <div className="w-screen px-20 py-2 flex flex-col justify-center">
                            {formDetail.question.map((q, index) => (
                                <Question
                                    key={index}
                                    index={index}
                                    quest={q}
                                    type={formDetail.qtype}
                                    parameter={formDetail.respondent}
                                    handleQuestionChange={handleQuestionChange}
                                    handleQTypeChange={handleQTypeChange}
                                    deleteQuestion={deleteQuestion}
                                    handleSubQuestionChange={handleSubQuestionChange}
                                    handleSubQtypeChange={handleSubQtypeChange}
                                />
                            ))}
                        </div>
                        <div className="w-screen px-20 py-2 flex justify-center">
                            <button type="button" onClick={addQuestion} className="size-16 text-6xl pb-4 bg-[#f8fafc] flex items-center justify-center text-[#577BC1] rounded shadow-sm hover:text-blue-400 hover:bg-stone-100">+</button>
                        </div>
                    </form>
                </div>
                {isSectionSetVisible && (
                    <SectionEdit formDetail={formDetail} onClose={handleSectionSetClose} sec={formDetail.section} secr={formDetail.section_rule} />
                )}
            </div>
        </>
    );
}

function Question({ index, quest, type, parameter, handleQuestionChange, handleQTypeChange, handleSubQuestionChange, handleSubQtypeChange, deleteQuestion}) {
    const [subQuestions, setSubQuestions] = useState(quest.slice(1));
    const [subQtypes, setSubQtypes] = useState(type[index].slice(1));

    const addQuestOption = () => {
        setSubQuestions([...subQuestions, ""]);
    };

    const handleSubQuestChange = (subIndex, value) => {
        handleSubQuestionChange(index, subIndex, value);
        const newSubQuestions = [...subQuestions];
        newSubQuestions[subIndex] = value;
        setSubQuestions(newSubQuestions);
    };

    const deleteQuestOption = (subIndex) => {
        const newSubQuestions = subQuestions.filter((_, idx) => idx !== subIndex);
        setSubQuestions(newSubQuestions);
        handleSubQuestionChange(index, subIndex, null); 
    };

    const addTypeOption = () => {
        setSubQtypes([...subQtypes, ""]);
    };
    
    const handleSubTypeChange = (subIndex, value) => {
        handleSubQtypeChange(index, subIndex, value);
        const newSubQtype = [...subQtypes];
        newSubQtype[subIndex] = value;
        setSubQtypes(newSubQtype);
    };

    const deleteTypeOption = (subIndex) => {
        const newSubQtype = subQtypes.filter((_, idx) => idx !== subIndex);
        setSubQtypes(newSubQtype);
        handleSubQtypeChange(index, subIndex, null); 
    };

    return (
        <div className="mb-4">
            <div className="w-full flex row bg-blue-200 rounded-t-md">
                <input 
                    type="text" 
                    placeholder="Header"
                    className="w-3/5 pl-8 py-2 text-lg text-blue-800 font-semibold tracking-widest bg-blue-200" 
                    value={quest[0]}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    name="question"
                />
                <select  
                    name="type"
                    className="w-1/5 px-2 py-1 mr-44 text-grey-200 text-blue-800 font-semibold tracking-widest bg-blue-200 cursor-pointer" 
                    value={type[index][0]}
                    onChange={(e) => handleQTypeChange(index, e.target.value)}
                >
                    <option value="">Choose Question Type</option>
                    <option value="text">Text</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="checkbox">Check Box</option>
                    <option value="radio">Radio Button</option>
                    <option value="radio-rating">Rating Button</option>
                    <option value="multi-text">Multi-Text</option>
                    <option value="multi-rating">Multi-Rating</option>
                </select>
                <img
                    className="size-8 cursor-pointer flex items-center mt-2"
                    src={deleteQ}
                    alt="deletequestion"
                    onClick={() => deleteQuestion(index)}
                />
            </div>
            <div className="w-full flex-row py-2 px-8 bg-[#f8fafc] rounded-b-md shadow-sm ">
                {type[index][0] ? ( 
                    type[index][0] === "text" ?(
                    <>
                        <input disabled
                            type="text" 
                            id="answer"
                            name="answer"
                            placeholder="Answer"
                            className="w-full px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                        />
                    </>
                    ): type[index][0] === "date" ? (
                    <>
                        <input disabled
                            type="date" 
                            id="answer"
                            name="answer"
                            className="w-full px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                        />
                    </>
                    ): type[index][0] === "radio-rating" ? (
                    <>
                        <input disabled
                            type="text" 
                            id="answer"
                            name="answer"
                            placeholder="Rating Button"
                            className="w-full px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                        />
                    </>
                    ): type[index][0] === "dropdown" || type[index][0] === "checkbox"  || type[index][0] === "radio" ? (
                    <>
                        <div>
                        {subQtypes.map((subType, subIndex) => (
                            <div key={subIndex} className="flex-col">
                            <input
                                type="text" 
                                name={`subType-${subIndex}`}
                                placeholder={`Sub Type ${subIndex + 1}`}
                                className="w-11/12 pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent" 
                                value={subType}
                                onChange={(e) => handleSubTypeChange(subIndex, e.target.value)}
                            />
                            <button
                                type="button"
                                className="w-10 ml-2 text-red-500 hover:text-red-700"
                                onClick={() => deleteTypeOption(subIndex)}
                            >
                                Delete
                            </button>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addTypeOption} className="w-full size-8 text-md px-4 py-2 bg-[#f8fafc] flex items-center justify-center text-[#577BC1] rounded shadow-sm hover:text-blue-400 hover:bg-stone-100">Add Option</button>
                    </>
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
                            />  
                        </div>
                    ) : type[index][0] === "multi-rating" ? (
                        <>                        
                            <div className="justify-center items-center">
                            {(parameter === "Mahasiswa" || parameter === "Dosen") && (
                                <p name="multi-text" className="w-1/4 px-4 py-2 text-md text-gray-600 font-semibold bg-transparent">
                                    Parameter : {parameter === "Mahasiswa" ? "Variable" : "Class"}
                                    
                                </p>
                            )}
                            {subQuestions.map((subQuestion, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                <input 
                                    type="text" 
                                    name={`subquestion-${subIndex}`}
                                    placeholder={`Sub Question ${subIndex + 1}`}
                                    className="w-11/12 pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent" 
                                    value={subQuestion}
                                    onChange={(e) => handleSubQuestChange(subIndex, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="w-10 ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => deleteQuestOption(subIndex)}
                                >
                                    Delete
                                </button>
                                </div>
                            ))}
                            </div>
                            <button type="button" onClick={addQuestOption} className="px-4 py-2 w-full size-8 text-md bg-[#f8fafc] flex items-center justify-center text-[#577BC1] rounded shadow-sm hover:text-blue-400 hover:bg-stone-100">Add Sub Question</button>
                        </>
                    ) : <>
                        <input disabled
                            type="text" 
                            placeholder="Choose Question Type"
                            className="w-full pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent" 
                        />
                    </>
                ): <>
                    <input disabled
                        type="text" 
                        placeholder="No Question Type"
                        className="w-full pl-8 py-2 text-md text-blue-800 font-semibold bg-transparent" 
                    />
                </>}

            </div>
        </div>
    );
}
