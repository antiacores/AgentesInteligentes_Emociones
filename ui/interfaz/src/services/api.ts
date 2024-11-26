export interface ApiResponse {
  emotion: string;
  recommendation: string;
  probabilities: {
    [key: string]: number;
  };
}

export async function submitImageAndText(imageFile: File, text: string): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('text', text);

  const response = await fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process request');
  }

  return response.json();
}