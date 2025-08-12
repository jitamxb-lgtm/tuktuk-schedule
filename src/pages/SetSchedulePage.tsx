import { useState, useEffect } from 'react'
import { supabase, type Todo } from '../lib/supabase'

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

// Helper function to group todos by date
const groupTodosByDate = (todos: Todo[]) => {
  const groups: { [key: string]: Todo[] } = {}
  
  todos.forEach(todo => {
    const dateKey = new Date(todo.created_at).toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(todo)
  })
  
  // Sort groups by date (most recent first)
  const sortedGroups = Object.keys(groups)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .reduce((acc, key) => {
      acc[key] = groups[key]
      return acc
    }, {} as { [key: string]: Todo[] })
  
  return sortedGroups
}

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
        <div className="todo-groups">
          {todos.length === 0 ? (
            <div className="empty-state">
              No tasks yet. Add your first to-do above!
            </div>
          ) : (
            Object.entries(groupTodosByDate(todos)).map(([dateKey, dayTodos]) => (
              <div key={dateKey} className="todo-day-group">
                <h3 className="day-header">{formatDate(dateKey)}</h3>
                <ul className="todo-list">
                  {dayTodos.map((todo) => (
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
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}