import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/layouts/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import toast from "react-hot-toast";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // triggers refetch after update

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getTaskDetailsByID = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateTodoChecklist = async (index) => {
    if (!task?.todoChecklist) return;

    // Optimistic update for instant UI feedback
    const updatedChecklist = task.todoChecklist.map((item, idx) =>
      idx === index ? { ...item, completed: !item.completed } : item
    );
    setTask((prev) => ({ ...prev, todoChecklist: updatedChecklist }));

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist: updatedChecklist }
      );

      if (response.status === 200) {
        // Trigger data refresh from backend to ensure up-to-date info
        setTimeout(() => {
          setRefreshTrigger((prev) => prev + 1);
          toast.success("Checklist updated successfully");
        }, 300); // small delay for smooth UI
      } else {
        toast.error("Failed to update checklist");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
      // Revert optimistic update if API fails
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    getTaskDetailsByID();
  }, [getTaskDetailsByID, refreshTrigger]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-gray-500">Loading task...</p>
        ) : (
          task && (
            <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
              <div className="form-card col-span-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm md:text-xl font-medium">{task?.title}</h2>
                  <div
                    className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                      task?.status
                    )} px-4 py-0.5 rounded`}
                  >
                    {task?.status}
                  </div>
                </div>

                <div className="mt-4">
                  <InfoBox label="Description" value={task?.description} />
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-6 md:col-end-4">
                    <InfoBox label="Priority" value={task?.priority} />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <InfoBox
                      label="Due Date"
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500">
                      Assigned To
                    </label>
                    <AvatarGroup
                      avatars={
                        task?.assignedTo?.map((item) => item?.profileImageUrl) || []
                      }
                      maxVisible={5}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Todo Checklist
                  </label>
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoChecklist
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>

                {task?.attachments?.length > 0 && (
                  <div className="mt-2">
                    <label className="text-xs font-medium text-slate-500">
                      Attachments
                    </label>
                    {task?.attachments?.map((link, index) => (
                      <Attachment
                        key={`link_${index}`}
                        link={link}
                        index={index}
                        onClick={() => handleLinkClick(link)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => (
  <>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
      {value}
    </p>
  </>
);

const TodoChecklist = ({ text, isChecked, onChange }) => (
  <div className="flex items-center gap-3 p-3">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
    />
    <p className="text-[13px] text-gray-800">{text}</p>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div
    className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex-1 flex items-center gap-3">
      <span className="text-xs text-gray-400 font-semibold mr-2">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-xs text-black truncate">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-400" />
  </div>
);

