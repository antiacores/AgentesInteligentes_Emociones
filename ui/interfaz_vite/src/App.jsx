import {useState} from 'react';
import './App.css';
import CargaImg from './components/CargaImagen';
import TextInput from './components/TextInput';

function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        alert(`Datos a procasdesar:
          Imagen: ${image ? image.name : "No hay imagen"}
          Texto: ${text}`);
        console.log("Datos a procesar: ", {
            image: image ? image.name : null,
            text: text
        });
        setLoading(true);
        try {
            const response = await fetch('https://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    img_url: image,
                }),
            });
            console.log(JSON.stringify({
                text: text,
                img_url: image,
            }))
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la categoría');
            }

            alert('Éxito', 'Categoría creada con éxito!');
            setLoading(false);

        } catch (error) {

            setLoading(false);
            alert('Error', error.message);

        }
    };

    if (loading) {
        return (
            <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
                <img
                    src="src/assets/Designer (1).png"
                    alt="Logo"
                    className="w-48 h-48 object-contain mb-8 animate-bounce"
                />
                <div className="w-16 h-16 border-t-4 border-orange-600 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-screen h-auto bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-8">
                <img src="src/assets/Designer (1).png" alt="Logo" className="w-48 h-48 object-contain mx-auto"/>
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Emotica
                </h1>
                <p className='text-center text-gray-600 mb-1'>Con base nuestro modelo Inception V3 y técnicas de
                    Procesamiento de Lenguaje Natural,</p>
                <p className='text-center text-gray-600 mb-4'>compártenos una foto y un pensamiento, y te haremos una
                    recomendación.</p>

                <CargaImg onImageUpload={setImage}/>
                <TextInput onTextChange={setText}/>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-stone-600 transition"
                >
                    Preparar Envasío
                </button>
            </div>
        </div>
    );
}

export default App;
