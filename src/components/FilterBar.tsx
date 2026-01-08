import React from 'react';
import { Search, Filter, Calendar, Users } from 'lucide-react';
import { useData } from '../context/DataContext';

export function FilterBar() {
    const { filters, setFilters, uniqueSectors, uniqueMonths } = useData();

    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-700 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar NÚMERO DO SEI..."
                        value={filters.searchSei}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchSei: e.target.value }))}
                        className="w-full bg-slate-900 border-slate-700 text-slate-100 pl-10 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users size={16} className="text-slate-400" />
                    </div>
                    <select
                        value={filters.sector}
                        onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-slate-200 pl-10 pr-8 py-2 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none border hover:border-slate-600 transition-colors"
                    >
                        <option value="">Todos os Setores</option>
                        {uniqueSectors.filter(s => s && s.trim() !== 'N/A').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-slate-400" />
                    </div>
                    <select
                        value={filters.month}
                        onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-slate-200 pl-10 pr-8 py-2 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none border hover:border-slate-600 transition-colors"
                    >
                        <option value="">Todo o Período</option>
                        {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={16} className="text-slate-400" />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="bg-slate-900 border-slate-700 text-slate-200 pl-10 pr-8 py-2 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none border hover:border-slate-600 transition-colors"
                    >
                        <option value="">Todos Status</option>
                        <option value="CONFIRMADA">CONFIRMADA</option>
                        <option value="REALIZADA">REALIZADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                        <option value="NÃO ATENDIDA">NÃO ATENDIDA</option>
                        <option value="COBRANÇA APENAS DE DIÁRIA">COBRANÇA DIÁRIA</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
