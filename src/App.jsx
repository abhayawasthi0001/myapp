import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [todoData, settodoData] = useState("");
  const [allTodos, setAllTodos] = useState([]);

  const [menuopen, setMenuopen] = useState(false);
  const [show, setShow] = useState(false);
  const [mainButton, setMainButton] = useState(true);
  const [todoForm, settodoForm] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleTitle = (e) => setTitle(e.target.value);
  const handletodoData = (e) => {
    settodoData(e.target.value);
    setCount(e.target.value.length);
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `https://todo-backend-lqyz.onrender.com/todos?name=${username}`
      );
      setAllTodos(response.data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await axios.delete(
        "https://todo-backend-lqyz.onrender.com/deleteTodo",
        {
          data: { name: username, todoId },
        }
      );
      alert("Todo deleted successfully!");
      await fetchTodos(); // Refresh the todo list
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMainButton(false);
    setShow(false);

    try {
      const response = await axios.post(
        "https://todo-backend-lqyz.onrender.com/signup",
        {
          name: username,
          password: password,
        }
      );

      if (response.data.todos) {
        setAllTodos(response.data.todos);
      } else {
        await fetchTodos();
      }
    } catch (error) {
      setError("Signup failed. Ensure the username and password are correct.");
      console.error("Error during signup:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://todo-backend-lqyz.onrender.com/addTodo",
        {
          name: username,
          title,
          data: todoData,
        }
      );
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

  return (
    <div className="App">
      <nav>
        <h1>TodoList</h1>
        <div className={menuopen === false && "display"}>
          <h3>
            <a href="/">Home</a>
          </h3>
          <h3>
            <a href="https://www.linkedin.com/in/abhay-awasthi/">Contact</a>
          </h3>
          {!mainButton && <button id="user">{username}</button>}
          {mainButton && (
            <>
              <button
                id="signup"
                onClick={() => {
                  setShow(!show);
                }}
              >
                Signup/Login
              </button>
            </>
          )}
        </div>
        {!menuopen && (
          <b
            id="hamburger"
            onClick={() => {
              setMenuopen(!menuopen);
            }}
          >
            &#9776;
          </b>
        )}
        {menuopen && (
          <b
            id="cross"
            onClick={() => {
              setMenuopen(!menuopen);
            }}
          >
            &#10006;
          </b>
        )}
      </nav>

      {allTodos.length === 0 && <article>Write Here</article>}
      {allTodos.length !== 0 && (
        <main id="allTodos">
          {allTodos.map((todo, index) => (
            <div id="datadiv" key={index}>
              <div>
                <h3>{todo.title}</h3>
                <p>{todo.data}</p>
              </div>
              <button onClick={() => handleDeleteTodo(todo._id)}>Del</button>
            </div>
          ))}
        </main>
      )}

      {show && (
        <form id="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up / Log in</h2>
          <input
            type="text"
            value={username}
            onChange={handleUsername}
            placeholder="Enter UserName"
            minLength={7}
            maxLength={15}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePassword}
            minLength={7}
            maxLength={15}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {!mainButton && (
        <button
          id="plus"
          onClick={() => {
            settodoForm(!todoForm);
          }}
        >
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
          />
          <h3>count:- {count}</h3>
          <textarea
            name="data"
            id="data"
            rows={20}
            cols={40}
            value={todoData}
            onChange={handletodoData}
          ></textarea>
          <button>submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
