'use client';

import { useState, useTransition, useEffect } from 'react';
import { createTodo, toggleTodo, deleteTodo } from '@/app/actions';

export default function TodoList({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTitle, setNewTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    // Optimistic UI update
    const tempId = 'temp-' + Date.now() + Math.random();
    const optimisticTodo = { id: Date.now(), documentId: tempId, title: newTitle, isCompleted: false, isOptimistic: true };
    setTodos([optimisticTodo, ...todos]);
    
    const titleToSubmit = newTitle;
    setNewTitle('');

    startTransition(async () => {
      const result = await createTodo(new FormData(e.target));
      if (result && result.success && result.todo) {
        setTodos(current => current.map(t => t.documentId === tempId ? result.todo : t));
      }
    });
    setIsAdding(false);
  };

  // We need to sync props to state if revalidatePath brings new data
  // Alternatively, just use the server props directly
  // Sync props to state if revalidatePath brings new data
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleToggle = (id, documentId, currentState) => {
    const targetId = documentId || id;
    // Optimistic toggle
    setTodos(todos.map(t => (t.documentId || t.id) === targetId ? { ...t, isCompleted: !currentState } : t));
    
    startTransition(async () => {
      await toggleTodo(targetId, !currentState);
    });
  };

  const handleDelete = (id, documentId) => {
    const targetId = documentId || id;
    // Optimistic delete
    setTodos(todos.filter(t => (t.documentId || t.id) !== targetId));

    startTransition(async () => {
      await deleteTodo(targetId);
    });
  };

  return (
    <div>
      {/* Add Todo Form */}
      <form onSubmit={handleAdd} className="mb-8 relative flex shadow-2xl">
        <input
          type="text"
          name="title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isAdding}
          className="w-full pl-6 pr-32 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || isAdding}
          className="absolute right-2 top-2 bottom-2 px-6 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline mr-2">Add</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <svg className="w-16 h-16 mb-4 text-gray-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg">No tasks yet. Create one above!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.documentId || todo.id}
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                todo.isCompleted 
                  ? 'bg-white/5 border-white/5 opacity-60' 
                  : 'bg-black/20 border-white/10 hover:bg-black/30 hover:border-white/20'
              } ${todo.isOptimistic ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => handleToggle(todo.id, todo.documentId, todo.isCompleted)}
                  disabled={todo.isOptimistic}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    todo.isCompleted 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                      : 'border-2 border-gray-600 hover:border-indigo-400 text-transparent'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className={`text-lg transition-all ${todo.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id, todo.documentId)}
                disabled={todo.isOptimistic}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                aria-label="Delete todo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
