import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUser } from "react-icons/lu";
import Modal from "../layouts/Modal";
import AvatarGroup from "../layouts/AvatarGroup";
import defaultUserImage from "../../assets/user.png";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl || defaultUserImage);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUsers.length === 0) {
            setTempSelectedUsers([]);
        }
    }, [selectedUsers]);

    return (
        <div className="space-y-4 mt-2">
            {/* Add Members Button */}
            {selectedUserAvatars.length === 0 && (
                <button
                    className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg bg-white shadow-sm hover:bg-blue-50 hover:border-blue-300 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    <LuUser className="text-sm text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Add Members</span>
                </button>
            )}

            {/* Avatar Group */}
            {selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users">
                <div className="space-y-4 h-[60vh] overflow-y-auto px-1">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between gap-4 p-4 border border-blue-300 rounded-lg bg-blue-50/40 shadow-sm hover:bg-blue-100/70 hover:shadow-md transition-all duration-300 cursor-pointer">

                            <div className="flex items-center gap-3">
                                <img
                                    src={user.profileImageUrl || defaultUserImage}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-blue-200"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            {/* Right: Checkbox */}
                            <div>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedUsers.includes(user._id)}
                                    onChange={() => toggleUserSelection(user._id)}
                                    className="w-5 h-5 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-400 transition"
                                />
                            </div>
                        </div>
                    ))}

                    {allUsers.length === 0 && (
                        <p className="text-center text-sm text-gray-500">No users available.</p>
                    )}
                </div>

                {/* Assign Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Done
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;
