
import { LayoutDashboard, DollarSign, PieChart, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
    currentView: 'dashboard' | 'finance';
    onNavigate: (view: 'dashboard' | 'finance') => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
    const { theme, setTheme } = useTheme();

    return (
        <div className="w-54 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200">
            <div className="p-6 border-b border-slate-800 dark:border-slate-800 border-slate-200">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChart className="text-blue-500" />
                    VISÃO GERAL
                    <span className="text-slate-500 text-sm font-normal">2026</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        currentView === 'dashboard'
                            ? "bg-blue-600/10 text-blue-500"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <LayoutDashboard size={20} />
                    Dashboard Operacional
                </button>

                <button
                    onClick={() => onNavigate('finance')}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        currentView === 'finance'
                            ? "bg-emerald-600/10 text-emerald-500"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <DollarSign size={20} />
                    Financeiro
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800 dark:border-slate-800 border-slate-200 space-y-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </button>

                <div className="text-xs text-slate-500 px-4">
                    Atualizado em: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
