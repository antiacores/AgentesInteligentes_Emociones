import tensorflow as tf
import numpy as np
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import nltk
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
from nltk.corpus import stopwords
import re
import kagglehub
import pandas as pd
import os

nltk.download('stopwords')
nltk.download('punkt')

dataset=pd.read_csv("data.csv")
print(dataset.head(5))

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # Quitar caracteres especiales
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]  # Quitar stopwords
    return tokens

dataset['cleaned_tweets'] = dataset['Tweets'].apply(clean_text)

print(dataset[['Tweets', 'cleaned_tweets']].head())
dataset['Feeling'] = dataset['Feeling'].apply(lambda x: 1 if x == "positive" else 0)

sentences = dataset['cleaned_tweets'].tolist()


model_w2v = Word2Vec(sentences ,
                     min_count=1,
                     vector_size=100,
                     window=5)

def sentence_to_vector(sentence):
    valid_words = [model_w2v.wv[word] for word in sentence if word in model_w2v.wv]
    return np.mean(valid_words, axis=0) if valid_words else np.zeros(model_w2v.vector_size)


dataset['vector'] = dataset['cleaned_tweets'].apply(sentence_to_vector)
x_vectors = np.array(dataset['vector'].tolist())
y = dataset['Feeling'].values

# Normalización
scaler = StandardScaler()
x_vectors = scaler.fit_transform(x_vectors)

x_train, x_test, y_train, y_test = train_test_split(x_vectors, y, test_size=0.2, random_state=42)

model = tf.keras.models.Sequential(
   [
    tf.keras.layers.Dense(1024, activation='relu', input_shape=(x_train.shape[1],)),
    tf.keras.layers.Dense(512, 'relu'),
    tf.keras.layers.Dense(258, 'relu'),
    tf.keras.layers.Dense(258, 'relu'),
    tf.keras.layers.Dense(128, 'relu'),
    tf.keras.layers.Dense(128, 'relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
   ]
)

# Compile the model
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Train the model
model_history = model.fit(x_train, y_train,
              epochs=30,
              batch_size=4,
              validation_data=(x_test, y_test))

model.save("model.h5")

# Evaluate the model
loss, accuracy = model.evaluate(x_test, y_test)

print(f"Test Loss: {loss}")
print(f"Test Accuracy: {accuracy}")

plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(model_history.history['accuracy'], label="Train Accuracy")
plt.plot(model_history.history['val_accuracy'], label="Val Accuracy")
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend(loc='lower right')

plt.subplot(1, 2, 2)
plt.plot(model_history.history['loss'], label="Train Loss")
plt.plot(model_history.history['val_loss'], label="Val Loss")
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend(loc='upper right')

plt.tight_layout()
plt.savefig('resultados_text.png')
plt.show()

# 11. Predicción para nuevos tweets
new_sentence = "Overjoyed with the fantastic results, truly impressive"
new_sentence_tokens = clean_text(new_sentence)
new_sentence_vector = sentence_to_vector(new_sentence_tokens)

prediction = model.predict(np.array([new_sentence_vector]))
print(f"Feeling prediction for the new sentence: {'positive' if prediction[0][0] > 0.5 else 'negative'}")