
interface ResultsDisplayProps {
  emotion: string;
  recommendation: string;
  probabilities: {
    [key: string]: number;
  };
}

export function ResultsDisplay({ emotion, probabilities, recommendation}: ResultsDisplayProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h2 className="font-semibold mb-2">Resultados:</h2>
        <div className="space-y-2">
            <p className="text-lg font-medium">Emoción detectada: {emotion}</p>
            <div className="mt-4">
                <h3 className="font-medium mb-2">Probabilidades por emoción:</h3>
                {Object.entries(probabilities).map(([emotion, probability]) => (
                    <div key={emotion} className="flex justify-between items-center mb-2">
                        <span>{emotion}:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-48 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{width: `${probability * 100}%`}}
                                ></div>
                            </div>
                            <span className="min-w-[4rem] text-right">
                  {(probability * 100).toFixed(1)}%
                </span>
                        </div>
                    </div>
                ))}
            </div>
            <h4 className="text-lg font-medium">Emoción detectada: {recommendation} </h4>
        </div>
    </div>
  );
}