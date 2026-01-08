import { format, parseISO } from 'date-fns';



export const formatDate = (date: any) => {
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

export const formatTime = (date: any) => {
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
