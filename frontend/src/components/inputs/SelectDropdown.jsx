import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    // Color styles for the selected value
    const getSelectedStyle = (val) => {
        switch (val) {
            case "Low":
                return "text-green-600 bg-green-50 border border-green-500/40";
            case "Medium":
                return "text-yellow-600 bg-yellow-50 border border-yellow-500/40";
            case "High":
                return "text-red-600 bg-red-50 border border-red-500/40";
            default:
                return "text-black bg-white border border-slate-200";
        }
    };

    return (
        <div className="relative w-full">
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-sm outline-none px-2.5 py-3 rounded-md mt-2 flex justify-between items-center transition-all duration-200
                    ${getSelectedStyle(value)}`}>
                {value
                    ? options.find((opt) => opt.value === value)?.label
                    : placeholder}
                <span className="ml-2">
                    <LuChevronDown
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute w-full bg-white border border-slate-200 rounded-md mt-1 shadow-md z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 text-black"
                        >
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;
