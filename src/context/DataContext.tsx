import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { TripData, FilterState, ApiRow } from '../types';
import { parseISO, isValid, format } from 'date-fns';

interface DataContextType {
    data: TripData[];
    loading: boolean;
    error: string | null;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    filteredData: TripData[];
    uniqueSectors: string[];
    uniqueMonths: string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<TripData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        searchSei: '',
        sector: '',
        month: '',
        status: '',
    });

    useEffect(() => {
        fetch('https://script.google.com/macros/s/AKfycbzcC4wcOk7ze8Eq6GiJ1o2Y4JYpp5HoB18eWMf1HLeoRrI3Ua2Nr8XlIJQoMoGD2U0Y/exec')
            .then((res) => res.json())
            .then((rawData: ApiRow[]) => {
                console.log('Raw API Data:', rawData[0]); // Debug first row
                const mappedData = rawData.map((row) => {
                    let departureDate = new Date();
                    if (row['DATA DE SAÍDA']) {
                        const parsed = parseISO(row['DATA DE SAÍDA']);
                        if (isValid(parsed)) departureDate = parsed;
                    }

                    // Safe parsing helper
                    const parseCurrency = (val: any) => {
                        if (typeof val === 'number') return val;
                        if (typeof val === 'string') {
                            return parseFloat(val.replace('R$', '').replace('.', '').replace(',', '.') || '0');
                        }
                        return 0;
                    };

                    const listaDeParadas = [
                        row['PARADA 1'],
                        row['PARADA 2'],
                        row['PARADA 3'],
                        row['PARADA 4'],
                        row['PARADA 5'],
                        row['PARADA 6']
                    ]

                    return {
                        seiNumber: row['NÚMERO DO SEI']?.toString() || '',
                        departureDate: departureDate,
                        status: row['STATUS FINAL']?.toString().toUpperCase() || 'DESCONHECIDO',
                        requestId: row['CÓDIGO DA SOLICITAÇÃO']?.toString() || '',
                        nameSolicitant: row['NOME DO SOLICITANTE'] || '',
                        destination: row['CIDADE DE DESTINO'] || '',
                        predictedTotal: parseCurrency(row['TOTAL GERAL PREVISTO']),
                        realizedTotal: parseCurrency(row['TOTAL GERAL REALIZADO']),
                        sector: row['SETOR DO SOLICITANTE'] || row['SETOR DO SOLICITANTE'] || row['SETOR'] || 'N/A',
                        qtyPassengers: parseCurrency(row['TOTAL DE PASSAGEIROS'] || 0),

                        phoneSolicitant: row['TELEFONE DO SOLICITANTE'] || '',
                        emailSolicitant: row['E-MAIL DO SOLICITANTE'] || '',
                        executive: row['EXECUTIVA'] || '',
                        company: row['EMPRESA'] || '',

                        program: row['PROGRAMA'] || '',
                        eventName: row['NOME DO EVENTO'] || '',
                        eventPeriod: row['PERÍODO DO EVENTO'] || '',
                        eventTime: row['HORÁRIO DO EVENTO'] || '',
                        nameResponsible: row['NOME DO RESPONSÁVEL'] || '',
                        phoneResponsible: row['TELEFONE DO RESPONSÁVEL'] || '',
                        originCity: row['CIDADE DE ORIGEM'] || '',
                        originLocation: row['LOCAL DE SAÍDA'] || '',
                        originAddress: row['ENDEREÇO COMPLETO DE ORIGEM'] || '',
                        destinationCity: row['CIDADE DE DESTINO'] || '',
                        destinationLocation: row['LOCAL DE DESTINO'] || '',
                        destinationAddress: row['ENDEREÇO COMPLETO DE DESTINO'] || '',
                        departureTime: row['HORÁRIO DE SAÍDA'] || '',
                        returnDate: row['DATA DO RETORNO'] || '',
                        returnTime: row['HORÁRIO DE RETORNO'] || '',
                        vehicleType: row['TIPO DE VEÍCULO'] || '',
                        qtyVehicles: parseCurrency(row['QUANTIDADE DE VEÍCULOS'] || 0),
                        modalidade: row['MODALIDADE DA VIAGEM'] || '',
                        vehicleAvailability: row['DISPONIBILIDADE DE VEÍCULOS'] || '',
                        vehicleStatus: row['STATUS DA CAPACIDADE'] || '',
                        additionalDriverPredicted: row['MOTORISTA ADICIONAL PREVISTO'] || '',
                        additionalDriverRealized: row['MOTORISTA ADICIONAL REALIZADO'] || '',
                        additionalDriverCostPredicted: parseCurrency(row['VALOR TOTAL DO MOTORISTA ADICIONAL PREVISTO'] || 0),
                        additionalDriverCostRealized: parseCurrency(row['VALOR TOTAL DO MOTORISTA ADICIONAL REALIZADO'] || 0),
                        dataEmailSent: row['DATA DO E-MAIL ENVIADO A EMPRESA'] || '',
                        dataReceived: row['DATA RECEBIDO NA GETRA'] || '',
                        prazoEmailToGetra: parseCurrency(row['PRAZO ENTRE ENVIO DO E-MAIL E DO RECEBIMENTO NA GETRA'] || 0),
                        prazoDepartureToGetra: parseCurrency(row['PRAZO ENTRE DATA DE SAÍDA E DO RECEBIMENTO NA GETRA'] || 0),
                        vehicleCapacity: parseCurrency(row['% CAPACIDADE DO VEÍCULO'] || 0),
                        dailyUnitPrice: parseCurrency(row['VALOR UNITÁRIO DAS DIÁRIAS'] || 0),
                        infCompletementary: row['INFORMAÇÕES COMPLEMENTARES'] || '',
                        observacaoGeral: row['OBSERVAÇÃO GERAL'] || '',
                        motivo: row['MOTIVO'] || '',


                        // KM Metrics
                        kmPredicted: parseCurrency(row['KM PREVISTO'] || 0),
                        kmRealized: parseCurrency(row['KM REALIZADO'] || 0),
                        kmCostPredicted: parseCurrency(row['VALOR TOTAL DO KM PREVISTO'] || 0),
                        kmCostRealized: parseCurrency(row['VALOR TOTAL DO KM REALIZADO'] || 0),
                        kmUnitPrice: parseCurrency(row['VALOR UNITÁRIO DO KM'] || 0),

                        // Daily Metrics
                        dailyQtyPredicted: parseCurrency(row['DIÁRIAS PREVISTAS'] || 0),
                        dailyQtyRealized: parseCurrency(row['DIÁRIAS REALIZADAS'] || 0),
                        dailyCostPredicted: parseCurrency(row['VALOR TOTAL DAS DIÁRIAS PREVISTAS'] || 0),
                        dailyCostRealized: parseCurrency(row['VALOR TOTAL DAS DIÁRIAS REALIZADAS'] || 0),
                        paradas: listaDeParadas


                    };
                });
                setData(mappedData as unknown as TripData[]);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError('Erro ao carregar dados.');
                setLoading(false);
            });
    }, []);

    const uniqueSectors = useMemo(() => {
        const sectors = new Set(data.map(d => d.sector).filter(Boolean));
        return Array.from(sectors).sort();
    }, [data]);

    const uniqueMonths = useMemo(() => {
        const months = new Set(data.map(d => format(d.departureDate, 'yyyy-MM')));
        return Array.from(months).sort().reverse();
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchSei = item.seiNumber.toLowerCase().includes(filters.searchSei.toLowerCase());
            const matchSector = !filters.sector || item.sector === filters.sector;
            const matchStatus = !filters.status || item.status === filters.status;
            const matchMonth = !filters.month || format(item.departureDate, 'yyyy-MM') === filters.month;

            return matchSei && matchSector && matchStatus && matchMonth;
        });
    }, [data, filters]);

    return (
        <DataContext.Provider value={{ data, loading, error, filters, setFilters, filteredData, uniqueSectors, uniqueMonths }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
}
