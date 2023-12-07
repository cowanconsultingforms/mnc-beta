import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  limit,
  getDocs,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import image from "../assets/img/taskmanager.jpg";

const TaskManager = () => {
  const { uid } = useParams();
  const [task, setTask] = useState({
    taskName: "",
    priority: "",
    dueDate: "",
    complete: "",
  });
  const [checked, setChecked] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [toDoList, setToDoList] = useState([]);

  const hangleToggleAddTask = () => {
    setAddTaskOpen(!addTaskOpen);
  };

  const hangleToggleRefresh = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const userRef = doc(db, "users", uid);

    const fetch = async () => {
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.toDoList) {
            setToDoList(userData.toDoList);
          }
        } else {
          setUserRole(null); // Handle the case when the user document doesn't exist
        }
      } catch (error) {
        console.error("Error getting user document:", error);
        setUserRole(null); // Handle errors by setting userRole to a fallback value
      }
    };

    fetch();
  }, [checked, uid]);

  const handleCheckBox = async (todo) => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const currentToDoList = userData.toDoList || [];
      const taskIndex = currentToDoList.findIndex(
        (taskItem) => taskItem.taskName === todo.taskName
      );
      if (taskIndex !== -1) {
        const updatedToDoList = [...currentToDoList];
        updatedToDoList[taskIndex] = {
          ...updatedToDoList[taskIndex],
          complete: !updatedToDoList[taskIndex].complete, // Toggle the "complete" field
        };
        await updateDoc(userRef, { toDoList: updatedToDoList });
        hangleToggleRefresh();
      }
    }
  };

  const handleUpdate = async () => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const currentToDoList = userData.toDoList || [];
      const updatedToDoList = currentToDoList.filter((task) => !task.complete);
      await updateDoc(userRef, { toDoList: updatedToDoList });
      toast.success("Your task has been updated successfully!");
      hangleToggleRefresh();
    }
  };

  const handleCloseAddTask = () => {
    setAddTaskOpen(false);
  };

  const onChangeTask = (e) => {
    const { id, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [id]: value,
    }));
  };

  const handleAddTask = async () => {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const currentToDoList = userData.toDoList || [];
      const updatedToDoList = [...currentToDoList, task];
      await updateDoc(userRef, { toDoList: updatedToDoList });
      toast.success("Your task has been added successfully!");
      handleCloseAddTask();
      hangleToggleRefresh();
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          backgroundImage: `url(${image})`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.6,
        }}
      ></div>
      <div className="flex items-center justify-center h-screen">
        <div
          className="fixed ml-1 border p-3 z-10 shadow-xl rounded bg-gray-600 text-white"
          style={{ maxWidth: "800px" }}
        >
          <div className="flex">
            <div
              className="bg-gray-800 pl-1 font-semibold pr-1 border rounded"
              style={{ maxWidth: "90px", paddingTop: "2px" }}
            >
              <button onClick={hangleToggleAddTask}>Add a task</button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-5">Task Manager</h2>
            <table
              className=" table-auto"
              style={{ borderCollapse: "collapse", maxWidth: "100%" }}
            >
              <thead>
                <tr>
                  <th className="px-4 py-2">Task Name</th>
                  <th className="px-4 py-2">Priority</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Complete</th>
                </tr>
              </thead>
              <tbody>
                {toDoList.map((todo, index) => (
                  <tr key={index} className="border">
                    <td className="py-1 text-center">{todo.taskName}</td>
                    <td className="py-1 text-center">{todo.priority}</td>
                    <td className="py-1 text-center">{todo.dueDate}</td>
                    <td className="py-1 text-center">
                      <input
                        type="checkbox"
                        checked={todo.complete}
                        onChange={() => handleCheckBox(todo)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleUpdate}
              className="mt-2 p-1 font-semibold border rounded bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
        {addTaskOpen && (
          <>
            <div
              style={{ maxWidth: "800px", zIndex: 9999, position: "relative" }}
              className="items-center flex flex-col bg-gray-600 p-3 border rounded"
            >
              <button
                onClick={handleCloseAddTask}
                className="text-white font-semibold text-xl mb-2 ml-0 self-start"
              >
                X
              </button>
              <input
                className=" px-4 w-full py-2 text-md text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-1"
                type="text"
                id="taskName"
                value={task.taskName}
                onChange={onChangeTask}
                placeholder="Task Name"
              />
              <input
                className=" px-4 py-2 w-full text-md text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-1"
                type="text"
                id="priority"
                value={task.priority}
                onChange={onChangeTask}
                placeholder="Priority"
              />
              <input
                className=" px-4 py-2 w-full text-md text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-1"
                type="text"
                id="dueDate"
                value={task.dueDate}
                onChange={onChangeTask}
                placeholder="Due Date"
              />
              <button
                onClick={handleAddTask}
                style={{ maxWidth: "80px" }}
                className=" pl-1 mt-3 pr-1 font-semibold bg-white text-black"
              >
                Add Task
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TaskManager;
