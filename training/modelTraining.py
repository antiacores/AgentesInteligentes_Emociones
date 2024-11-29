import tensorflow as tf
import numpy as np
import cv2
import os
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Ruta de la carpeta de datasets
dataset_path = "../dataset"

# Ruta de las carpetas de train y validation
train_path = os.path.join(dataset_path, "train")
validation_path = os.path.join(dataset_path, "validation")

# Nombres de las clases
class_names = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# Definir aumento de datos
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
    tf.keras.layers.RandomBrightness(0.2)
])

# Cargar el dataset de entrenamiento
train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    train_path,
    image_size=(150, 150),
    batch_size=32,
    label_mode='int',
    class_names=class_names
)

# Cargar el dataset de validación
val_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    validation_path,
    image_size=(150, 150),
    batch_size=32,
    label_mode='int',
    class_names=class_names
)

# Aplicar aumento de datos solo al conjunto de entrenamiento
train_dataset = train_dataset.map(lambda x, y: (data_augmentation(x, training=True), y))

# Normalizar las imágenes (escala entre 0 y 1)
def normalize(image, label):
    image = tf.cast(image, tf.float32) / 255.0
    return image, label

train_dataset = train_dataset.map(normalize)
val_dataset = val_dataset.map(normalize)

# Cargar el modelo InceptionV3 preentrenado y congelar las capas
base_model = tf.keras.applications.InceptionV3(input_shape=(150, 150, 3),
                                               include_top=False,
                                               weights='imagenet')
base_model.trainable = False

# Arquitectura del modelo
model = tf.keras.models.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(512, activation="relu"),
    tf.keras.layers.Dropout(0.4),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(len(class_names), activation="softmax")
])

# Compilar el modelo
model.compile(optimizer=tf.keras.optimizers.Adam(0.00001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Definir Early Stopping
early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

# Entrenar el modelo con aumento de datos y Early Stopping
model_history = model.fit(train_dataset, validation_data=val_dataset, epochs=10, callbacks=[early_stopping])

model.save("ProjectModel.h5")

# Evaluar el modelo
y_true, y_pred = [], []
for images, labels in val_dataset:
    predictions = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(predictions, axis=1))

# Matriz de confusión
conf_matrix = confusion_matrix(y_true, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=conf_matrix, display_labels=class_names)
disp.plot(cmap=plt.cm.Blues)
plt.title("Matriz de Confusión")
plt.savefig('matriz')
plt.show()

# Graficar precisión y pérdida
plt.figure(figsize=(15, 4))

plt.subplot(1, 2, 1)
plt.plot(model_history.history['accuracy'], label='Entrenamiento', color='#EAE6CA')
plt.plot(model_history.history['val_accuracy'], label='Validación', color='#8A6642')
plt.title('Precisión')
plt.xlabel('Épocas')
plt.ylabel('Precisión')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(model_history.history['loss'], label='Entrenamiento', color='#EAE6CA')
plt.plot(model_history.history['val_loss'], label='Validación', color='#8A6642')
plt.title('Pérdida')
plt.xlabel('Épocas')
plt.ylabel('Pérdida')
plt.legend()
plt.savefig('loss')
plt.show()