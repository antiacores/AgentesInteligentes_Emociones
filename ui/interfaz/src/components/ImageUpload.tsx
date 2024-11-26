import { ChangeEvent } from 'react';

interface ImageUploadProps {
  image: string | null;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ image, onImageUpload }: ImageUploadProps) {
  return (
    <>
      {image ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4">
          <img
            src={image}
            alt="Selected image"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 mb-4">
          <svg
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <label className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-500">
              Upload an image
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
            />
          </label>
        </div>
      )}
    </>
  );
}
