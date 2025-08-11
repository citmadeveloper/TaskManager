import React, { useEffect, useState, useCallback, useRef } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import { toast } from 'react-hot-toast';

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();
  const hasRetried = useRef(false); // ✅ Track if we've already retried for this filter

  // Fetch all tasks with optional retry
  const getAllTasks = useCallback(
    async (status, isRetry = false) => {
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
          completedTasks = 0,
        } = data?.statusSummary || {};

        // Only update state if data actually changed
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

        //  If fetch succeeds, reset retry flag
        if (!isRetry) hasRetried.current = false;
      } catch (error) {
        console.error("Error fetching tasks:", error);

        if (!isRetry && !hasRetried.current) {
          hasRetried.current = true;
          console.warn("Retrying fetch in 1s...");
          setTimeout(() => getAllTasks(status, true), 1000); // Retry after 1 second
        } else {
          toast.error("Failed to fetch tasks. Please try again.");
        }
      }
    },
    []
  );

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      if (!response?.data) {
        toast.error("No task report found.");
        return;
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasks_report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Task report downloaded successfully");
    } catch (error) {
      console.error("Error downloading task report:", error);
      toast.error("Failed to download task report. Please try again.");
    }
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => getAllTasks(filterStatus), 200);
    return () => clearTimeout(delayFetch);
  }, [filterStatus, getAllTasks]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5 px-2 sm:px-4">
        {/* Header section */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-lg sm:text-xl font-medium">My Task</h2>
            <button
              className="flex lg:hidden items-center gap-1 download-btn text-sm"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-base sm:text-lg" />
              <span>Download</span>
            </button>
          </div>

          {tabs?.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
              <button
                className="hidden lg:flex items-center gap-2 download-btn text-sm"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
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
              onClick={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
