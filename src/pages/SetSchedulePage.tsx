import { useState, useEffect } from 'react'
import { supabase, type Todo } from '../lib/supabase'

export default function SetSchedulePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching todos:', error.message)
        return
      }

      setTodos(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add a new todo
  const addTodo = async () => {
    if (newTodo.trim() === '') return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTodo.trim(), is_complete: false }])
        .select()

      if (error) {
        console.error('Error adding todo:', error.message)
        return
      }

      setNewTodo('')
      fetchTodos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Toggle todo completion
  const toggleTodo = async (id: string, isComplete: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: isComplete })
        .eq('id', id)

      if (error) {
        console.error('Error updating todo:', error.message)
        return
      }

      fetchTodos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting todo:', error.message)
        return
      }

      fetchTodos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="todo-container">
      <div className="header">
        <h1>Daily To-Do List</h1>
        <p>Manage your daily tasks and mark them as complete.</p>
      </div>

      <div className="todo-input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new to-do..."
        />
        <button onClick={addTodo}>Add To-Do</button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading todos...</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">
              No tasks yet. Add your first to-do above!
            </li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.is_complete ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                />
                <span>{todo.task}</span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}