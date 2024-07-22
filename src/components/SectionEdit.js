import React, { useState, useEffect } from "react";

export default function SectionEdit({ onClose, formDetail, sec, secr }) {
    const [error, setError] = useState("");
    const [section, setSection] = useState(sec);
    const [section_rule, setSectionRule] = useState(secr);
    const [layer, setLayer] = useState({
        layer_id: ["1"], // Convert to string
        layerfrom: [""],
        layerto: [""],
        layerset: [[""]]
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentLayerIndex, setCurrentLayerIndex] = useState(null);

    useEffect( () => {
        setLayerDefault(section, section_rule);
        console.log(formDetail);
    }, []);


    const setLayerDefault = (section, section_rule) => {
        const uniqueLayerIds = [...new Set(section)];
        const layerFrom = [];
        const layerTo = [];

        // Mapping section indices to layer_from and layer_to
        let lastIndex = -1;
        for (let i = 0; i < section.length; i++) {
            if (i === 0 || section[i] !== section[i - 1]) {
                if (lastIndex !== -1) {
                    layerTo.push(lastIndex);
                }
                layerFrom.push(i);
            }
            lastIndex = i;
        }
        layerTo.push(lastIndex);

        // Setting the layerset from section_rule
        const layerSet = section_rule;

        setLayer(prevLayer => ({
            ...prevLayer,
            layer_id: uniqueLayerIds,
            layerfrom: layerFrom,
            layerto: layerTo,
            layerset: layerSet
        }));
    };

    const addLayer = () => {
        setLayer(prevLayer => ({
            layer_id: [...prevLayer.layer_id, String(prevLayer.layer_id.length + 1)], // Convert to string
            layerfrom: [...prevLayer.layerfrom, ""],
            layerto: [...prevLayer.layerto, ""],
            layerset: [...prevLayer.layerset, [""]]
        }));
    };

    const deleteLayer = () => {
        if (layer.layer_id.length > 1) {
            setLayer(prevLayer => ({
                layer_id: prevLayer.layer_id.slice(0, -1),
                layerfrom: prevLayer.layerfrom.slice(0, -1),
                layerto: prevLayer.layerto.slice(0, -1),
                layerset: prevLayer.layerset.slice(0, -1)
            }));
        }
    };

    const handleChangeLayerFrom = (event, index) => {
        const newLayerFrom = [...layer.layerfrom];
        newLayerFrom[index] = event.target.value;
        setLayer(prevLayer => ({ ...prevLayer, layerfrom: newLayerFrom }));
    };

    const handleChangeLayerTo = (event, index) => {
        const newLayerTo = [...layer.layerto];
        newLayerTo[index] = event.target.value;
        setLayer(prevLayer => ({ ...prevLayer, layerto: newLayerTo }));
        
        //console.log(event,index,"tes");
    };

    const handleSetClick = (index) => {
        setCurrentLayerIndex(index);
        setIsPopupOpen(true);
    };

    const closePopup = (selectedOptions) => {
        if (selectedOptions) {
            const newLayerset = [...layer.layerset];
            newLayerset[currentLayerIndex] = selectedOptions.map(String); 
            setLayer(prevLayer => ({ ...prevLayer, layerset: newLayerset }));
        }
        setIsPopupOpen(false);
        setCurrentLayerIndex(null);
        
        console.log(layer);
    };

    const handleSubmitSection = (event) => {
        event.preventDefault();

        if (layer.layer_id.length === 0) {
            setError("Please fill out all sections.");
        } else {
            const newSectionRule = layer.layerset.map(subset => subset.map(String));
            setSectionRule(newSectionRule);

            const newSection = [];
            layer.layerfrom.forEach((from, index) => {
                const to = layer.layerto[index];
                const layerId = layer.layer_id[index];
                for (let i = parseInt(from); i <= parseInt(to); i++) {
                    newSection[i] = layerId;
                }
            });
            setSection(newSection);

            onClose(newSection, newSectionRule);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-blue-100 px-8 py-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold tracking-widest text-center text-blue-900">Section Setting</h2>
                {error && <p className="w-full p-2 text-red-500 text-sm font-bold text-center">{error}</p>}
                <div className="flex-row items-center justify-center py-4">
                    <table>
                        <thead className="h-12 bg-[#577BC1] text-[#f8fafc] font-normal">
                            <tr>
                                <th scope="col" className="w-24">Section</th>
                                <th scope="col" className="w-72">From</th>
                                <th scope="col" className="w-72">To</th>
                                <th scope="col" className="w-24">Next Section</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle text-blue-900 font-normal text-center">
                            {layer.layer_id.map((layer_id, index) => (
                                <tr key={index} className="border border-y-slate-600 py-8">
                                    <td>{layer_id}</td>
                                    <td>
                                        <select
                                            name={`layerfrom${index}`}
                                            className="w-full px-2 py-1 mr-44 text-grey-200 text-blue-800 bg-blue-200 cursor-pointer"
                                            value={layer.layerfrom[index]}
                                            onChange={(e) => handleChangeLayerFrom(e, index)}
                                        >
                                            <option value="">Choose Question</option>
                                            {formDetail.question.map((question, qIndex) => (
                                                <option key={qIndex} value={String(qIndex)}>{question}</option> // Convert to string
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            name={`layerto${index}`}
                                            className="w-full px-2 py-1 mr-44 text-grey-200 text-blue-800 bg-blue-200 cursor-pointer"
                                            value={layer.layerto[index]}
                                            onChange={(e) => handleChangeLayerTo(e, index)}
                                        >
                                            <option value="">Choose Question</option>
                                            {formDetail.question.map((question, qIndex) => (
                                                <option key={qIndex} value={String(qIndex)}>{question}</option> // Convert to string
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleSetClick(index)}>Set</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <button onClick={addLayer} className="w-24 bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mr-4">
                        Add Section
                    </button>
                    <button onClick={deleteLayer} className="w-24 bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
                        Delete Section
                    </button>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <button onClick={onClose} className="w-24 bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded mr-4">
                        Close
                    </button>
                    <button onClick={handleSubmitSection} className="w-24 bg-[#577BC1] hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </div>
            </div>
            {isPopupOpen && (
                <NextSectionSettings
                    onClose={closePopup}
                    question={formDetail.question[layer.layerto[currentLayerIndex]]}
                    qtypes={formDetail.qtype[layer.layerto[currentLayerIndex]]}
                    layerIds={layer.layer_id}
                    layerSet={layer.layerset}
                    currentLayerIndex = {currentLayerIndex}
                    nextlayer={currentLayerIndex < layer.layer_id.length - 1 ? (currentLayerIndex + 2).toString() : "0"}
                    selectedOptions={layer.layerset[currentLayerIndex]} // Ini mengirim nilai yang disimpan sebelumnya
                />
            )}
        </div>
    );
}

function NextSectionSettings({ onClose, question, qtypes, layerIds, layerSet, currentLayerIndex, nextlayer, selectedOptions: initialSelectedOptions }) {
    const displayedQtypes = qtypes[0] === 'dropdown' || qtypes[0] === 'radio' ? qtypes.slice(1) : question;
    const x = displayedQtypes.map(() => String(nextlayer));
    const defaultOptions =  layerSet[currentLayerIndex] ?  layerSet[currentLayerIndex] : displayedQtypes.map(() => String(nextlayer)); // Default to nextlayer

    const [selectedOptions, setSelectedOptions] = useState([
        initialSelectedOptions !== '' ? 
        defaultOptions.map(String) :
        initialSelectedOptions.map(String)
    ]);

    useEffect(() => {
        if (initialSelectedOptions && initialSelectedOptions.length > 0 && initialSelectedOptions !== '' ) {
            setSelectedOptions(initialSelectedOptions.map(String));
        }else{
            setSelectedOptions(defaultOptions.map(String));
        }
        console.log("LayerSet:",layerSet[currentLayerIndex]);
        console.log("defaultOptions:",defaultOptions[0]);
        console.log("nextlayer:",displayedQtypes.map(() => String(nextlayer)));
    }, [initialSelectedOptions]);

    const handleChange = (event, index) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = event.target.value;
        if(index > 0 && newSelectedOptions[index-1] === ''){
            newSelectedOptions[index-1] = defaultOptions[index-1];
        }
        setSelectedOptions(newSelectedOptions);
    };
    
    const handleSave = () => {
        onClose(selectedOptions);
        console.log(selectedOptions);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-blue-100 p-8 rounded shadow-lg text-blue-900">
                <h2 className="text-xl font-semibold mb-4">Next Section Settings</h2>
                {displayedQtypes.map((option, index) => (
                    <div key={index} className="flex items-center mb-4">
                        <span className="mr-4">{option}</span>
                        <select
                            name="layerset"
                            value={selectedOptions[index] || defaultOptions[index]}
                            onChange={(e) => handleChange(e, index)}
                            className="border p-2 rounded"
                        >
                            <option value="0">Submit Page</option> {/* Convert to string */}
                            {layerIds.map(num => (
                                <option key={num} value={String(num)}>{num}</option> // Convert to string
                            ))}
                        </select>
                    </div>
                ))}
                <div className="flex justify-end mt-4">
                    <button onClick={handleSave} className="bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">Save</button>
                    <button onClick={() => onClose(null)} className="bg-[#577BC1] hover:bg-gray-400 text-white font-bold py-2 px-4 rounded ml-4">Close</button>
                </div>
            </div>
        </div>
    );
}