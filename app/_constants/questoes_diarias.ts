export interface QuestaoQuiz {
  id: number;
  categoria: string;
  subtitulo: string;
  pergunta: string;
  opcoes: { id: string; label: string }[];
  respostaCorreta: string;
  explicacao: string;
  xpBonus: number;
}

export const questoesDiarias: QuestaoQuiz[] = [
  // 1. Tecnologia
  {
    id: 1,
    categoria: 'TECNOLOGIA',
    subtitulo: 'Questão Diária de Segurança Cibernética',
    pergunta: 'Qual subárea da tecnologia foca em criptografia, firewalls e controle de acessos para proteger infraestruturas contra ataques virtuais?',
    opcoes: [
      { id: 'a', label: 'Cloud Computing (Nuvem)' },
      { id: 'b', label: 'Cyber Security (Segurança Cibernética)' },
      { id: 'c', label: 'Web Development (Desenvolvimento Web)' },
      { id: 'd', label: 'Database Administration (Banco de Dados)' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A Segurança Cibernética (Cyber Security) utiliza firewalls, criptografia e políticas de acesso para defender sistemas e redes contra invasões e roubo de dados.',
    xpBonus: 15
  },
  {
    id: 2,
    categoria: 'TECNOLOGIA',
    subtitulo: 'Questão Diária de Estrutura de Dados',
    pergunta: 'No desenvolvimento de software, qual estrutura de dados funciona no modelo FIFO (First In, First Out), onde o primeiro elemento a entrar é o primeiro a sair?',
    opcoes: [
      { id: 'a', label: 'Pilha (Stack)' },
      { id: 'b', label: 'Fila (Queue)' },
      { id: 'c', label: 'Árvore Binária (Tree)' },
      { id: 'd', label: 'Vetor (Array)' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Uma Fila (Queue) segue a regra FIFO (First In, First Out), onde o primeiro elemento inserido é obrigatoriamente o primeiro a ser removido.',
    xpBonus: 15
  },
  {
    id: 3,
    categoria: 'TECNOLOGIA',
    subtitulo: 'Questão Diária de Linguagens de Programação',
    pergunta: 'Qual das opções abaixo é uma linguagem de programação fortemente tipada e compilada, comumente usada para desenvolvimento de sistemas críticos e jogos de alta performance?',
    opcoes: [
      { id: 'a', label: 'Python' },
      { id: 'b', label: 'JavaScript' },
      { id: 'c', label: 'C++' },
      { id: 'd', label: 'PHP' }
    ],
    respostaCorreta: 'c',
    explicacao: 'C++ é conhecida por sua altíssima performance, controle de memória de baixo nível e tipagem estática, sendo amplamente usada em engines de jogos e sistemas de alto desempenho.',
    xpBonus: 15
  },
  {
    id: 4,
    categoria: 'TECNOLOGIA',
    subtitulo: 'Questão Diária de Banco de Dados',
    pergunta: 'O que significa a sigla SQL no contexto de gerenciamento de bancos de dados?',
    opcoes: [
      { id: 'a', label: 'Simple Query Language' },
      { id: 'b', label: 'Structured Query Language' },
      { id: 'c', label: 'Sequential Query Line' },
      { id: 'd', label: 'System Query Logic' }
    ],
    respostaCorreta: 'b',
    explicacao: 'SQL significa Structured Query Language (Linguagem de Consulta Estruturada), sendo a linguagem padrão para interagir com bancos de dados relacionais.',
    xpBonus: 15
  },

  // 2. Saúde
  {
    id: 5,
    categoria: 'SAÚDE',
    subtitulo: 'Questão Diária de Fisiologia Humana',
    pergunta: 'Qual órgão do corpo humano é responsável pela produção de insulina, hormônio essencial para a regulação dos níveis de açúcar no sangue?',
    opcoes: [
      { id: 'a', label: 'Fígado' },
      { id: 'b', label: 'Rim' },
      { id: 'c', label: 'Pâncreas' },
      { id: 'd', label: 'Baço' }
    ],
    respostaCorreta: 'c',
    explicacao: 'O pâncreas produz insulina através das células beta das ilhotas pancreáticas para controlar a entrada de glicose nas células do organismo.',
    xpBonus: 15
  },
  {
    id: 6,
    categoria: 'SAÚDE',
    subtitulo: 'Questão Diária de Cardiologia',
    pergunta: 'O que caracteriza a hipertensão arterial, uma das condições cardiovasculares crônicas mais comuns no mundo?',
    opcoes: [
      { id: 'a', label: 'Pressão arterial baixa constante' },
      { id: 'b', label: 'Pressão arterial elevada de forma constante' },
      { id: 'c', label: 'Batimento cardíaco excessivamente lento' },
      { id: 'd', label: 'Baixo nível de oxigênio nas artérias' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A hipertensão é caracterizada pela elevação crônica e sustentada dos níveis pressóricos nas artérias, forçando o coração a realizar um esforço maior.',
    xpBonus: 15
  },
  {
    id: 7,
    categoria: 'SAÚDE',
    subtitulo: 'Questão Diária de Hematologia',
    pergunta: 'Qual a função principal dos glóbulos vermelhos (hemácias) no sistema circulatório humano?',
    opcoes: [
      { id: 'a', label: 'Produzir anticorpos de defesa' },
      { id: 'b', label: 'Combater infecções ativas' },
      { id: 'c', label: 'Transportar oxigênio dos pulmões para os tecidos' },
      { id: 'd', label: 'Coagular o sangue em caso de ferimentos' }
    ],
    respostaCorreta: 'c',
    explicacao: 'As hemácias contêm hemoglobina, uma proteína rica em ferro que se liga ao oxigênio nos pulmões e o transporta para todas as células do corpo.',
    xpBonus: 15
  },
  {
    id: 8,
    categoria: 'SAÚDE',
    subtitulo: 'Questão Diária de Bioquímica e Vitaminas',
    pergunta: 'Qual vitamina é sintetizada pela própria pele quando exposta adequadamente à radiação ultravioleta do sol?',
    opcoes: [
      { id: 'a', label: 'Vitamina A' },
      { id: 'b', label: 'Vitamina C' },
      { id: 'c', label: 'Vitamina D' },
      { id: 'd', label: 'Vitamina K' }
    ],
    respostaCorreta: 'c',
    explicacao: 'A exposição solar ativa a conversão do deidrocolesterol em vitamina D ativa na pele, nutriente essencial para a absorção de cálcio e saúde dos ossos.',
    xpBonus: 15
  },

  // 3. Negócios
  {
    id: 9,
    categoria: 'NEGÓCIOS',
    subtitulo: 'Questão Diária de Finanças Corporativas',
    pergunta: 'Na contabilidade corporativa, qual o termo usado para descrever a diferença positiva final entre as receitas totais de vendas e todas as despesas e impostos?',
    opcoes: [
      { id: 'a', label: 'Passivo Circulante' },
      { id: 'b', label: 'Lucro Líquido' },
      { id: 'c', label: 'Capital Social' },
      { id: 'd', label: 'Ativo Imobilizado' }
    ],
    respostaCorreta: 'b',
    explicacao: 'O lucro líquido é o resultado positivo obtido após deduzir todos os custos de produção, despesas operacionais, juros e impostos das receitas brutas.',
    xpBonus: 15
  },
  {
    id: 10,
    categoria: 'NEGÓCIOS',
    subtitulo: 'Questão Diária de Planejamento Estratégico',
    pergunta: 'O que avalia a ferramenta Matriz SWOT (ou FOFA) no planejamento estratégico de uma empresa?',
    opcoes: [
      { id: 'a', label: 'Apenas o fluxo de caixa mensal da empresa' },
      { id: 'b', label: 'Forças, Oportunidades, Fraquezas e Ameaças' },
      { id: 'c', label: 'O nível de satisfação dos funcionários internos' },
      { id: 'd', label: 'O volume total de vendas divididas por região' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A matriz SWOT analisa o ambiente interno (Forças e Fraquezas da empresa) e o ambiente externo (Oportunidades e Ameaças de mercado).',
    xpBonus: 15
  },
  {
    id: 11,
    categoria: 'NEGÓCIOS',
    subtitulo: 'Questão Diária de Marketing',
    pergunta: 'No marketing moderno, o que define o conceito de "Persona"?',
    opcoes: [
      { id: 'a', label: 'O organograma hierárquico dos gerentes' },
      { id: 'b', label: 'A representação semi-fictícia do cliente ideal' },
      { id: 'c', label: 'O logotipo ou design da embalagem' },
      { id: 'd', label: 'A margem de lucro sugerida ao consumidor' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A Persona é um perfil detalhado que personifica o comprador ideal de um produto, baseado em dados demográficos e comportamentais reais.',
    xpBonus: 15
  },
  {
    id: 12,
    categoria: 'NEGÓCIOS',
    subtitulo: 'Questão Diária de Mercado Financeiro',
    pergunta: 'O que é a "Liquidez" no contexto financeiro e de investimentos?',
    opcoes: [
      { id: 'a', label: 'A oscilação de uma ação no mercado secundário' },
      { id: 'b', label: 'A velocidade de converter um ativo em dinheiro em mãos sem perda de valor' },
      { id: 'c', label: 'O lucro total arrecadado no fechamento contábil' },
      { id: 'd', label: 'A taxa de endividamento de longo prazo' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Liquidez é a facilidade e rapidez com que um investimento pode ser resgatado ou vendido, voltando a ser dinheiro em caixa.',
    xpBonus: 15
  },

  // 4. Artes
  {
    id: 13,
    categoria: 'ARTES',
    subtitulo: 'Questão Diária de Design Gráfico',
    pergunta: 'No design gráfico e na edição de imagens digitais, qual modelo de cor é utilizado para projetos que serão exibidos exclusivamente em telas digitais?',
    opcoes: [
      { id: 'a', label: 'CMYK' },
      { id: 'b', label: 'RGB (Red, Green, Blue)' },
      { id: 'c', label: 'Pantone sólido' },
      { id: 'd', label: 'Escala de Cinza física' }
    ],
    respostaCorreta: 'b',
    explicacao: 'O modelo RGB é baseado na soma de feixes de luz vermelha, verde e azul emitida por monitores digitais. Impressões físicas usam CMYK.',
    xpBonus: 15
  },
  {
    id: 14,
    categoria: 'ARTES',
    subtitulo: 'Questão Diária de Arquitetura Brasileira',
    pergunta: 'Qual arquiteto brasileiro assinou a maioria dos grandes edifícios públicos de Brasília, sendo conhecido mundialmente pelo uso de curvas no concreto armado?',
    opcoes: [
      { id: 'a', label: 'Lina Bo Bardi' },
      { id: 'b', label: 'Oscar Niemeyer' },
      { id: 'c', label: 'Paulo Mendes da Rocha' },
      { id: 'd', label: 'Roberto Burle Marx' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Oscar Niemeyer desenhou monumentos icônicos de Brasília como o Congresso Nacional, a Catedral e o Palácio do Planalto com traços sinuosos.',
    xpBonus: 15
  },
  {
    id: 15,
    categoria: 'ARTES',
    subtitulo: 'Questão Diária de Técnicas Artísticas',
    pergunta: 'O que representa a técnica de perspectiva geométrica em um desenho ou pintura artística?',
    opcoes: [
      { id: 'a', label: 'O contraste extremo entre luz e sombra' },
      { id: 'b', label: 'A ilusão de profundidade tridimensional em uma superfície plana' },
      { id: 'c', label: 'A mistura de tintas complementares na paleta' },
      { id: 'd', label: 'A espessura e textura das cerdas do pincel' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A perspectiva é um sistema matemático e óptico que recria a ilusão de espaço tridimensional (profundidade) em uma tela ou papel bidimensional.',
    xpBonus: 15
  },
  {
    id: 16,
    categoria: 'ARTES',
    subtitulo: 'Questão Diária de História da Arte',
    pergunta: 'Qual movimento artístico de vanguarda do início do século XX propôs fracionar as formas da natureza e representá-las através de volumes geométricos?',
    opcoes: [
      { id: 'a', label: 'Impressionismo' },
      { id: 'b', label: 'Cubismo' },
      { id: 'c', label: 'Surrealismo' },
      { id: 'd', label: 'Romantismo' }
    ],
    respostaCorreta: 'b',
    explicacao: 'O Cubismo (tendo Pablo Picasso como grande expoente) rompeu com a perspectiva tradicional ao retratar objetos geométricos sob múltiplos ângulos ao mesmo tempo.',
    xpBonus: 15
  },

  // 5. Direito
  {
    id: 17,
    categoria: 'DIREITO',
    subtitulo: 'Questão Diária de Direito Constitucional',
    pergunta: 'Qual a lei máxima e fundamental de um Estado democrático como o Brasil, que organiza a estrutura dos poderes e assegura os direitos individuais?',
    opcoes: [
      { id: 'a', label: 'Código Civil' },
      { id: 'b', label: 'Constituição Federal de 1988' },
      { id: 'c', label: 'Código de Defesa do Consumidor' },
      { id: 'd', label: 'Consolidação das Leis do Trabalho (CLT)' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A Constituição Federal de 1988 é a Carta Magna do Brasil, a norma jurídica de maior hierarquia na qual todas as outras leis devem se basear.',
    xpBonus: 15
  },
  {
    id: 18,
    categoria: 'DIREITO',
    subtitulo: 'Questão Diária de Direitos Fundamentais',
    pergunta: 'O que garante o princípio jurídico constitucional da "Presunção de Inocência"?',
    opcoes: [
      { id: 'a', label: 'O acusado deve provar ativamente que não é culpado' },
      { id: 'b', label: 'Ninguém é considerado culpado até que a sentença condenatória seja definitiva' },
      { id: 'c', label: 'A polícia pode julgar o suspeito diretamente no ato' },
      { id: 'd', label: 'Todo cidadão está isento de sofrer processos penais' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Previsto no artigo 5º da CF, a presunção de inocência estabelece que o réu é considerado inocente até o trânsito em julgado (quando não cabem mais recursos).',
    xpBonus: 15
  },
  {
    id: 19,
    categoria: 'DIREITO',
    subtitulo: 'Questão Diária de Ramos do Direito',
    pergunta: 'Qual ramo do direito regula as relações quotidianas entre particulares, tratando de temas como casamento, contratos, herança e posse?',
    opcoes: [
      { id: 'a', label: 'Direito Penal' },
      { id: 'b', label: 'Direito Civil' },
      { id: 'c', label: 'Direito Administrativo' },
      { id: 'd', label: 'Direito do Trabalho' }
    ],
    respostaCorreta: 'b',
    explicacao: 'O Direito Civil regula as relações jurídicas privadas cotidianas das pessoas físicas e jurídicas, como propriedade, contratos e relações familiares.',
    xpBonus: 15
  },
  {
    id: 20,
    categoria: 'DIREITO',
    subtitulo: 'Questão Diária de Filosofia e Humanas',
    pergunta: 'Qual filósofo grego clássico revolucionou o pensamento ocidental ao ensinar que o conhecimento é alcançado por meio do questionamento sistemático (ironia e maiêutica)?',
    opcoes: [
      { id: 'a', label: 'Platão' },
      { id: 'b', label: 'Sócrates' },
      { id: 'c', label: 'Aristóteles' },
      { id: 'd', label: 'Epicuro' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Sócrates não deixou escritos, mas seu método de questionamento (maiêutica) influenciou toda a filosofia ao levar seus interlocutores a descobrir a verdade por si mesmos.',
    xpBonus: 15
  },

  // 6. Agronomia
  {
    id: 21,
    categoria: 'AGRONOMIA',
    subtitulo: 'Questão Diária de Fitotecnia e Solos',
    pergunta: 'Qual macronutriente mineral as plantas necessitam em maior quantidade para impulsionar o desenvolvimento das folhas e o crescimento vegetativo?',
    opcoes: [
      { id: 'a', label: 'Fósforo (P)' },
      { id: 'b', label: 'Nitrogênio (N)' },
      { id: 'c', label: 'Potássio (K)' },
      { id: 'd', label: 'Magnésio (Mg)' }
    ],
    respostaCorreta: 'b',
    explicacao: 'O nitrogênio é o nutriente responsável pelo desenvolvimento vegetativo (folhas e caules) e é componente chave da clorofila, que dá cor verde e faz a fotossíntese.',
    xpBonus: 15
  },
  {
    id: 22,
    categoria: 'AGRONOMIA',
    subtitulo: 'Questão Diária de Sustentabilidade Agrícola',
    pergunta: 'Como se chama a técnica agrícola de alternar diferentes espécies vegetais na mesma área de cultivo para preservar os nutrientes e quebrar o ciclo de pragas?',
    opcoes: [
      { id: 'a', label: 'Monocultura sequencial' },
      { id: 'b', label: 'Rotação de Culturas' },
      { id: 'c', label: 'Hidroponia estanque' },
      { id: 'd', label: 'Calagem de subsuperfície' }
    ],
    respostaCorreta: 'b',
    explicacao: 'A rotação de culturas melhora a fertilidade química e física do solo e evita a proliferação de doenças específicas que ocorreriam no cultivo contínuo de uma única cultura.',
    xpBonus: 15
  },
  {
    id: 23,
    categoria: 'AGRONOMIA',
    subtitulo: 'Questão Diária de Ecologia Geral',
    pergunta: 'Qual inseto é considerado o principal polinizador global, sendo vital para a reprodução de mais de 70% das espécies de plantas que alimentam o planeta?',
    opcoes: [
      { id: 'a', label: 'Formiga cortadeira' },
      { id: 'b', label: 'Abelha' },
      { id: 'c', label: 'Gafanhoto' },
      { id: 'd', label: 'Besouro serrador' }
    ],
    respostaCorreta: 'b',
    explicacao: 'As abelhas transportam o pólen entre as flores de forma extremamente eficiente, sendo essenciais para a produção da maioria dos frutos, grãos e hortaliças consumidos.',
    xpBonus: 15
  },
  {
    id: 24,
    categoria: 'AGRONOMIA',
    subtitulo: 'Questão Diária de Fisiologia Vegetal',
    pergunta: 'O que define o processo biológico de fotossíntese realizado pelos organismos vegetais?',
    opcoes: [
      { id: 'a', label: 'A absorção passiva de água subterrânea pelas raízes no período da noite' },
      { id: 'b', label: 'A conversão de energia luminosa solar em energia química (carboidratos)' },
      { id: 'c', label: 'A respiração e liberação de gás carbônico pelos estômatos à luz solar' },
      { id: 'd', label: 'A transpiração de água em forma de vapor para regular a temperatura' }
    ],
    respostaCorreta: 'b',
    explicacao: 'Na fotossíntese, a planta utiliza a luz solar captada pela clorofila para transformar gás carbônico e água em glicose (seu alimento) e oxigênio (liberado na atmosfera).',
    xpBonus: 15
  }
];
