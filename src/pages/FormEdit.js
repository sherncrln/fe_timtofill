import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import deleteQ from "../assets/deleteform.png";

export default function FormEdit() {
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const [formDetail, setFormDetail] = useState({
        name_form: "",
        status_form: "",
        show_username: "",
        respondent: "",
        description: "",
        question: [{ header: "", text: [] }],
        qtype: [{ type: "", detail: [] }],
    });

    useEffect(() => {
        if (formDetail.respondent) {
            setFormDetail(prevState => {
                const newQtypes = prevState.qtype.map((qtype    ) => {
                    if (qtype.type === "multi-text" || qtype.type === "multi-rating") {
                        const newDetail = formDetail.respondent === "Mahasiswa" ? "Variable" : "Class";
                        return { ...qtype, detail: [newDetail] };
                    }
                    return qtype;
                });
                return { ...prevState, qtype: newQtypes };
            });
        }
    }, [formDetail.respondent]);
    

    const handleChange = (event) => {
        setError("");
        const name = event.target.name;
        const value = event.target.value;
        setFormDetail(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { name_form, status_form, show_username, respondent, description } = formDetail;

        if (!name_form || !status_form || !show_username || !respondent || !description) {
            setError("Please fill out all fields.");
        } else {
            console.log(formDetail);
        }
    };

    const addQuestion = () => {
        setFormDetail(prevState => ({
            ...prevState,
            question: [...prevState.question, { header: "", text: [] }],
            qtype: [...prevState.qtype, { type: "", detail: [] }]
        }));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...formDetail.question];
        newQuestions[index] = value;
        setFormDetail({ ...formDetail, question: newQuestions });
    };

    const handleQTypeChange = (index, type) => {
        const newQTypes = [...formDetail.qtype];
        if(type === "multi-rate" ||type === "multi-text"){
            if( formDetail.respondent === "Mahasiswa" ||formDetail.respondent === "Dosen"){
                newQTypes[index] = { ...newQTypes[index], type: type, detail: [] };
            }else{
                setError("For using multi-rate or multi-text, respondent must be 'Mahasiswa' or 'Dosen'");
            }
        }else{
            newQTypes[index] = { ...newQTypes[index], type: type, detail: [] };
        }
        setFormDetail({ ...formDetail, qtype: newQTypes });
    };

    const deleteQuestion = (index) => {
        const newQuestions = formDetail.question.filter((_, i) => i !== index);
        const newQTypes = formDetail.qtype.filter((_, i) => i !== index);
        setFormDetail({ ...formDetail, question: newQuestions, qtype: newQTypes });
    };

    const addOption = (index) => {
        console.log('addOption called for index:', index);
        setFormDetail(prevState => {
            const newQtypes = [...prevState.qtype];
            if (newQtypes[index] && Array.isArray(newQtypes[index].detail)) {
                newQtypes[index].detail.push("");
            } else {
                newQtypes[index] = { type: 'dropdown', detail: [""] };
            }
            return { ...prevState, qtype: newQtypes };
        });
    };
    
      const handleOptionChange = (index, optionIndex, value) => {
        setFormDetail(prevState => {
          const newQtypes = [...prevState.qtype];
          newQtypes[index].detail[optionIndex] = value;
          return { ...prevState, qtype: newQtypes };
        });
      };
    
      const deleteOption = (index, optionIndex) => {
        setFormDetail(prevState => {
          const newQtypes = [...prevState.qtype];
          newQtypes[index].detail = newQtypes[index].detail.filter((_, i) => i !== optionIndex);
          return { ...prevState, qtype: newQtypes };
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
                            /> 
                            <div className=" w-max-w-72 flex items-center gap-x-4 py-1 justify-end">
                                <button onClick={() => navigate('/home')} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
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
                            ></textarea>
                        </div>
                        <div className="w-screen px-20 py-2 flex flex-col justify-center">
                            {formDetail.question.map((q, index) => (
                                <Question
                                    key={index}
                                    index={index}
                                    question={q}
                                    qtype={formDetail.qtype[index]}
                                    parameter={formDetail.respondent}
                                    handleQuestionChange={handleQuestionChange}
                                    handleQTypeChange={handleQTypeChange}
                                    deleteQuestion={deleteQuestion}
                                    addOption={addOption} 
                                    deleteOption={deleteOption}
                                    handleOptionChange={handleOptionChange}
                                />
                            ))}
                        </div>
                        <div className="w-screen px-20 py-2 flex justify-center">
                            <button type="button" onClick={addQuestion} className="size-16 text-6xl pb-4 bg-[#f8fafc] flex items-center justify-center text-[#577BC1] rounded shadow-sm hover:text-blue-400 hover:bg-stone-100">+</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function Question({ index, question, qtype, parameter, handleQuestionChange, handleQTypeChange, handleOptionChange, addOption, deleteOption, deleteQuestion }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'header') {
            handleQuestionChange(index, { ...question, header: value });
        }
    };
    

    return (
        <div className="mb-4">
            <div className="w-full flex row bg-blue-200 rounded-t-md">
                <input 
                    type="text" 
                    placeholder="Header"
                    className="w-3/5 pl-8 py-2 text-lg text-blue-800 font-semibold tracking-widest bg-blue-200" 
                    value={question.header}
                    onChange={handleInputChange}
                    name="header"
                />
                <select  
                    id={`qtype_${index}`}
                    name={`qtype_${index}`}
                    className="w-1/5 px-2 py-1 mr-44 text-grey-200 text-blue-800 font-semibold tracking-widest bg-blue-200 cursor-pointer" 
                    value={qtype.type}
                    onChange={(e) => handleQTypeChange(index, e.target.value)}
                >
                    <option value="">Choose Question Type</option>
                    <option value="text">Text</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="check">Check Box</option>
                    <option value="radio">Radio Button</option>
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
            <div className="w-full flex row py-2 px-8 bg-[#f8fafc] rounded-b-md shadow-sm ">
                {qtype ? ( 
                    qtype.type === "text" ?(
                    <>
                        <input disabled
                            type="text" 
                            id="answer"
                            name="answer"
                            placeholder="Answer"
                            className="w-full px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                        />
                    </>
                    ): qtype.type === "date" ? (
                    <>
                        <input disabled
                            type="date" 
                            id="answer"
                            name="answer"
                            className="w-full px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                        />
                    </>
                    ): qtype.type === "dropdown" || qtype.type === "check"  || qtype.type === "radio" ? (
                    <>
                        <div className="w-full flex-row">
                        {qtype.detail && Array.isArray(qtype.detail) && qtype.detail.map((option, optIndex) => (
                            <div key={optIndex} className="w-full flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Option" 
                                    className="w-4/5 pl-8 py-2 text-sm text-blue-800 font-semibold bg-transparent" 
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                />
                                <button type="button" onClick={() => deleteOption(index, optIndex)} className="w-1/5 py-2 text-md text-red-800 font-semibold">(X)</button>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={() => addOption(index)} className="flex-end items-right w-40 py-2 text-md text-blue-800 font-semibold">+ Add Option</button>
                    </>
                    ) : qtype.type === "multi-text" ? (
                        <>
                            {parameter === "Mahasiswa" && (
                                <p name="multi-text" className="w-1/4 px-4 py-2 text-md text-blue-800 font-semibold bg-transparent"  >
                                    Parameter : Variable
                                </p>
                            )}
                            {parameter === "Dosen" && (
                                <p name="multi-text" className="w-1/4 px-4 py-2 text-md text-blue-800 font-semibold bg-transparent" >
                                    Parameter : Class
                                </p>
                            )}
                            <input
                                disabled
                                type="text"
                                id="multi-text"
                                name="multi-text"
                                className="w-3/4 px-4 py-2 text-md text-blue-800 font-semibold bg-slate-300" 
                            />  
                        </>
                    ) : qtype.type === "multi-rating" ? (
                        <>
                            <input
                                type="text" 
                                id={`question_text_${index}`}
                                name={`question_text_${index}`}
                                placeholder="Multi-Rating Question"
                                className="w-2/5 px-4 py-2 text-md text-blue-800 font-semibold bg-transparent" 
                            />
                            <select  
                                id="answer"
                                name="answer"
                                className="w-3/5 px-4 py-2 text-md text-blue-800 font-semibold bg-transparent cursor-pointer"
                            >
                                <option value="">Choose Parameter</option>
                                <option value="variable">Variable</option>
                                <option value="class">Class</option>
                            </select>
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
