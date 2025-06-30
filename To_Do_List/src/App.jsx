import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for the new task input field
  const [task, setTask] = useState('');
  // State for the list of todos, each as an object { id, text, completed, editing }
  const [todos, setTodos] = useState(() => {
    // Initialize todos from localStorage, or an empty array if nothing is saved
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  // State for the current filter: 'all', 'active', 'completed'
  const [filter, setFilter] = useState('all');
  // State for the task currently being edited
  const [editingTaskId, setEditingTaskId] = useState(null);
  // State for the value of the editing input field
  const [editingText, setEditingText] = useState('');

  // Effect to save todos to localStorage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Handler for adding a new task
  const handleAdd = () => {
    if (task.trim()) {
      const newTodo = {
        id: Date.now(), // Unique ID for each todo
        text: task.trim(),
        completed: false,
        editing: false, // Not in editing mode initially
      };
      setTodos([...todos, newTodo]);
      setTask(''); // Clear the input field
    }
  };

  // Handler for deleting a task
  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  // Handler for toggling task completion status
  const handleToggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  // Handler to start editing a task
  const handleEdit = (id, currentText) => {
    setEditingTaskId(id);
    setEditingText(currentText);
  };

  // Handler to save the edited task
  const handleSaveEdit = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editingText.trim(), editing: false } : todo
    );
    setTodos(newTodos);
    setEditingTaskId(null); // Exit editing mode
    setEditingText(''); // Clear editing text state
  };

  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  // Handler for clearing all completed tasks
  const handleClearCompleted = () => {
    const activeTodos = todos.filter((todo) => !todo.completed);
    setTodos(activeTodos);
  };

  // Filtered todos based on the current filter state
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    }
    return true; // 'all' filter
  });

  return (
    <div className="app">
      <h1>
        <span role="img" aria-label="clipboard">
          📋
        </span>{' '}
        My To-Do List
      </h1>

      <div className="input-section">
        <input
          type="text"
          id="todo-input"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button id="add-todo-btn" onClick={handleAdd}>
          Add Task
        </button>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active-filter' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <ul className="todo-list" id="todo-list">
        {filteredTodos.length === 0 && <p className="no-tasks-message">No tasks yet!</p>}
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {editingTaskId === todo.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(todo.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus // Automatically focus the input when in edit mode
                />
                <div className="edit-actions">
                  <button onClick={() => handleSaveEdit(todo.id)}>
                    <span role="img" aria-label="save">
                      💾
                    </span>{' '}
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-edit">
                    <span role="img" aria-label="cancel">
                      ✖️
                    </span>{' '}
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="task-text" onClick={() => handleToggleComplete(todo.id)}>
                  {todo.text}
                </span>
                <div className="todo-actions">
                  <button
                    className="edit"
                    onClick={() => handleEdit(todo.id, todo.text)}
                    title="Edit Task"
                  >
                    <span role="img" aria-label="edit">
                      ✏️
                    </span>
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(todo.id)}
                    title="Delete Task"
                  >
                    <span role="img" aria-label="delete">
                      🗑️
                    </span>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="footer-actions">
          <button className="clear-completed" onClick={handleClearCompleted}>
            Clear Completed ({todos.filter((t) => t.completed).length})
          </button>
          <span className="tasks-left">
            {todos.filter((t) => !t.completed).length} items left
          </span>
        </div>
      )}
    </div>
  );
}

export default App;