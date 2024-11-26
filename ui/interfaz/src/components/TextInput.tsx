interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function TextInput({ text, setText, onSubmit, disabled }: TextInputProps) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Enter your instructions"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 text-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Aceptar
      </button>
    </div>
  );
}