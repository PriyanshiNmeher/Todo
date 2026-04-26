'use client';

import { logOut } from '@/app/actions';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center transform rotate-3 shadow-lg shadow-indigo-500/30">
          <svg className="w-6 h-6 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Todo App</h1>
      </div>
      
      <button 
        onClick={() => logOut()} 
        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
      >
        Sign Out
      </button>
    </header>
  );
}
