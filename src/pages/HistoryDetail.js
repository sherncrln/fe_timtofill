import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

export default function HistoryDetail() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const user_id = logged_data ? logged_data.user_id : null;
    const username = logged_data ? logged_data.username : null;
    const className = logged_data.class;
    const userName = logged_data.username;

    const [error, setError] = useState([]);
    const [paramDetail, setParameterDetail] = useState([]);
    const [paramName, setParameterName] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [response, setResponse] = useState({});

    const backToHistoryList = () => {
        navigate('/history');
    };

    useEffect(() => {
        getResponseDetail();

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
    }, [username, id, user_id]);

    function getResponseDetail() {
        axios.get(`http://localhost/timetofill/response.php?response_id=${id}`)
        .then(function(response) {
            const { response_id, form_id, name_form, respondent, answer, description, question, qtype} = response.data;
            setResponse({
                response_id, 
                form_id,
                name_form,
                respondent,
                description,
                answer: JSON.parse(answer),
                question: JSON.parse(question),
                qtype: JSON.parse(qtype),
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

    return (
        <>
            <div className="w-screen min-h-screen h-full">
                <NavBar />
                <div className="flex flex-col">
                    <form>
                        <div className="flex justify-between w-screen px-20 mb-4 mt-8">
                            <h1 className="flex items-center w-10/12 h-20 text-3xl text-blue-800 font-semibold tracking-wider bg-transparent text-wrap">{response.name_form}</h1>
                            <div className="w-2/12 flex items-center gap-x-4 justify-end">
                                <button onClick={backToHistoryList} className="w-32 h-8 rounded bg-[#577BC1] tracking-widest text-sm text-[#f8fafc]">Back</button>
                            </div>
                        </div>
                        <div className="w-screen px-20 py-2">
                            <pre className="whitespace-pre-wrap w-full h-auto py-2 px-4 bg-blue-200 placeholder-black-700 rounded shadow-sm font-sans">{response.description}</pre>
                        </div>
                        <div className="w-screen px-20 py-2 flex flex-col justify-center">
                            {response.question && response.qtype && response.question.map((q, index) => (
                                <Question
                                    key={index}
                                    index={index}
                                    quest={q}
                                    type={response.qtype}
                                    parameter={response.respondent}
                                    paramDetail={paramDetail}
                                    paramName={paramName}
                                    answer={response.answer} 
                                />
                            ))}
                        </div>
                        {error && <span className="w-screen px-20 text-red-500 font-bold">{error}</span>}
                    </form>
                </div>
            </div>
        </>
    );
}

function Question({ index, quest, type, parameter, paramDetail, paramName, answer }) {
    const subQuestions = quest.slice(1);
    const subQtypes = type[index].slice(1);

    return (
        <>
        {answer[quest[0]] || (type[index][0] === "multi-rating")? (
        <div className="mb-4">
            <div className="w-full flex row bg-blue-200 rounded-t-md">
                <p className="w-full pl-8 py-2 text-lg text-blue-800 font-semibold bg-blue-200 tracking-wider">{quest[0] || ""}</p>
            </div>
            <div className="w-full flex-row py-4 px-8 bg-[#f8fafc] rounded-b-md shadow-sm">
                {type[index][0]? (
                    type[index][0] === "text" ? (
                        <input disabled
                            type="text" 
                            id="answer"
                            name={quest[0]}
                            placeholder="Answer"
                            className="w-full px-4 py-2 text-md font-semibold bg-transparent border-2 border-gray-300" 
                            value={answer[quest[0]] || ""}
                        />
                    ) : type[index][0] === "date" ? (
                        <input disabled
                            type="date" 
                            id="answer"
                            name={quest[0]}
                            className="w-full px-4 py-2 text-md font-semibold bg-transparent border-2 border-gray-300" 
                            value={answer[quest[0]] || ""}
                        />
                    ) : type[index][0] === "radio-rating" ? (
                        <div className="flex-col">
                            <label className="px-4">
                                <input disabled type="radio" name={quest[0]} value="Sangat Baik" /> Sangat Baik
                            </label>
                            <label className="px-4">
                                <input disabled type="radio" name={quest[0]} value="Baik" /> Baik
                            </label>
                            <label className="px-4">
                                <input disabled type="radio" name={quest[0]} value="Cukup" /> Cukup
                            </label>
                            <label className="px-4">
                                <input disabled type="radio" name={quest[0]} value="Kurang" /> Kurang
                            </label>
                            <label className="px-4">
                                <input disabled type="radio" name={quest[0]} value="Sangat Kurang" /> Sangat Kurang
                            </label>
                        </div>
                    ) : type[index][0] === "checkbox" ? (
                        <div>
                            {subQtypes.map((subType, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                    <input disabled
                                        key={subIndex}
                                        type={type[index][0]} 
                                        name={quest[0]}
                                        id={subType}
                                        value={subType}
                                        checked={(Array.isArray(answer[quest[0]]) && answer[quest[0]].includes(subType))}
                                    />
                                    <label htmlFor={subType} className="px-4">{subType}</label>
                                </div>
                            ))}
                        </div>
                    ) : type[index][0] === "radio" ? (
                        <div>
                            {subQtypes.map((subType, subIndex) => (
                                <div key={subIndex} className="flex-col">
                                    <input disabled
                                        key={subIndex}
                                        type={type[index][0]} 
                                        name={quest[0]}
                                        id={subType}
                                        value={subType}
                                        checked={answer[quest[0]] === subType}
                                    />
                                    <label htmlFor={subType} className="px-4">{subType}</label>
                                </div>
                            ))}
                        </div>
                    ) : type[index][0] === "dropdown" ? (
                        <div>
                            <select  disabled
                                name={quest[0]}
                                className="w-full px-2 py-2 mr-44 text-grey-200 font-semibold bg-transparent cursor-pointer"
                                value={answer[quest[0]] || ""}
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
                                            <select disabled
                                                key={index}
                                                name={`${param} ${quest[0]}`} 
                                                className="w-1/6 py-2 text-sm "
                                                value={answer[`${param} ${quest[0]}`]?.[subIndex] || ''}
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
        ) : null }
        </>
    );
}
