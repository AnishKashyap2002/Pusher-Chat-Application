import { type } from "os";
import { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form";

type InputProps = {
    label: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    disabled?: boolean;
};

const Input = ({
    label,
    id,
    type = "text",
    register,
    required,
    disabled,
    errors,
}: InputProps) => {
    return (
        <div className="flex flex-col gap-1 mt-1 shadow-md bg-gray-100 text-black px-4 py-2 rounded-lg">
            <label
                htmlFor={id}
                className="font-medium"
            >
                {label}
            </label>
            <input
                type={type}
                disabled={disabled}
                {...register(id, { required })}
                className={`
                focus:outline-blue-600 
                w-full px-5 py-2 rounded-md bg-white
             ${errors[id] && "focus:ring-rose-500"}
             ${disabled && "opacity-50 cursor-default"}`}
            />
        </div>
    );
};

export default Input;
