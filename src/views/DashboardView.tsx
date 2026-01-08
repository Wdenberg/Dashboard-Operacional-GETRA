import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { FilterBar } from '../components/FilterBar';
import { Car, FileText, MapPin, CheckCircle, XCircle, AlertCircle, Clock, Search } from 'lucide-react';
import { TripDetailsModal } from '../components/TripDetailsModal';
import { TripData } from '../types';
import { formatDate } from '@/lib/dataFormatter';

export function DashboardView() {
    const { filteredData, loading } = useData();
    const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const kpis = useMemo(() => {
        const uniqueSei = new Set(filteredData.map(d => d.seiNumber).filter(Boolean)).size;
        const totalRequests = filteredData.length;
        const uniqueDestinations = new Set(filteredData.map(d => d.destination).filter(Boolean)).size;

        return { uniqueSei, totalRequests, uniqueDestinations };
    }, [filteredData]);

    const statusCounts = useMemo(() => {
        const counts = {
            CONFIRMADA: 0,
            REALIZADA: 0,
            CANCELADA: 0,
            'NÃO ATENDIDA': 0,
            'COBRANÇA APENAS DE DIÁRIA': 0,
            'SOLICITADA': 0,
        };
        filteredData.forEach(d => {
            const s = d.status.toUpperCase();
            if (s.includes('CONFIRMADA')) counts.CONFIRMADA++;
            else if (s.includes('REALIZADA')) counts.REALIZADA++;
            else if (s.includes('CANCELADA')) counts.CANCELADA++;
            else if (s.includes('NÃO ATENDIDA')) counts['NÃO ATENDIDA']++;
            else if (s.includes('DIÁRIA')) counts['COBRANÇA APENAS DE DIÁRIA']++;
            else if (s.includes('SOLICITADA')) counts.SOLICITADA++;
        });
        return counts;
    }, [filteredData]);

    const recentTrips = useMemo(() => {
        // Assume data works best sorted by date if available, or just taking the top slice
        return filteredData.filter(trip => {
            return trip.seiNumber && trip.nameSolicitant && trip.status;
        });
    }, [filteredData]);

    const handleTripClick = (trip: TripData) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Carregando dados...</div>;
    }

    return (
        <div className="space-y-6">
            <FilterBar />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard
                    title="Total de Viagens (SEI)"
                    value={kpis.uniqueSei}
                    icon={<Car className="text-blue-500" size={24} />}
                />
                <KpiCard
                    title="Total de Processos"
                    value={kpis.totalRequests}
                    icon={<FileText className="text-purple-500" size={24} />}
                />
                <KpiCard
                    title="Destinos Únicos"
                    value={kpis.uniqueDestinations}
                    icon={<MapPin className="text-rose-500" size={24} />}
                />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusCard label="Solicitada" value={statusCounts.SOLICITADA} color="bg-indigo-500" icon={<Clock size={16} />} />
                <StatusCard label="Confirmada" value={statusCounts.CONFIRMADA} color="bg-blue-500" icon={<CheckCircle size={16} />} />
                <StatusCard label="Realizada" value={statusCounts.REALIZADA} color="bg-emerald-500" icon={<CheckCircle size={16} />} />
                <StatusCard label="Cancelada" value={statusCounts.CANCELADA} color="bg-red-500" icon={<XCircle size={16} />} />
                <StatusCard label="Não Atendida" value={statusCounts['NÃO ATENDIDA']} color="bg-orange-500" icon={<AlertCircle size={16} />} />
                <StatusCard label="Cobrança/Diária" value={statusCounts['COBRANÇA APENAS DE DIÁRIA']} color="bg-yellow-500" icon={<Clock size={16} />} />
            </div>

            {/* Recent Trips Table */}
            <div className="bg-slate-800 border border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200 rounded-xl shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Viagens Recentes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-3 font-medium">SEI</th>
                                <th className="px-6 py-3 font-medium">Solicitante</th>
                                <th className="px-6 py-3 font-medium">Data Saída</th>
                                <th className="px-6 py-3 font-medium">Destino</th>
                                <th className="px-6 py-3 font-medium">Passageiros</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {recentTrips.map((trip) => (
                                <tr
                                    key={trip.requestId}
                                    onClick={() => handleTripClick(trip)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{trip.seiNumber}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{trip.nameSolicitant}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {trip.departureDate ? formatDate(trip.departureDate) : '-'}
                                    </td>

                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{trip.destination}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{trip.qtyPassengers}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${trip.status.includes('CONFIRMADA') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                trip.status.includes('REALIZADA') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    trip.status.includes('CANCELADA') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                            <Search size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TripDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trip={selectedTrip}
            />
        </div>
    );
}

function KpiCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-800 border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200 p-6 rounded-xl border shadow-sm flex items-center justify-between transition-colors">
            <div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                {icon}
            </div>
        </div>
    );
}

function StatusCard({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-800 border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200 p-4 rounded-xl border shadow-sm flex flex-col gap-2 transition-colors">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                {icon}
                {label}
            </div>
            <div className="flex items-center gap-3">
                <span className={`w-1 h-8 rounded-full ${color}`}></span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
            </div>
        </div>
    );
}
