import { useState, useEffect } from 'react'
import { supabase, type Goal, type SubGoal } from '../lib/supabase'

export default function GoalCompleterPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [subGoals, setSubGoals] = useState<{ [goalId: string]: SubGoal[] }>({})
  const [newGoal, setNewGoal] = useState('')
  const [newSubGoals, setNewSubGoals] = useState<{ [goalId: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [expandedGoals, setExpandedGoals] = useState<{ [goalId: string]: boolean }>({})

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching goals:', error.message)
        return
      }

      setGoals(data || [])
      
      // Auto-expand incomplete goals
      const expanded: { [goalId: string]: boolean } = {}
      data?.forEach(goal => {
        if (!goal.is_complete) {
          expanded[goal.id] = true
        }
      })
      setExpandedGoals(expanded)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch sub-goals for a specific goal
  const fetchSubGoals = async (goalId: string) => {
    try {
      const { data, error } = await supabase
        .from('sub_goals')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching sub-goals:', error.message)
        return
      }

      setSubGoals(prev => ({
        ...prev,
        [goalId]: data || []
      }))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Add a new goal
  const addGoal = async () => {
    if (newGoal.trim() === '') return

    try {
      const { error } = await supabase
        .from('goals')
        .insert([{ title: newGoal.trim() }])

      if (error) {
        console.error('Error adding goal:', error.message)
        return
      }

      setNewGoal('')
      fetchGoals()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Add a new sub-goal
  const addSubGoal = async (goalId: string) => {
    const subGoalTitle = newSubGoals[goalId]
    if (!subGoalTitle || subGoalTitle.trim() === '') return

    try {
      const { error } = await supabase
        .from('sub_goals')
        .insert([{ goal_id: goalId, title: subGoalTitle.trim() }])

      if (error) {
        console.error('Error adding sub-goal:', error.message)
        return
      }

      setNewSubGoals(prev => ({
        ...prev,
        [goalId]: ''
      }))
      fetchSubGoals(goalId)
      fetchGoals() // Refresh to update completion status
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Toggle sub-goal completion
  const toggleSubGoal = async (subGoalId: string, goalId: string, isComplete: boolean) => {
    try {
      const { error } = await supabase
        .from('sub_goals')
        .update({ is_complete: isComplete })
        .eq('id', subGoalId)

      if (error) {
        console.error('Error updating sub-goal:', error.message)
        return
      }

      fetchSubGoals(goalId)
      fetchGoals() // Refresh to update main goal completion status
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Delete a goal
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

      if (error) {
        console.error('Error deleting goal:', error.message)
        return
      }

      fetchGoals()
      // Remove from subGoals state
      setSubGoals(prev => {
        const newState = { ...prev }
        delete newState[goalId]
        return newState
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Delete a sub-goal
  const deleteSubGoal = async (subGoalId: string, goalId: string) => {
    try {
      const { error } = await supabase
        .from('sub_goals')
        .delete()
        .eq('id', subGoalId)

      if (error) {
        console.error('Error deleting sub-goal:', error.message)
        return
      }

      fetchSubGoals(goalId)
      fetchGoals() // Refresh to update main goal completion status
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }))
    
    // Fetch sub-goals if expanding and not already loaded
    if (!expandedGoals[goalId] && !subGoals[goalId]) {
      fetchSubGoals(goalId)
    }
  }

  // Handle Enter key press for goals
  const handleGoalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addGoal()
    }
  }

  // Handle Enter key press for sub-goals
  const handleSubGoalKeyPress = (e: React.KeyboardEvent, goalId: string) => {
    if (e.key === 'Enter') {
      addSubGoal(goalId)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchGoals()
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="goal-container">
        <div className="loading">
          <p>Loading goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="goal-container">
      <div className="header">
        <h1>Goal Completer</h1>
        <p>Set main goals and break them down into achievable sub-goals</p>
      </div>

      <div className="goal-input-section">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={handleGoalKeyPress}
          placeholder="Add a new main goal..."
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          No goals yet. Add your first goal above!
        </div>
      ) : (
        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal.id} className={`goal-card ${goal.is_complete ? 'completed' : ''}`}>
              <div className="goal-header" onClick={() => toggleGoalExpansion(goal.id)}>
                <div className="goal-title-section">
                  <span className={`goal-status ${goal.is_complete ? 'complete' : 'incomplete'}`}>
                    {goal.is_complete ? '✓' : '○'}
                  </span>
                  <h3 className={`goal-title ${goal.is_complete ? 'completed-text' : ''}`}>
                    {goal.title}
                  </h3>
                </div>
                <div className="goal-actions">
                  <span className="expand-icon">
                    {expandedGoals[goal.id] ? '▼' : '▶'}
                  </span>
                  <button 
                    className="delete-goal-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteGoal(goal.id)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedGoals[goal.id] && (
                <div className="sub-goals-section">
                  <div className="sub-goal-input">
                    <input
                      type="text"
                      value={newSubGoals[goal.id] || ''}
                      onChange={(e) => setNewSubGoals(prev => ({
                        ...prev,
                        [goal.id]: e.target.value
                      }))}
                      onKeyPress={(e) => handleSubGoalKeyPress(e, goal.id)}
                      placeholder="Add a sub-goal..."
                    />
                    <button onClick={() => addSubGoal(goal.id)}>Add Sub-Goal</button>
                  </div>

                  <div className="sub-goals-list">
                    {subGoals[goal.id]?.length === 0 ? (
                      <p className="no-sub-goals">No sub-goals yet. Add one above!</p>
                    ) : (
                      subGoals[goal.id]?.map((subGoal) => (
                        <div key={subGoal.id} className={`sub-goal-item ${subGoal.is_complete ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={subGoal.is_complete}
                            onChange={(e) => toggleSubGoal(subGoal.id, goal.id, e.target.checked)}
                          />
                          <span className={subGoal.is_complete ? 'completed-text' : ''}>
                            {subGoal.title}
                          </span>
                          <button 
                            className="delete-sub-goal-btn"
                            onClick={() => deleteSubGoal(subGoal.id, goal.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}