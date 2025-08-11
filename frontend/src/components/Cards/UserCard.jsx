import React from 'react'
import user from "../../assets/user.png"

const UserCard = ({ userInfo }) => {
    return (
        <div className="user-card p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            {/* Top: Avatar + Info */}
            <div className="flex items-center gap-3">
                <img
                    src={userInfo?.profileImageUrl || user}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border-none object-cover"
                />
                <div className="text-sm font-medium">
                    <p className="font-semibold text-gray-800">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[160px]">{userInfo?.email}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-end gap-3 mt-4">
                <StartCard label="Pending" count={userInfo?.pendingTasks || 0} status="Pending" />
                <StartCard label="In Progress" count={userInfo?.inProgressTasks || 0} status="In Progress" />
                <StartCard label="Completed" count={userInfo?.completedTasks || 0} status="Completed" />
            </div>
        </div>
    );
};

export default UserCard;


// Status card component
const StartCard = ({ label, count, status }) => {
    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress": return "text-blue-600 bg-blue-50 border border-blue-200";
            case "Completed": return "text-green-600 bg-green-50 border border-green-200";
            default: return "text-amber-600 bg-amber-50 border border-amber-200";
        }
    };

    return (
        <div
            className={`flex-1 flex flex-col items-start justify-center text-[10px] font-medium ${getStatusTagColor()} py-1.5 px-2 rounded-lg`}
        >
            <span className="text-[11px] font-bold">{count}</span>
            <span className="text-[10px]">{label}</span>
        </div>
    );
};
