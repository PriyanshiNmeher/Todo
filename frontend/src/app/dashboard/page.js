import { getTodos } from '@/app/actions';
import TodoList from './components/TodoList';
import Header from './components/Header';

export default async function DashboardPage() {
  // Fetch initial todos on the server (SSR)
  const initialTodos = await getTodos();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Header />
        
        <main className="mt-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-100">Your Tasks</h2>
            <div className="flex space-x-2 text-sm text-gray-400 bg-black/20 py-1 px-3 rounded-full border border-white/5">
               <span className="font-semibold text-indigo-400">{initialTodos.filter(t => t.isCompleted).length}</span>
               <span>/ {initialTodos.length} done</span>
            </div>
          </div>
          
          <TodoList initialTodos={initialTodos} />
        </main>
      </div>
    </div>
  );
}
