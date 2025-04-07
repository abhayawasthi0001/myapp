import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [todoData, settodoData] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuopen, setMenuopen] = useState(false);
  const [show, setShow] = useState(false);
  const [mainButton, setMainButton] = useState(true);
  const [todoForm, settodoForm] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const BACKEND_URL = "https://todo-backend-lqyz.onrender.com"; // Render backend URL

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleTitle = (e) => setTitle(e.target.value);
  const handletodoData = (e) => {
    settodoData(e.target.value);
    setCount(e.target.value.length);
  };

  // Fetch todos when user logs in or adds/deletes a todo
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/todos?name=${username}`);
      setAllTodos(response.data.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to fetch todos.");
    }
  };

  // Fetch users for admin panel (excluding admin)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admin/users?name=${username}&password=${password}`
      );
      setAllUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
  };

  // Handle todo deletion
  const handleDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`${BACKEND_URL}/deleteTodo`, {
        data: { name: username, todoId },
      });
      alert("Todo deleted successfully!");
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo. Try again.");
    }
  };

  // Handle user deletion (admin only)
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${BACKEND_URL}/admin/deleteUser`, {
        data: { name: username, password, userId },
      });
      alert("User deleted!");
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Handle signup/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMainButton(false);
    setShow(false);

    try {
      const response = await axios.post(`${BACKEND_URL}/signup`, {
        name: username,
        password,
      });

      // Check if the user is admin
      if (username === "Abhay Awasthi" && password === "Abhay7@123") {
        setIsAdmin(true);
        await fetchUsers(); // Fetch all non-admin users
      } else {
        setIsAdmin(false);
        if (response.data.todos) {
          setAllTodos(response.data.todos);
        } else {
          await fetchTodos();
        }
      }
    } catch (error) {
      setError("Signup/Login failed. Check your credentials.");
      setMainButton(true); // Reset to show signup button again
      setShow(true); // Show form again
      console.error("Error during signup/login:", error);
    }
  };

  // Handle adding a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/addTodo`, {
        name: username,
        title,
        data: todoData,
      });
      alert("Todo added successfully!");
      setTitle("");
      settodoData("");
      settodoForm(false);
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo. Try again.");
    }
  };

  // Reset error when component mounts or state changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="App">
      <nav>
        <h1>TodoList</h1>
        <div className={menuopen === false ? "display" : ""}>
          <h3>
            <a href="/">Home</a>
          </h3>
          <h3>
            <a href="https://www.linkedin.com/in/abhay-awasthi/">Contact</a>
          </h3>
          {!mainButton && <button id="user">{username}</button>}
          {mainButton && (
            <button id="signup" onClick={() => setShow(!show)}>
              Signup/Login
            </button>
          )}
        </div>
        {!menuopen && (
          <b id="hamburger" onClick={() => setMenuopen(true)}>
            ☰
          </b>
        )}
        {menuopen && (
          <b id="cross" onClick={() => setMenuopen(false)}>
            ✖
          </b>
        )}
      </nav>

      {error && <div className="error">{error}</div>}

      {!isAdmin ? (
        <>
          {allTodos.length === 0 && <article>Write Here</article>}
          {allTodos.length !== 0 && (
            <main id="allTodos">
              {allTodos.map((todo) => (
                <div id="datadiv" key={todo._id}>
                  <div>
                    <h3>{todo.title}</h3>
                    <p>{todo.data}</p>
                  </div>
                  <button onClick={() => handleDeleteTodo(todo._id)}>
                    Del
                  </button>
                </div>
              ))}
            </main>
          )}
        </>
      ) : (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          {allUsers.length === 0 ? (
            <p>No users to display.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.password}</td>
                    <td>
                      <button onClick={() => deleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {show && (
        <form id="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up / Log in</h2>
          <input
            type="text"
            value={username}
            onChange={handleUsername}
            placeholder="Enter UserName"
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePassword}
            minLength={7}
            maxLength={20}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {!mainButton && !isAdmin && (
        <button id="plus" onClick={() => settodoForm(!todoForm)}>
          +
        </button>
      )}
      {todoForm && (
        <form id="todoAdd" onSubmit={handleAddTodo}>
          <h2>Add Todo</h2>
          <input
            type="text"
            placeholder="Enter Title:-"
            value={title}
            onChange={handleTitle}
            required
          />
          <h3>count: {count}</h3>
          <textarea
            name="data"
            id="data"
            rows={20}
            cols={40}
            value={todoData}
            onChange={handletodoData}
            required
          ></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
