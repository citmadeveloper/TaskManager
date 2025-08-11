import React from 'react'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="my-2">
            <div className="grid grid-cols-2 sm:flex sm:gap-3 gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`relative flex items-center justify-between px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium w-full sm:w-auto whitespace-nowrap overflow-hidden truncate transition-all duration-200
                            ${activeTab === tab.label
                                ? "text-primary bg-primary/10"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        {/* Label - Left side */}
                        <span className="truncate">{tab.label}</span>

                        {/* Count Badge - Right side */}
                        <span
                            className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ml-3
                                ${activeTab === tab.label
                                    ? "bg-primary text-white"
                                    : "bg-gray-200/70 text-gray-700"
                                }`}
                        >
                            {tab.count}
                        </span>

                        {/* Active underline (desktop only) */}
                        {activeTab === tab.label && (
                            <div className="hidden sm:block absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TaskStatusTabs
