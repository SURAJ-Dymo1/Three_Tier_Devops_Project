import React, { useEffect, useState } from "react";

// This is for local run
// const API_URL = "http://localhost:8082/todos";


// const API_URL = "http://3.84.187.133:8082/todos";

// this is for run when backend is running in deploymet-pod-container

const API_URL = "http://localhost:8082/todos";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch todos
  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create or Update todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (editingId) {
      // Update
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      setEditingId(null);
    } else {
      // Create
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    }

    setText("");
    fetchTodos();
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  // Edit todo
  const editTodo = (todo) => {
    setText(todo.text);
    setEditingId(todo.id);
  };

  return (
    <div style={styles.container}>
      <h2>Todo App Hey Ram Siya laxman and Hanuman</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <ul style={styles.list}>
        { todos && todos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <span>{todo.text}</span>
            <div>
              <button
                onClick={() => editTodo(todo)}
                style={styles.editBtn}
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    fontFamily: "Arial",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  button: {
    padding: "8px 12px",
  },
  list: {
    marginTop: "20px",
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "5px",
  },
  editBtn: {
    marginRight: "5px",
  },
  deleteBtn: {
    color: "red",
  },
};

export default Todo;
