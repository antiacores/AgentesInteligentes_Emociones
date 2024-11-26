export function Loading() {
  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
      <img
        src="/assets/emotica.png"
        alt="Logo"
        className="w-48 h-48 object-contain mb-8 animate-bounce"
      />
      <div className="w-16 h-16 border-t-4 border-orange-600 border-solid rounded-full animate-spin"></div>
    </div>
  );
}
