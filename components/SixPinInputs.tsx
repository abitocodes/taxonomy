interface SixPinInputsProps {
    id: string;
    name: string;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SixPinInputs: React.FC<SixPinInputsProps> = ({ id, disabled, onChange }) => {
  return ( 
    <div className="max-w-sm mx-auto">
        <div className="flex justify-center mb-2 space-x-2 rtl:space-x-reverse">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                    <input type="text" maxLength={1} id={`${id}_${index + 1}`} className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                        required 
                        disabled={disabled} 
                        onChange={onChange} />
                </div>
            ))}
        </div>
    </div>
  );
};

