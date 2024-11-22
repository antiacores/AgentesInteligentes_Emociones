import React, { useState } from "react";

const CargaImg = ({onImageUpload}) => {
    const [imgPrev, setImgPrev] = useState(null)

    const handleImageChange = (event) => {
        const archive = event.target.files[0];
        if (archive){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPrev(reader.result);
                onImageUpload(archive);
            }
            reader.readAsDataURL(archive);
        }

    }

    return(
        <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Cargar Imagen</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border rounded"
            />
            {imgPrev && (
                <img 
                src={imgPrev} 
                alt="Vista previa" 
                className="mt-4 w-full h-56 object-cover rounded"
                />
            )}
        </div>
    )
};

export default CargaImg;