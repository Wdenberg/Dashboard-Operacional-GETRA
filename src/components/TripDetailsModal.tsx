
import React, { ReactNode } from 'react';
import { X, Calendar, MapPin, FileText, CheckCircle, Clock, DollarSign, Activity, Building2, Info, Flag, User, Phone, Mail, Bus, Route, CircleDot } from 'lucide-react';
import { TripData } from '../types';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface TripDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: TripData | null;
}



// UI Components Stubs for compatibility with user request
const Button = ({ variant, size, onClick, className, children }: any) => (
    <button onClick={onClick} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50", className)}>
        {children}
    </button>
);
const Badge = ({ className, children }: any) => (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
        {children}
    </div>
);
const ScrollArea = ({ className, children }: any) => (
    <div className={cn("overflow-y-auto", className)}>{children}</div>
);
const Separator = ({ className }: any) => (
    <div className={cn("shrink-0 bg-border h-[1px] w-full my-4", className)} />
);

// Helpers


const formatDate = (date: any) => {
    if (!date) return '-';
    try {
        // Se for a string "1899-12-30...", ignore, pois isso é erro de conversão de hora
        if (typeof date === 'string' && date.startsWith('1899')) return '-';

        const d = typeof date === 'string' ? parseISO(date) : date;

        // Se a data veio como 00:00:00Z, o JS joga para o dia anterior.
        // Forçamos a compensação de fuso horário (ex: +3 horas para o Brasil)
        const timezoneOffset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() + timezoneOffset);

        return format(localDate, 'dd/MM/yyyy');
    } catch { return date; }
};

const formatTime = (date: any) => {
    if (!date) return '-';

    try {
        // Se for o formato 1899-12-30T03:00:00.000Z
        if (typeof date === 'string' && date.includes('T')) {
            // Dividimos a string para pegar apenas o que vem depois do 'T'
            const timePart = date.split('T')[1].substring(0, 5); // Pega "03:00"
            return timePart;
        }
        return date;
    } catch { return date; }
};
const formatCurrency = (val: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val) || 0);

// Status Colors Mappings
const statusColors: any = {
    'CONFIRMADA': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'REALIZADA': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'CANCELADA': 'bg-red-500/10 text-red-400 border-red-500/20',
    'NÃO ATENDIDA': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};
const statusColorsLight: any = {
    'CONFIRMADA': 'bg-blue-100 text-blue-700 border-blue-200',
    'REALIZADA': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'CANCELADA': 'bg-red-100 text-red-700 border-red-200',
    'NÃO ATENDIDA': 'bg-orange-100 text-orange-700 border-orange-200',
};

export function TripDetailsModal({ isOpen, onClose, trip: rawTrip }: TripDetailsModalProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Cast to any to access dynamic props from user JSON
    const trip = rawTrip as TripData;

    // Parse stops if available or mock
    // Use typed paradas array
    const paradas = trip?.paradas || [];

    if (!trip) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed right-0 top-0 h-full w-full max-w-xl z-50 shadow-2xl",
                            isDark ? "bg-slate-900 border-l border-slate-800" : "bg-white border-l border-gray-200"
                        )}
                    >
                        {/* Header */}
                        <div className={cn(
                            "sticky top-0 z-10 px-6 py-4 border-b",
                            isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-gray-200"
                        )}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className={cn("text-xs font-medium mb-1", isDark ? "text-slate-500" : "text-gray-500")}>
                                        Detalhes da Viagem
                                    </p>
                                    <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                                        {trip.seiNumber}
                                    </h3>
                                    <Badge className={cn("mt-2 border", isDark ? statusColors[trip.status] : statusColorsLight[trip.status])}>
                                        {trip.status}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className={isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <ScrollArea className="h-[calc(100vh-100px)]">
                            <div className="p-6">
                                {/* Informações Gerais */}
                                <Section title="📋 Informações Gerais" isDark={isDark}>
                                    <InfoRow icon={FileText} label="Código da Solicitação" value={trip.requestId} isDark={isDark} />
                                    <InfoRow icon={Building2} label="Empresa" value={trip.company || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Info} label="Programa" value={trip.program || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Flag} label="Nome do Evento" value={trip.eventName || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Calendar} label="Período do Evento" value={trip.eventPeriod || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Clock} label="Horário do Evento" value={trip.eventTime || 'N/A'} isDark={isDark} />
                                </Section>

                                {/* Solicitante */}
                                <Section title="👤 Solicitante" isDark={isDark}>
                                    <InfoRow icon={User} label="Nome" value={trip.nameSolicitant} isDark={isDark} />
                                    <InfoRow icon={Phone} label="Telefone" value={trip.phoneSolicitant || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Mail} label="E-mail" value={trip.emailSolicitant || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Building2} label="Executiva" value={trip.executive || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Building2} label="Setor" value={trip.sector} isDark={isDark} />
                                </Section>

                                {/* Responsável */}
                                <Section title="📞 Responsável" isDark={isDark}>
                                    <InfoRow icon={User} label="Nome" value={trip.nameResponsible || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Phone} label="Telefone" value={trip.phoneResponsible || 'N/A'} isDark={isDark} />
                                </Section>

                                {/* Trajeto */}
                                <Section title="🗺️ Trajeto" isDark={isDark}>
                                    <div className={cn("p-3 rounded-lg mb-3", isDark ? "bg-slate-700/50" : "bg-blue-50")}>
                                        <p className={cn("text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-gray-500")}>Origem</p>
                                        <p className={cn("font-semibold", isDark ? "text-cyan-400" : "text-blue-600")}>{trip.originCity || 'N/A'}</p>
                                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-700")}>{trip.originLocation || 'N/A'}</p>
                                        <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-500")}>{trip.originAddress || 'N/A'}</p>
                                    </div>

                                    {paradas.length > 0 && (
                                        <div className="mb-3">
                                            <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-400" : "text-gray-500")}>Paradas</p>
                                            {paradas.map((parada: any, index: any) => (
                                                <div key={index} className={cn("flex items-start gap-2 py-1.5 text-sm", isDark ? "text-slate-300" : "text-gray-700")}>
                                                    <CircleDot className={cn("h-3 w-3 mt-1 flex-shrink-0", isDark ? "text-slate-600" : "text-gray-400")} />
                                                    <span className="break-words">{parada}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-emerald-50")}>
                                        <p className={cn("text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-gray-500")}>Destino</p>
                                        <p className={cn("font-semibold", isDark ? "text-emerald-400" : "text-emerald-600")}>{trip.destinationCity || 'N/A'}</p>
                                        <p className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-700")}>{trip.destinationLocation || 'N/A'}</p>
                                        <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-500")}>{trip.destinationAddress || 'N/A'}</p>
                                    </div>
                                </Section>

                                {/* Datas e Horários */}
                                <Section title="📅 Datas e Horários" isDark={isDark}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={cn("text-xs font-medium mb-1", isDark ? "text-slate-500" : "text-gray-500")}>Data de Saída</p>
                                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>{formatDate(trip.departureDate)}</p>
                                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{formatTime(trip.departureTime)}</p>
                                        </div>
                                        <div>
                                            <p className={cn("text-xs font-medium mb-1", isDark ? "text-slate-500" : "text-gray-500")}>Data de Retorno</p>
                                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>{formatDate(trip.returnDate)}</p>
                                            <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{formatTime(trip.returnTime)}</p>
                                        </div>
                                    </div>
                                </Section>

                                {/* Veículo e Passageiros */}
                                <Section title="🚌 Veículo e Passageiros" isDark={isDark}>
                                    <InfoRow icon={Bus} label="Tipo de Veículo" value={trip.vehicleType || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Bus} label="Quantidade de Veículos" value={trip.qtyVehicles || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={User} label="Total de Passageiros" value={trip.qtyPassengers || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Route} label="Modalidade" value={trip.modalidade || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Info} label="Disponibilidade" value={trip.vehicleAvailability || 'N/A'} isDark={isDark} />
                                    <InfoRow icon={Info} label="Capacidade" value={`${((trip.vehicleCapacity || 0) * 100).toFixed(1)}% (${trip.vehicleStatus || 'N/A'})`} isDark={isDark} />
                                </Section>

                                {/* Valores */}
                                <Section title="💰 Valores" isDark={isDark}>
                                    <div className="space-y-3">
                                        <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-gray-100")}>
                                            <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-400" : "text-gray-500")}>Quilometragem</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Previsto: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.kmPredicted} km</span>
                                                </div>
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Realizado: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.kmRealized || '—'} km</span>
                                                </div>
                                            </div>
                                            <p className={cn("text-xs mt-2", isDark ? "text-slate-500" : "text-gray-500")}>
                                                Valor unitário: {formatCurrency(trip.kmUnitPrice)} por km
                                            </p>
                                            <p className={cn("text-sm font-semibold mt-1", isDark ? "text-cyan-400" : "text-blue-600")}>
                                                Total: {formatCurrency(trip.kmCostPredicted)}
                                            </p>
                                        </div>

                                        <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-gray-100")}>
                                            <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-400" : "text-gray-500")}>Diárias</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Previstas: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.dailyQtyPredicted}</span>
                                                </div>
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Realizadas: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.dailyQtyRealized || '—'}</span>
                                                </div>
                                            </div>
                                            <p className={cn("text-xs mt-2", isDark ? "text-slate-500" : "text-gray-500")}>
                                                Valor unitário: {formatCurrency(trip.dailyUnitPrice)}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                                <p className={cn("font-semibold", isDark ? "text-cyan-400" : "text-blue-600")}>
                                                    Prev: {formatCurrency(trip.dailyCostPredicted)}
                                                </p>
                                                <p className={cn("font-semibold", isDark ? "text-emerald-400" : "text-emerald-600")}>
                                                    Real: {formatCurrency(trip.dailyCostRealized) || '—'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-gray-100")}>
                                            <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-400" : "text-gray-500")}>Motorista Adicional</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Previsto: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.additionalDriverPredicted || '—'}</span>
                                                </div>
                                                <div>
                                                    <span className={isDark ? "text-slate-500" : "text-gray-500"}>Realizado: </span>
                                                    <span className={isDark ? "text-white" : "text-gray-900"}>{trip.additionalDriverRealized || '—'}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                                <p className={cn("font-semibold", isDark ? "text-cyan-400" : "text-blue-600")}>
                                                    Prev: {formatCurrency(trip.additionalDriverCostPredicted)}
                                                </p>
                                                <p className={cn("font-semibold", isDark ? "text-emerald-400" : "text-emerald-600")}>
                                                    Real: {formatCurrency(trip.additionalDriverCostRealized || '—')}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className={isDark ? "bg-slate-700" : "bg-gray-200"} />

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={cn("p-4 rounded-xl text-center", isDark ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-blue-50 border border-blue-200")}>
                                                <p className={cn("text-xs font-medium mb-1", isDark ? "text-cyan-400" : "text-blue-600")}>Total Previsto</p>
                                                <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                                                    {formatCurrency(trip.predictedTotal || '—')}
                                                </p>
                                            </div>
                                            <div className={cn("p-4 rounded-xl text-center", isDark ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-emerald-50 border border-emerald-200")}>
                                                <p className={cn("text-xs font-medium mb-1", isDark ? "text-emerald-400" : "text-emerald-600")}>Total Realizado</p>
                                                <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                                                    {formatCurrency(trip.realizedTotal) || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Section>

                                {/* Observações */}
                                {(trip.infCompletementary || trip.observacaoGeral || trip.motivo) && (
                                    <Section title="📝 Observações" isDark={isDark}>
                                        {trip.infCompletementary && (
                                            <InfoRow icon={Info} label="Informações Complementares" value={trip.infCompletementary} isDark={isDark} />
                                        )}
                                        {trip.observacaoGeral && (
                                            <InfoRow icon={Info} label="Observação Geral" value={trip.observacaoGeral} isDark={isDark} />
                                        )}
                                        {trip.motivo && (
                                            <InfoRow icon={Info} label="Motivo" value={trip.motivo} isDark={isDark} />
                                        )}
                                    </Section>
                                )}

                                {/* Prazos */}
                                <Section title="⏱️ Prazos" isDark={isDark}>
                                    <InfoRow icon={Calendar} label="Data do E-mail Enviado" value={formatDate(trip.dataEmailSent)} isDark={isDark} />
                                    <InfoRow icon={Calendar} label="Data Recebido na GETRA" value={formatDate(trip.dataReceived)} isDark={isDark} />
                                    <InfoRow icon={Clock} label="Prazo Envio → GETRA" value={`${trip.prazoEmailToGetra} dias`} isDark={isDark} />
                                    <InfoRow icon={Clock} label="Prazo Saída → GETRA" value={`${trip.prazoDepartureToGetra} dias`} isDark={isDark} />
                                </Section>
                            </div>
                        </ScrollArea>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

const Section = ({ title, children, isDark }: { title: string, children: ReactNode, isDark: boolean }) => (
    <div className="mb-6 last:mb-0">
        <h4 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-200" : "text-gray-800")}>
            {title}
        </h4>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoRow = ({ icon: Icon, label, value, isDark }: { icon: any, label: string, value: any, isDark: boolean }) => (
    <div className="flex items-start gap-3">
        <div className={cn("p-1.5 rounded-md mt-0.5", isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500")}>
            <Icon size={14} />
        </div>
        <div className="flex-1">
            <p className={cn("text-xs font-medium", isDark ? "text-slate-500" : "text-gray-500")}>{label}</p>
            <p className={cn("text-sm", isDark ? "text-slate-200" : "text-gray-900")}>{value || '—'}</p>
        </div>
    </div>
);
