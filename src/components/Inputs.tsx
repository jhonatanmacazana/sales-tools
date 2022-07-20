interface CommonProps {
  id: string;
  className?: string;
  label?: string;
  placeholder?: string;
}

export const TextareaInput: React.FC<
  CommonProps & {
    value: string;
    setValue: (newValue: string) => void;
  }
> = ({ id, setValue, value, className, label, placeholder }) => {
  return (
    <div className={`flex w-full flex-col items-start text-sm text-gray-400 ${className}`}>
      {label && (
        <label className="pb-1 font-medium " htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        id={id}
        name={id}
        onChange={(evt) => setValue(evt.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export const InputText: React.FC<
  CommonProps & {
    value: string;
    setValue: (newValue: string) => void;
  }
> = ({ id, setValue, value, className, label, placeholder }) => {
  return (
    <div className={`flex w-full flex-col items-start text-sm text-gray-400 ${className}`}>
      {label && (
        <label className="pb-1 font-medium " htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        id={id}
        name={id}
        onChange={(evt) => setValue(evt.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </div>
  );
};

export const InputNumber: React.FC<
  CommonProps & {
    value: number;
    setValue: (newValue: number) => void;
  }
> = ({ id, setValue, value, className, label, placeholder }) => {
  return (
    <div className={`flex w-full flex-col items-start text-sm text-gray-400 ${className}`}>
      {label && (
        <label className="pb-1 font-medium " htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        id={id}
        name={id}
        onChange={(evt) => setValue(evt.target.valueAsNumber)}
        placeholder={placeholder}
        type="number"
        value={value}
      />
    </div>
  );
};
