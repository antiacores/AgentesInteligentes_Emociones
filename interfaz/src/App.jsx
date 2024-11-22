import { useState } from 'react';
import './App.css';
import CargaImg from './components/CargaImagen';
import TextInput from './components/TextInput';

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  
  const handleSubmit = () => {
    alert(`Datos a procesar:
      Imagen: ${image ? image.name : "No hay imagen"}
      Texto: ${text}`);
    console.log("Datos a procesar: ", {
      image: image ? image.name : null,
      text: text
    });
  }

  return (
    <div className="w-screen h-auto bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8">
        <img src="src/assets/Designer (1).png" alt="Logo"  className="w-48 h-48 object-contain mx-auto"/>
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Emotica
        </h1>
        <p className='text-center text-gray-600 mb-1'>Con base nuestro modelo Inception V3 y técnicas de Procesamiento de Lenguaje Natural,</p>
        <p className='text-center text-gray-600 mb-4'>compártenos una foto y un pensamiento, y te haremos una recomendación.</p>
        
        <CargaImg onImageUpload={setImage} />
        <TextInput onTextChange={setText} />

        <button 
          onClick={handleSubmit}
          className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-stone-600 transition"
        >
          Preparar Envío
        </button>
      </div>
    </div>
  );
}

export default App;
