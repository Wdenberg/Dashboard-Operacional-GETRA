import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { FinanceView } from './views/FinanceView';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    const [currentView, setCurrentView] = useState<'dashboard' | 'finance'>('dashboard');

    return (
        <ThemeProvider>
            <DataProvider>
                <div className="flex bg-white dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
                    <Sidebar currentView={currentView} onNavigate={setCurrentView} />

                    <main className="flex-1 ml-64 p-8">
                        <header className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {currentView === 'dashboard' ? 'Dashboard Operacional' : 'Painel Financeiro'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                {currentView === 'dashboard'
                                    ? 'Acompanhamento de solicitações e volumetria.'
                                    : 'Gestão de custos e métricas financeiras.'}
                            </p>
                        </header>

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {currentView === 'dashboard' ? <DashboardView /> : <FinanceView />}
                        </div>
                    </main>
                </div>
            </DataProvider>
        </ThemeProvider>
    );
}

export default App;
