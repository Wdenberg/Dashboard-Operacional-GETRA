export interface ApiRow {
    'ORDEM': string;
    'CÓDIGO DA SOLICITAÇÃO': string;
    'EMPRESA': string;
    'NÚMERO DO SEI': string;
    'NOME DO SOLICITANTE': string;
    'TELEFONE DO SOLICITANTE': string;
    'E-MAIL DO SOLICITANTE': string;
    'EXECUTIVA': string;
    'SETOR DO SOLICITANTE': string;
    'CASO O SETOR DO SOLICITANTE FOR OUTROS, INFORME AQUI': string;
    'PROGRAMA': string;
    'NOME DO EVENTO': string;
    'PERÍODO DO EVENTO': string;
    'HORÁRIO DO EVENTO': string;
    'DATA DE SAÍDA': string;
    'DATA DO RETORNO': string;
    'HORÁRIO DE SAÍDA': string;
    'HORÁRIO DE RETORNO': string;
    'CIDADE DE ORIGEM': string;
    'LOCAL DE SAÍDA': string;
    'ENDEREÇO COMPLETO DE ORIGEM': string;
    'PARADA 1'?: string;
    'PARADA 2'?: string;
    'PARADA 3'?: string;
    'PARADA 4'?: string;
    'PARADA 5'?: string;
    'PARADA 6'?: string;
    'CIDADE DE DESTINO': string;
    'LOCAL DE DESTINO': string;
    'ENDEREÇO COMPLETO DE DESTINO': string;
    'TOTAL DE PASSAGEIROS': number | string;
    'MODALIDADE DA VIAGEM': string;
    'DISPONIBILIDADE DE VEÍCULOS': string;
    'NOME DO RESPONSÁVEL': string;
    'TELEFONE DO RESPONSÁVEL': string;
    'INFORMAÇÕES COMPLEMENTARES': string;
    'STATUS FINAL': string;
    'TIPO DE VEÍCULO': string;
    'QUANTIDADE DE VEÍCULOS': number | string;
    'STATUS DA CAPACIDADE': string;
    '% CAPACIDADE DO VEÍCULO': string;
    'KM PREVISTO': number | string;
    'KM REALIZADO': number | string;
    'VALOR UNITÁRIO DO KM': number | string;
    'VALOR TOTAL DO KM PREVISTO': number | string;
    'VALOR TOTAL DO KM REALIZADO': number | string;
    'VALOR UNITÁRIO DAS DIÁRIAS': number | string;
    'DIÁRIAS PREVISTAS': number | string;
    'DIÁRIAS REALIZADAS': number | string;
    'VALOR TOTAL DAS DIÁRIAS PREVISTAS': number | string;
    'VALOR TOTAL DAS DIÁRIAS REALIZADAS': number | string;
    'MOTORISTA ADICIONAL PREVISTO': string;
    'MOTORISTA ADICIONAL REALIZADO': string;
    'VALOR UNITÁRIO DO MOTORISTA ADICIONAL': number | string;
    'VALOR TOTAL DO MOTORISTA ADICIONAL PREVISTO': number | string;
    'VALOR TOTAL DO MOTORISTA ADICIONAL REALIZADO': number | string;
    'TOTAL GERAL PREVISTO': number | string;
    'TOTAL GERAL REALIZADO': number | string;
    'ALTERAÇÃO/CANCELAMENTO': string;
    'MOTIVO': string;
    'OBSERVAÇÃO GERAL': string;
    'DATA DO E-MAIL ENVIADO A EMPRESA': string;
    'DATA RECEBIDO NA GETRA': string;
    'PRAZO ENTRE ENVIO DO E-MAIL E DO RECEBIMENTO NA GETRA': string;
    'PRAZO ENTRE DATA DE SAÍDA E DO RECEBIMENTO NA GETRA': string;
    [key: string]: any;
}

export interface TripData {
    orderNumber: string;
    seiNumber: string;
    departureDate: Date;
    status: string;
    requestId: string;
    destination: string;
    predictedTotal: number;
    realizedTotal: number;
    sector: string;
    qtyPassengers: number;
    nameSolicitant: string;
    phoneSolicitant: string;
    emailSolicitant: string;
    executive: string;

    // KM Metrics
    kmPredicted: number;
    kmRealized: number;
    kmCostPredicted: number;
    kmCostRealized: number;
    kmUnitPrice: number;


    // Daily Metrics
    dailyQtyPredicted: number;
    dailyQtyRealized: number;
    dailyCostPredicted: number;
    dailyCostRealized: number;
    paradas: string[];

    // Additional properties accessed in TripDetailsModal
    company: string;
    program: string;
    eventName: string;
    eventPeriod: string;
    eventTime: string;
    nameResponsible: string;
    phoneResponsible: string;
    originCity: string;
    originLocation: string;
    originAddress: string;
    destinationCity: string;
    destinationLocation: string;
    destinationAddress: string;
    departureTime: string;
    returnDate: string | Date;
    returnTime: string;
    vehicleType: string;
    qtyVehicles: number | string;
    modalidade: string;

    vehicleDisponibility: string;
    vehicleStatus: string;
    additionalDriverPredicted: string;
    additionalDriverRealized: string;
    additionalDriverCostPredicted: number;
    additionalDriverCostRealized: number;
    dataEmailSent: Date;
    dataReceived: Date;
    prazoEmailToGetra: number;
    prazoDepartureToGetra: number;
    vehicleCapacity: number;
    dailyUnitPrice: number;
    infCompletementary: string;
    observacaoGeral: string;
    motivo: string;




}

export interface FilterState {
    searchSei: string;
    sector: string;
    month: string;
    status: string;
}

