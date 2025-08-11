import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
    const [option, setOption] = useState("");

    // Add new attachment
    const handleAddOption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption("");
        }
    };

    // Delete an attachment
    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
    };

    return (
        <div>
            {attachments.map((item, index) => (
                <div
                    key={item}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mb-2"
                >
                    <div className="flex items-center gap-2">
                        <LuPaperclip className="text-gray-400" />
                        <p className="text-[12px] text-gray-800">{item}</p>
                    </div>
                    <button
                        type="button"
                        className="hover:text-red-600"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-base text-red-500" />
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 border border-gray-300 hover:border-blue-300 rounded-md px-3 py-2 w-full bg-white">
                    <LuPaperclip className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Add File Link"
                        value={option}
                        onChange={({ target }) => setOption(target.value)}
                        className="w-full text-[12px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                    />
                </div>
                <button
                    type="button"
                    className="card-btn text-sm flex items-center gap-1 px-3 py-2"
                    onClick={handleAddOption}
                >
                    <HiMiniPlus className="text-base" /> Add
                </button>
            </div>
        </div>
    );
};

export default AddAttachmentsInput;
