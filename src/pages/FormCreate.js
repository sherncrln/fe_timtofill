import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import deleteQ from "../assets/deleteform.png";

export default function FormCreate() {
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const [formDetail, setFormDetail] = useState({
        name_form: "",
        status_form: "",
        show_username: "",
        respondent: "",
        description: "",
        question: [],
        qtype: [],
    });

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
            question: [...prevState.question, ""],
            qtype: [...prevState.qtype, ""]
        }));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...formDetail.question];
        newQuestions[index] = value;
        setFormDetail({ ...formDetail, question: newQuestions });
    };

    const handleQTypeChange = (index, value) => {
        const newQTypes = [...formDetail.qtype];
        newQTypes[index] = value;
        setFormDetail({ ...formDetail, qtype: newQTypes });
    };

    const deleteQuestion = (index) => {
        const newQuestions = formDetail.question.filter((_, i) => i !== index);
        const newQTypes = formDetail.qtype.filter((_, i) => i !== index);
        setFormDetail({ ...formDetail, question: newQuestions, qtype: newQTypes });
    };

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
                                className="w-3/4 h-12 py-4 text-3xl text-blue-800 font-semibold tracking-widest bg-transparent text-wrap focus:bg-blue-100" 
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md" 
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md" 
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
                                    className="px-2 py-1 text-grey-200 bg-blue-200 rounded-r-md" 
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
                                    handleQuestionChange={handleQuestionChange}
                                    handleQTypeChange={handleQTypeChange}
                                    deleteQuestion={deleteQuestion}
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

function Question({ index, question, qtype, handleQuestionChange, handleQTypeChange, deleteQuestion }) {
    return (
        <div className="mb-4">
            <div className="w-full flex row bg-blue-200 rounded-t-md">
                <input 
                    type="text" 
                    id={`question_header_${index}`}
                    name={`question_header_${index}`}
                    placeholder="Header"
                    className="w-3/5 pl-8 py-2 text-lg text-blue-800 font-semibold tracking-widest bg-transparent" 
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                />
                <select  
                    id={`qtype_${index}`}
                    name={`qtype_${index}`}
                    className="w-1/5 px-2 py-1 mr-44 text-grey-200 text-blue-800 font-semibold tracking-widest bg-transparent" 
                    value={qtype}
                    onChange={(e) => handleQTypeChange(index, e.target.value)}
                >
                    <option value="">Choose Question Type</option>
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="date">Date</option>
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
            <div className="w-full flex row bg-[#f8fafc] rounded-b-md shadow-sm ">
                <input 
                    type="text" 
                    id={`question_text_${index}`}
                    name={`question_text_${index}`}
                    placeholder="Question"
                    className="w-3/5 pl-8 py-2 text-sm text-blue-800 font-semibold bg-transparent" 
                />
            </div>
        </div>
    );
}
