from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2

app = Flask(__name__)

try:
    model = tf.keras.models.load_model('model.h5')
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    model = None


def preprocess_image(image_bytes):
    """
    Preprocesa la imagen usando OpenCV para que coincida con el formato esperado por el modelo.
    Ajusta estos parámetros según las necesidades de tu modelo específico.
    """
    # Convertir bytes a numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    # Decodificar imagen
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convertir a escala de grises
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Redimensionar la imagen al tamaño que espera tu modelo
    resized = cv2.resize(gray, (48, 48))  # Ajusta estas dimensiones según tu modelo

    # Normalizar
    normalized = resized / 255.0

    # Añadir dimensiones para batch y canales
    processed = np.expand_dims(normalized, axis=0)
    processed = np.expand_dims(processed, axis=-1)

    return processed


@app.route('/')
def hello_world():
    return 'Servidor de detección de emociones activo'


@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Modelo no cargado correctamente'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No se encontró imagen en la petición'}), 400

    try:
        # Obtener la imagen del request
        image_file = request.files['image'].read()

        # Preprocesar la imagen
        processed_image = preprocess_image(image_file)

        # Realizar la predicción
        prediction = model.predict(processed_image)

        # Mapear las emociones (ajusta según las clases de tu modelo)
        emotions = ['Enojo', 'Disgusto', 'Miedo', 'Felicidad', 'Tristeza', 'Sorpresa', 'Neutral']
        result = {
            'emotion': emotions[np.argmax(prediction[0])],
            'probabilities': {
                emotion: float(prob)
                for emotion, prob in zip(emotions, prediction[0])
            }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(debug=True)
