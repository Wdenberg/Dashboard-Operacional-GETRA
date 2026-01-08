🚛 Dashboard de Fretamento
Este é um sistema de gerenciamento e visualização de viagens de fretamento. O dashboard oferece uma interface moderna para monitorar solicitações, custos, destinos e o status de viagens em tempo real.

🚀 Tecnologias Utilizadas
O projeto foi construído com as tecnologias mais modernas do ecossistema React:

React 18 + TypeScript: Desenvolvimento robusto com tipagem estática.

Vite: Ferramenta de build ultra-rápida.

Tailwind CSS: Estilização baseada em utilitários para design responsivo.

Lucide React: Biblioteca de ícones leves e bonitos.

Framer Motion: Animações fluidas de interface.

Recharts: Gráficos interativos para visualização de dados.

Date-fns: Manipulação eficiente de datas e fusos horários.

🛠️ Funcionalidades Principais
Listagem de Viagens: Visualização detalhada de solicitações (Origem, Destino, Datas e Horários).

Indicadores (Cards): Resumo de gastos previstos vs. realizados e contagem de viagens.

Gestão de Paradas: Visualização de múltiplos pontos de parada por rota.

Tratamento de Dados: Formatação inteligente de moedas (BRL) e datas corrigidas para fuso horário local.

Interface Adaptável: Layout pronto para temas claro e escuro (Dark Mode).

📦 Instalação e Uso
Para rodar o projeto localmente, siga os passos abaixo:

Clone o repositório:

```Bash

git clone https://github.com/seu-usuario/dashboard-fretamento.git
Entre na pasta do projeto:

```Bash

cd dashboard-fretamento
Instale as dependências:

```Bash

npm install
Inicie o servidor de desenvolvimento:

```Bash

npm run dev
Acesse no navegador: O Vite geralmente disponibiliza o link em http://localhost:5173.

🏗️ Estrutura de Scripts
npm run dev: Inicia o servidor local de desenvolvimento.

npm run build: Compila o projeto TypeScript e gera os arquivos otimizados na pasta dist/.

npm run lint: Executa o ESLint para verificar erros de padronização no código.

npm run preview: Visualiza localmente o build de produção gerado.

📂 Organização de Pastas (Sugerida)
Plaintext

src/
├── components/     # Componentes reutilizáveis (Cards, Tabelas, etc.)
├── utils/          # Funções de formatação (Data, Moeda, Time)
├── hooks/          # Hooks customizados para lógica de dados
├── assets/         # Imagens e estilos globais
└── App.tsx         # Componente principal do dashboard
📄 Licença
Este projeto é privado e de uso exclusivo para gerenciamento de fretamento interno.