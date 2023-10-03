"use client";

import React from "react";
import ReactSelect from "react-select";

interface SelectProps {
    label: string;
    value: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
}

const Select = ({ label, value, onChange, options, disabled }: SelectProps) => {
    return (
        <div className="z-[100]">
            <label className="block text-gray-700 font-medium">{label}</label>
            <div className="mt-2">
                <ReactSelect
                    value={value}
                    isDisabled={disabled}
                    onChange={onChange}
                    isMulti
                    options={options}
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 999,
                        }),
                    }}
                    classNames={{
                        control: () => "text-sm",
                    }}
                />
            </div>
        </div>
    );
};

export default Select;
