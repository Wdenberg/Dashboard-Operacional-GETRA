import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { FilterBar } from '../components/FilterBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Map, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export function FinanceView() {
    const { filteredData, loading } = useData();

    const metrics = useMemo(() => {
        const acc = {
            predicted: 0, realized: 0,
            kmPred: 0, kmReal: 0,
            kmCostPred: 0, kmCostReal: 0,
            dailyQtyPred: 0, dailyQtyReal: 0,
            dailyCostPred: 0, dailyCostReal: 0,
            orçamentoTotal: 0,
            dailyQtyDone: 0,
            additionalDriverPredicted: 0,
            additionalDriverRealized: 0,
            additionalDriverCostPred: 0,
            additionalDriverCostReal: 0,
        };

        filteredData.forEach(d => {
            acc.predicted += Number(d.predictedTotal) || 0;
            acc.realized += Number(d.realizedTotal) || 0;

            acc.kmPred += Number(d.kmPredicted) || 0;
            acc.kmReal += Number(d.kmRealized) || 0;
            acc.kmCostPred += Number(d.kmCostPredicted) || 0;
            acc.kmCostReal += Number(d.kmCostRealized) || 0;

            acc.dailyQtyPred += Number(d.dailyQtyPredicted) || 0;
            acc.dailyQtyReal += Number(d.dailyQtyRealized) || 0;
            acc.dailyCostPred += Number(d.dailyCostPredicted) || 0;
            acc.dailyCostReal += Number(d.dailyCostRealized) || 0;

            acc.additionalDriverPredicted += Number(d.additionalDriverPredicted) || 0;
            acc.additionalDriverRealized += Number(d.additionalDriverRealized) || 0;
            acc.additionalDriverCostPred += Number(d.additionalDriverCostPredicted) || 0;
            acc.additionalDriverCostReal += Number(d.additionalDriverCostRealized) || 0;

        });

        return acc;
    }, [filteredData]);

    const chartData = [
        { name: 'Geral', previsto: metrics.predicted, realizado: metrics.realized },
        { name: 'KM (R$)', previsto: metrics.kmCostPred, realizado: metrics.kmCostReal },
        { name: 'Diárias (R$)', previsto: metrics.dailyCostPred, realizado: metrics.dailyCostReal },
    ];

    const formatMoney = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const formatNumber = (val: number) =>
        new Intl.NumberFormat('pt-BR').format(val);

    const diariasFeitas = useMemo(() => {
        return filteredData
            .reduce((sum, trip) => sum + (Number(trip.dailyQtyRealized) || 0), 0); // Soma as diárias
    }, [filteredData]);

    if (loading) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Carregando dados financeiros...</div>;
    }

    /**
     * Calcula motoristas adicionais e custo baseado na distância
     * Regra: +1 motorista a cada 500km (ex: 501km precisa de 1 add)
     * Custo: R$ 100 por motorista adicional
     
    const calculateAdditionalDriver = (distanceKm: number, additionalDriverPredicted: string, additionalDriverRealized: string) => {
        // Math.floor divide por 500 e arredonda para baixo
        // Ex: 499km = 0 | 500km = 1 | 999km = 1 | 1000km = 2
        const additionalDrivers = Math.floor(distanceKm / 500);
        const additionalCost = additionalDrivers * 100;


        return {
            additionalDrivers,
            additionalCost,
            additionalDriverPredicted,
            additionalDriverRealized
        };
    };
    */
    console.log(`Motorista adcional ${metrics.additionalDriverPredicted}`)
    console.log(`Motorista adcional ${metrics.additionalDriverRealized}`)
    console.log(`Motorista adcional ${metrics.additionalDriverCostPred}`)
    console.log(`Motorista adcional ${metrics.additionalDriverCostReal}`)
    return (
        <div className="space-y-6">
            <FilterBar />

            {/* Global Totals */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <MetricCard
                    title="Total Geral Previsto"
                    value={formatMoney(metrics.predicted)}
                    icon={<DollarSign className="text-blue-500" />}
                    subtext={`Orçamento Total ${formatMoney(metrics.orçamentoTotal - metrics.predicted)}`}
                />
                <MetricCard
                    title="Total Geral Realizado"
                    value={formatMoney(metrics.realized)}
                    icon={<DollarSign className="text-emerald-500" />}
                    subtext={`Saldo: ${formatMoney(metrics.predicted - metrics.realized)}`}
                    highlight
                />
            </div>

            {/* Detailed Comparisons */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detalhamento Operacional</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {/* KM Quantity */}
                <ComparisonCard
                    title="Quilometragem (Qtd)"
                    icon={<Map className="text-orange-500" />}
                    predLabel="Previsto" predValue={`${formatNumber(metrics.kmPred)} km`}
                    realLabel="Realizado" realValue={`${formatNumber(metrics.kmReal)} km`}
                />
                {/* KM Cost */}
                <ComparisonCard
                    title="Total KM (R$)"
                    icon={<DollarSign className="text-orange-500" />}
                    predLabel="Previsto" predValue={formatMoney(metrics.kmCostPred)}
                    realLabel="Realizado" realValue={formatMoney(metrics.kmCostReal)}
                />
                {/* Daily Quantity */}
                <ComparisonCard
                    title="Diárias (Qtd)"
                    icon={<Clock className="text-purple-500" />}
                    predLabel="Previsto" predValue={formatNumber(metrics.dailyQtyPred)}
                    realLabel="Realizado" realValue={formatNumber(diariasFeitas)}
                />
                {/* Daily Cost */}
                <ComparisonCard
                    title="Total Diárias (R$)"
                    icon={<DollarSign className="text-purple-500" />}
                    predLabel="Previsto" predValue={formatMoney(metrics.dailyCostPred)}
                    realLabel="Realizado" realValue={formatMoney(metrics.dailyCostReal)}
                />
                {/* Motorista Adicional */}
                <ComparisonCard
                    title="Motorista Adicional (Qtd)"
                    icon={<DollarSign className="text-purple-500" />}
                    predLabel="Previsto" predValue={formatNumber(metrics.additionalDriverPredicted)}
                    realLabel="Realizado" realValue={formatNumber(metrics.additionalDriverRealized)}
                />

                <ComparisonCard
                    title="Motorista Adicional (R$)"
                    icon={<DollarSign className="text-purple-500" />}
                    predLabel="Previsto" predValue={formatNumber(metrics.additionalDriverCostPred)}
                    realLabel="Realizado" realValue={formatNumber(metrics.additionalDriverCostReal)}
                />
                {/* Orçamento */}
                <ComparisonCard
                    title="Orçamento Total"
                    icon={<DollarSign className="text-orange-500" />}
                    predLabel="Orçamento Previsto" predValue={formatMoney(metrics.orçamentoTotal)}
                    realLabel="Saldo Usado" realValue={formatMoney(metrics.orçamentoTotal - metrics.predicted)}
                />

            </div>

            {/* Main Chart Section */}
            <div className="bg-slate-800 border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200 p-6 rounded-xl border shadow-sm transition-colors">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Comparativo Financeiro (Previsto vs Realizado)</h2>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(val) => `R$ ${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                                formatter={(value: number) => formatMoney(value)}
                            />
                            <Legend />
                            <Bar dataKey="previsto" name="Previsto" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="realizado" name="Realizado" fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, subtext, highlight }: { title: string, value: string, icon: React.ReactNode, subtext?: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-xl border shadow-sm flex flex-col justify-between transition-colors",
            highlight
                ? "bg-slate-800 border-emerald-500/50 dark:bg-slate-800 dark:border-emerald-500/50 bg-white border-emerald-200"
                : "bg-slate-800 border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200"
        )}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
                <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg">{icon}</div>
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
                {subtext && <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
            </div>
        </div>
    );
}

function ComparisonCard({ title, icon, predLabel, predValue, realLabel, realValue }: {
    title: string, icon: React.ReactNode,
    predLabel: string, predValue: string,
    realLabel: string, realValue: string
}) {
    return (
        <div className="bg-slate-800 border-slate-700 dark:bg-slate-800 dark:border-slate-700 bg-white border-slate-200 p-5 rounded-xl border shadow-sm flex flex-col gap-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                {icon}
                <h3 className="text-slate-700 dark:text-slate-300 font-semibold">{title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-slate-400 mb-1">{predLabel}</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{predValue}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">{realLabel}</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{realValue}</p>
                </div>
            </div>
        </div>
    );
}
