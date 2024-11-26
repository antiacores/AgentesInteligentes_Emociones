import React from "react";
import '../App.css'

const TextInput = ({onTextChange}) => {
    return(
        <div className="mb-6">
      <label className="block mb-2 font-semibold text-gray-700">Texto</label>
      <textarea
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Ingrese un texto para analizar sus emociones"
        className="w-full px-4 py-3 rounded-md border border-gray-300 focus: outline-none focus: ring-2 focus: ring-stone-300 focus:border-transparent"
      />
    </div>
    );
};

export default TextInput;