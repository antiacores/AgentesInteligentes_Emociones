import {useState} from 'react';
import './App.css';
import CargaImg from './components/CargaImagen';
import TextInput from './components/TextInput';

function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            const formData = new FormData();
            formData.append('text', text);
            formData.append('image', image)

            const response = await fetch('https://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formData,
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la categoría');
            }
            setResponse(data);
            setShowModal(true);
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
                <img src={logo} alt="Logo" className="w-48 h-48 object-contain mx-auto"/>
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Emotica</h1>
                <p className='text-center text-gray-600 mb-1'>
                    Con base nuestro modelo Inception V3 y técnicas de Procesamiento de Lenguaje Natural,
                </p>
                <p className='text-center text-gray-600 mb-4'>
                    compártenos una foto y un pensamiento, y te haremos una recomendación.
                </p>

                <CargaImg onImageUpload={setImage}/>
                <TextInput onTextChange={setText}/>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-stone-600 transition"
                >
                    Preparar Envío
                </button>
            </div>

            {showModal && response && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                        <h2 className="text-xl font-bold text-center mb-4">Resultados</h2>
                        <p><strong>Emoción detectada:</strong> {response.emotion}</p>
                        <p><strong>Recomendación:</strong> {response.recommendation}</p>
                        <p><strong>Probabilidades:</strong></p>
                        <ul>
                            {Object.entries(response.probabilities).map(([emotion, prob]) => (
                                <li key={emotion}>{emotion}: {(prob * 100).toFixed(2)}%</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;