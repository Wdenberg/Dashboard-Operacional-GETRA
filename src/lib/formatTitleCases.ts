// Função para transformar em "Título Case"
export function formatTitleCase(text: string | number | undefined): string {
    if (!text) return "";

    const str = String(text).toLowerCase();

    // Lista de palavras que devem permanecer em minúsculas (opcional)
    const exceptions = ["de", "do", "da", "dos", "das", "e", "em", "no", "na", 'a', 'o', 'e', 'ou', 'outra', 'outras', 'outro', 'outros', 'outra', 'outras', 'outro', 'outros', 'as', 'às', 'á', 'à'];

    return str
        .split(" ")
        .map((word, index) => {
            if (word.length === 0) return word;

            // Sempre capitaliza a primeira palavra ou palavras que não são exceções
            if (index === 0 || !exceptions.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        })
        .join(" ");
}