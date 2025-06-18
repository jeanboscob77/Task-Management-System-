import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [name, setName] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "https://task-manager-vh8t.onrender.com/api/tasks"
        );
        setTasks(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (task.trim()) {
      try {
        const res = await axios.post(
          "https://task-manager-vh8t.onrender.com/api/tasks",
          {
            task,
            completed,
          }
        );
        setTasks((prevTasks) => [...prevTasks, res.data]);
        setTask("");
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const editTaskHandler = async () => {
    try {
      const res = await axios.put(
        `https://task-manager-vh8t.onrender.com/api/tasks/${id}`,
        {
          task,
          completed,
        }
      );
      setTasks(
        tasks.map((item) =>
          item._id === id ? { ...item, task: res.data.task } : item
        )
      );
      fetchTasks;
    } catch (error) {
      console.error("Error editing task:", error);
    } finally {
      setName(false);
      setId(null);
      setTask("");
    }
  };

  const MainHandler = () => {
    if (!name) handleAddTask();
    else editTaskHandler();
  };

  const handleEditTask = (id) => {
    const edit = tasks.find((item) => item._id === id);
    setTask(edit.task);
    setId(id);
    setName(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(
        `https://task-manager-vh8t.onrender.com/api/tasks/${id}`
      );
      setTasks(tasks.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleChecked = async (id) => {
    const updatedTasks = tasks.map((item) =>
      item._id === id ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
    const updatedTask = updatedTasks.find((item) => item._id === id);
    try {
      await axios.put(
        `https://task-manager-vh8t.onrender.com/api/tasks/${id}`,
        {
          task: updatedTask.task,
          completed: updatedTask.completed,
        }
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="font-bold text-2xl mb-4">Task Manager</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="border flex-grow p-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          className="bg-blue-500 ml-2 text-xl text-white p-2 rounded"
          onClick={MainHandler}
        >
          {!name ? "Add" : "Update"}
        </button>
      </div>
      <div>
        {loading ? (
          <p>Loading data...</p>
        ) : (
          tasks.map((task) => (
            <ul className="list-none" key={task._id}>
              <li className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={task.completed}
                  onChange={() => handleChecked(task._id)}
                />
                <span
                  className={
                    task.completed
                      ? "flex-grow line-through decoration-red-600"
                      : "flex-grow"
                  }
                >
                  {task.task}
                </span>
                <div className="flex">
                  <FaEdit
                    className="cursor-pointer text-blue-500 mr-2"
                    onClick={() => handleEditTask(task._id)}
                  />
                  <FaTrash
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDeleteTask(task._id)}
                  />
                </div>
              </li>
            </ul>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
