'use client'

import { useState, ChangeEvent } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { TextInput } from '@/components/TextInput';
import { Loading } from '@/components/Loading';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { submitImageAndText, ApiResponse } from '@/services/api';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !text.trim()) {
      alert('Please provide both an image and text');
      return;
    }

    setLoading(true);
    try {
      const data = await submitImageAndText(imageFile, text);
      console.log(data);
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading/>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <img src="/assets/emotica.png" alt="Logo" className="w-48 h-48 object-contain mx-auto"/>
          <h1 className="text-center text-2xl font-bold mb-2 text-zinc-900">Emotica</h1>
          <p className="text-center text-gray-600 mb-6">
            Con base nuestro modelo Inception V3 y técnicas de
                    Procesamiento de Lenguaje Natural, compártenos una foto con un pensamiento, y te haremos una
                    recomendación
          </p>

          <ImageUpload image={image} onImageUpload={handleImageUpload}/>

          <TextInput
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              disabled={!image || !text.trim()}
          />

          {response && (
              <ResultsDisplay
                  emotion={response.emotion}
                  probabilities={response.probabilities}
                  recommendation={response.recommendation}
              />
          )}

          <div className="flex justify-center gap-4 text-sm text-gray-600 mt-4">
            <button className="hover:text-gray-900">What is this?</button>
            <button className="hover:text-gray-900">Upload image</button>
            <button className="hover:text-gray-900">Fork repo</button>
          </div>
        </div>
      </div>
    </main>
  );
}