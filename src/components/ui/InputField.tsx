// components/ui/InputField.tsx

'use client';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputField = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
}: InputFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="email"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;  // Ensure default export
