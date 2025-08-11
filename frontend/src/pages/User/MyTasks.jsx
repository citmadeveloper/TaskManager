import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import { toast } from 'react-hot-toast';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  // Get all tasks 
  const getAllTasks = useCallback(async (status) => {
    try {
      const params = {};
      if (status && status !== "All") {
        params.status = status;
      }

      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, { params });

      const tasks = data?.tasks || [];
      const {
        all = 0,
        pendingTasks = 0,
        inProgressTasks = 0,
        completedTasks = 0
      } = data?.statusSummary || {};

      // Only update state if data has actually changed
      setAllTasks((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(tasks)) return tasks;
        return prev;
      });

      setTabs((prev) => {
        const newTabs = [
          { label: "All", count: all },
          { label: "Pending", count: pendingTasks },
          { label: "In Progress", count: inProgressTasks },
          { label: "Completed", count: completedTasks },
        ];
        if (JSON.stringify(prev) !== JSON.stringify(newTabs)) return newTabs;
        return prev;
      });

    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    }
  }, []);



  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };


  useEffect(() => {
    const delayFetch = setTimeout(() => getAllTasks(filterStatus), 100);
    return () => clearTimeout(delayFetch);
  }, [filterStatus, getAllTasks]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5 px-2 sm:px-4">
        {/* Header section */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl font-medium">My Task</h2>

          </div>

          {tabs?.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        {/* Task grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-4">
          {allTasks?.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((user) => user?.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
