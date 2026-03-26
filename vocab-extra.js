// ─── VOCAB EXTRA · Nhe'ẽ App ─────────────────────────────────────────────────
// Módulos novos e ampliados
// Fontes: Harrison & Harrison (1984), Duarte (2007), Wagley & Galvão (1949),
//         SIL Tenetehára materials, Correa da Silva (1997)

const VOCAB_EXTRA = {

  // ── ESCOLA E APRENDIZADO ──────────────────────────────────────────────────
  escola: {
    name: "🏫 Escola e Aprendizado", level: "basic",
    words: [
      { g: "Moñe'ẽnga",      ph: "mo-nhê-ẽn-GA",      pt: "Escola / lugar de falar e aprender", note: "Lit. 'lugar da fala'; termo moderno para escola nas aldeias" },
      { g: "Ñe'ẽmbo'e",      ph: "nhê-ẽm-bo-Ê",        pt: "Estudar / aprender (verbo)", ex: "Xe ñe'ẽmbo'e Guajajara = Eu estudo/aprendo Guajajara" },
      { g: "Mbo'ehára",      ph: "mbo-ê-HÁ-ra",         pt: "Professor / professora", note: "Lit. 'o que ensina'; muito usado nas escolas indígenas" },
      { g: "Mbo'ekwer",      ph: "mbo-ê-KWER",          pt: "Aluno / estudante (quem aprendeu/aprende)" },
      { g: "Memihar",        ph: "me-mi-HAR",            pt: "Aprendiz / criança em formação", note: "Palavra carinhosa — também usada pelo mascote Arawy" },
      { g: "Kuaxia",         ph: "ku-a-SHÍ-a",           pt: "Papel / folha / livro", note: "Do português 'caixinha'; adaptado como empréstimo" },
      { g: "Kuaxia r-ekó",   ph: "ku-a-shí-a-re-KÓ",    pt: "Livro (lit. 'onde está o papel')" },
      { g: "Kirĩ",           ph: "ki-RĨ",                pt: "Lápis / caneta / instrumento de escrever", note: "Palavra usada nas escolas indígenas do MA" },
      { g: "Moñe'ẽng porã",  ph: "mo-nhê-ẽng-po-RÃ",    pt: "Ler / ler bem (lit. falar bonito o texto)" },
      { g: "Kuaxia nupã",    ph: "ku-a-shí-a-nu-PÃ",    pt: "Escrever (lit. bater/marcar o papel)" },
      { g: "Porandu",        ph: "po-ran-DÚ",             pt: "Perguntar / fazer pergunta", ex: "Nde porandu mbo'ehára = Você pergunta ao professor" },
      { g: "Ayvu",           ph: "ai-VÚ",                 pt: "Responder / resposta / a fala", ex: "Xe ayvu = Minha resposta / Eu respondo" },
      { g: "Haywu",          ph: "hai-WÚ",                pt: "Entender / compreender", ex: "Xe haywu = Eu entendo" },
      { g: "Ani xe haywu",   ph: "a-ni-shê-hai-WÚ",      pt: "Não entendi / Não compreendi" },
      { g: "Nhe'ẽ",          ph: "nhê-Ê",                 pt: "Língua / palavra / idioma", note: "Nome do próprio app! Central em toda a aprendizagem" },
      { g: "Nhe'ẽ porahẽi",  ph: "nhê-ê-po-ra-HẼI",      pt: "Canção / Língua bonita", note: "Lit. 'fala cantada bonita'" },
      { g: "Mokã momokyr",   ph: "mo-kã-mo-mo-KÎR",       pt: "Contar / calcular (lit. limpar a roça = organizar)" },
      { g: "Hex kuaxia",     ph: "hêsh-ku-a-SHÍ-a",       pt: "Ler (lit. ver o papel/texto)" },
      { g: "Mbo'e",          ph: "mbo-Ê",                  pt: "Ensinar / lição", ex: "Xe mbo'e nde = Eu te ensino" },
      { g: "Angatu mbo'e",   ph: "an-ga-tu-mbo-Ê",         pt: "Boa aula / Boa lição" },
    ]
  },

  // ── CLIMA E ESTAÇÕES ──────────────────────────────────────────────────────
  clima: {
    name: "🌦️ Clima e Estações", level: "basic",
    words: [
      { g: "Ko'yr asy",       ph: "ko-ÎR-a-SÎ",          pt: "Sol forte / calor intenso (lit. sol que queima)", note: "Amazônia tem sol muito intenso — palavra muito usada" },
      { g: "Ko'yr hekó",      ph: "ko-ÎR-he-KÓ",          pt: "Dia de sol claro / calor agradável" },
      { g: "Amana",           ph: "a-ma-NA",               pt: "Chuva", ex: "Amana ú = Está chovendo (lit. a chuva veio)" },
      { g: "Amana mawy",      ph: "a-ma-na-ma-WÎ",         pt: "Chuva forte / temporal" },
      { g: "Amana iky",       ph: "a-ma-na-i-KÎ",          pt: "Garoa / chuvisqueiro (lit. chuva pequena)" },
      { g: "Ywytu",           ph: "î-wî-TU",               pt: "Vento forte / tempestade", ex: "Ywytu mawy = Tempestade forte" },
      { g: "Hu'y",            ph: "hu-Î",                   pt: "Brisa / vento suave" },
      { g: "Tatarahy",        ph: "ta-ta-ra-HÎ",           pt: "Raio / relâmpago (lit. fogo que corre)" },
      { g: "Nhambu",          ph: "nham-BÚ",               pt: "Trovão (som do raio)", note: "Onomatopeico — imita o som do trovão" },
      { g: "Wyrajuká",        ph: "wî-ra-ju-KÁ",           pt: "Arco-íris (lit. caminho do pássaro colorido)", note: "Bela metáfora Tenetehára para o arco-íris" },
      { g: "Rorý",            ph: "ro-RÎ",                  pt: "Frio / fresco", ex: "Ko'i rorý = Hoje está frio/fresco" },
      { g: "Rorý mawy",       ph: "ro-rî-ma-WÎ",           pt: "Frio intenso / friagem amazônica" },
      { g: "Amana ára",       ph: "a-ma-na-á-RA",          pt: "Inverno / época das chuvas (nov–mar na Amazônia)" },
      { g: "Ko'yr ará",       ph: "ko-ÎR-á-ra",            pt: "Verão / época seca (jul–set na Amazônia)" },
      { g: "Amana moko'yr",   ph: "a-ma-na-mo-ko-ÎR",      pt: "Primeiro dia de chuva da estação" },
      { g: "Pituna",          ph: "pi-tu-NA",               pt: "Amanhecer com névoa / neblina da madrugada" },
      { g: "Ará morotĩ",      ph: "á-ra-mo-ro-TĨ",         pt: "Céu limpo / dia claro (lit. dia branco)" },
      { g: "Ará hũ",          ph: "á-ra-HŨ",               pt: "Céu nublado / dia escuro (lit. dia preto)" },
    ]
  },

  // ── TRABALHO E ROÇA ───────────────────────────────────────────────────────
  trabalho: {
    name: "🤝 Trabalho e Roça", level: "basic",
    words: [
      { g: "Mokã",            ph: "mo-KÃ",               pt: "Roça / plantação / lavoura", note: "Centro da vida Tenetehára: a roça é identidade, não só sustento" },
      { g: "Mbo'yky",         ph: "mbo-Î-kî",            pt: "Plantar (semear)", ex: "Xe mbo'yky manihĩ = Eu planto mandioca" },
      { g: "Kyty",            ph: "kÎ-TÎ",               pt: "Colher / cortar (roça, frutos)", ex: "Amõ ára xe kyty = Amanhã eu colho" },
      { g: "Zapy",            ph: "za-PÎ",               pt: "Pescar / pesca (verbo)", ex: "Xe ru zapy = Meu pai pesca" },
      { g: "Muka",            ph: "mu-KA",               pt: "Caçar / caça (verbo)", ex: "A'e muka kaá pe = Ele caça no mato" },
      { g: "Apohábo",         ph: "a-po-HÁ-bo",          pt: "Trabalhar / trabalho (em andamento)" },
      { g: "Apo",             ph: "a-PO",                pt: "Fazer / trabalho concluído", ex: "Xe apo angatu = Eu fiz bem (o trabalho)" },
      { g: "Mokã aty",        ph: "mo-kã-a-TÎ",          pt: "Mutirão / trabalho coletivo", note: "Prática comunitária central: todos ajudam na roça de cada um" },
      { g: "Ywyrá kyty",      ph: "î-wî-rá-kÎ-TÎ",      pt: "Cortar lenha / derrubar árvore" },
      { g: "Tataú mokã",      ph: "ta-ta-Ú-mo-KÃ",       pt: "Queima da roça / coivara", note: "Técnica agrícola tradicional de coivara" },
      { g: "Kyse",            ph: "kÎ-SE",               pt: "Faca / terçado / facão" },
      { g: "Paranã",          ph: "pa-ra-NÃ",             pt: "Enxada / instrumento de cavar (empréstimo moderno)" },
      { g: "Takwara",         ph: "ta-kwa-RA",            pt: "Bambu / taquara (material de construção)" },
      { g: "Oka apo",         ph: "o-ka-a-PO",            pt: "Construir casa (lit. fazer casa)", ex: "Oka apo ramo xe oho = Fui construir minha casa" },
      { g: "Ywyá kyty",       ph: "î-wî-á-kÎ-TÎ",        pt: "Colher frutos (lit. cortar fruta da árvore)" },
      { g: "Pira zapy",       ph: "pi-ra-za-PÎ",          pt: "Pescar peixe / ir pescar" },
      { g: "Ñe'ẽng aty",      ph: "nhê-ẽng-a-TÎ",         pt: "Reunião / assembleia comunitária" },
      { g: "Pytywõ",          ph: "pî-tî-WÕ",             pt: "Ajudar / colaborar", ex: "Xe pytywõ xe ramuhã = Eu ajudo meu avô" },
      { g: "Kaá 'ak",         ph: "ka-á-AK",              pt: "Roçar o mato / abrir clareira" },
      { g: "Kwyr",            ph: "KWÎR",                 pt: "Gordura / óleo (de cozinhar ou uso)" },
    ]
  },

  // ── EMOÇÕES E SENTIMENTOS ─────────────────────────────────────────────────
  emocoes: {
    name: "🎭 Emoções e Sentimentos", level: "inter",
    words: [
      { g: "Rorysáwy",        ph: "ro-rî-SÁ-wî",         pt: "Alegria / felicidade", ex: "Xe rorysáwy mawy = Estou muito feliz", note: "Lit. 'o que é fresco/bom no coração'" },
      { g: "Tuwér rorysáwy",  ph: "tu-wêr-ro-rî-SÁ-wî",  pt: "Alegria do coração / felicidade profunda" },
      { g: "Tuwér ywý",       ph: "tu-wêr-î-WÎ",          pt: "Tristeza (lit. coração dói)", ex: "Xe tuwér ywý = Estou triste" },
      { g: "Poxy",            ph: "po-SHÎ",               pt: "Raiva / estar bravo", ex: "Xe poxy = Estou com raiva", note: "Palavra muito direta e comum" },
      { g: "Poxy mawy",       ph: "po-shî-ma-WÎ",          pt: "Muito bravo / raiva intensa" },
      { g: "Kyje",            ph: "kî-JÊ",                pt: "Medo / ter medo", ex: "Xe kyje = Eu tenho medo" },
      { g: "Kyje mawy",       ph: "kî-jê-ma-WÎ",          pt: "Muito medo / terror" },
      { g: "Hayhu",           ph: "hai-HÚ",               pt: "Amor / gostar / amar", ex: "Xe hayhu nde = Eu te amo", note: "Palavra central — também usada para gostar de algo" },
      { g: "Xe hayhu nde mawy", ph: "shê-hai-hú-ndê-ma-WÎ", pt: "Eu te amo muito" },
      { g: "Saudade",         ph: "sau-DA-de",             pt: "Saudade (empréstimo do PT — conceito sem equivalente exato em Guajajara)", note: "Os Tenetehára usam 'tuwér kwer' (coração que ficou para trás) para a ideia de saudade" },
      { g: "Tuwér kwer",      ph: "tu-wêr-KWER",          pt: "Saudade (lit. coração que ficou) / nostalgia" },
      { g: "Angatu rorysa",   ph: "an-ga-tu-ro-rî-SA",    pt: "Orgulho / sentir-se bem consigo (lit. bem-alegre)" },
      { g: "Xe porãhý",       ph: "shê-po-rã-HÎ",         pt: "Estou bem / me sinto bem / estou satisfeito" },
      { g: "Xe kwér",         ph: "shê-KWER",              pt: "Estou cansado / exausto (lit. já fiz/terminei)" },
      { g: "Xe jepý",         ph: "shê-je-PÎ",             pt: "Estou com vergonha / envergonhado" },
      { g: "Xe rory",         ph: "shê-ro-RÎ",             pt: "Estou animado / contente / com prazer" },
      { g: "Mara'i xe rory",  ph: "ma-ra-í-shê-ro-RÎ",    pt: "Não estou bem / estou mal-humorado" },
      { g: "Tuwér porã",      ph: "tu-wêr-po-RÃ",          pt: "Bom coração / pessoa bondosa / generosa" },
    ]
  },

  // ── PLANTAS MEDICINAIS ────────────────────────────────────────────────────
  plantas: {
    name: "🌿 Plantas Medicinais", level: "inter",
    words: [
      { g: "Ka'á mara'í",     ph: "ka-á-ma-ra-Í",         pt: "Planta medicinal (lit. mato remédio)", note: "Os Tenetehára possuem um dos mais ricos saberes etnobotânicos da Amazônia" },
      { g: "Pahy",            ph: "pa-HÎ",                pt: "Pajé / curador / xamã", note: "O pajé conhece as plantas, os espíritos e as curas — figura central" },
      { g: "Maraí",           ph: "ma-ra-Í",               pt: "Rezar / benzimento / cura espiritual", ex: "Pahy maraí = O pajé reza/benze" },
      { g: "Ka'á myrõ",       ph: "ka-á-mî-RÕ",            pt: "Banho de ervas (lit. banho de mato)", note: "Prática cotidiana: banho com plantas para proteção e cura" },
      { g: "Xipó",            ph: "shí-PÓ",               pt: "Cipó (raiz/trepadeira medicinal e construtiva)" },
      { g: "Xipó pytãng",     ph: "shí-pó-pî-TÃNG",       pt: "Cipó vermelho / sangue-de-dragão medicinal" },
      { g: "Kaá angatu",      ph: "ka-á-an-ga-TU",         pt: "Erva boa / planta benéfica" },
      { g: "Ywyrá angatu",    ph: "î-wî-rá-an-ga-TU",      pt: "Árvore boa / árvore de uso medicinal" },
      { g: "Tatarahy ka'á",   ph: "ta-ta-ra-hî-ka-Á",      pt: "Planta da febre (lit. mato do fogo/raio)", note: "Planta usada para baixar febre" },
      { g: "Rywy mara'í",     ph: "rî-wî-ma-ra-Í",         pt: "Remédio para dor de barriga" },
      { g: "Akã mara'í",      ph: "a-kã-ma-ra-Í",          pt: "Remédio para dor de cabeça" },
      { g: "Ka'á nhẽẽng",     ph: "ka-á-nhẽ-ẼNG",          pt: "Planta de proteção espiritual (lit. mato da fala/alma)" },
      { g: "Karuwar mara'í",  ph: "ka-ru-war-ma-ra-Í",     pt: "Planta dos espíritos / proteção xamânica", note: "Usada em rituais do pajé" },
      { g: "Wy'y mara'í",     ph: "wÎ-Î-ma-ra-Í",          pt: "Chá medicinal (lit. água remédio)" },
      { g: "Ka'á pukú",       ph: "ka-á-pu-KÚ",            pt: "Folha longa / erva de folha comprida" },
      { g: "Ka'á ky",         ph: "ka-á-KÎ",               pt: "Raiz medicinal (lit. pé/raiz do mato)" },
      { g: "Mbo'yky mara'í",  ph: "mbo-Î-kî-ma-ra-Í",      pt: "Cultivar plantas medicinais (na roça do pajé)" },
      { g: "Pahy ñe'ẽng",     ph: "pa-hî-nhê-ÊNG",         pt: "Reza do pajé / palavra sagrada de cura" },
    ]
  },

  // ── CANTOS E MÚSICAS ──────────────────────────────────────────────────────
  cantos: {
    name: "🎶 Cantos e Músicas", level: "inter",
    words: [
      { g: "Porahẽi",         ph: "po-ra-HẼI",            pt: "Canto / canção / música (genérico)", note: "Porahẽi é a palavra central para toda expressão musical Tenetehára" },
      { g: "Toré",            ph: "to-RÊ",                pt: "Toré — dança e canto ritual sagrado", note: "O Toré é a manifestação cultural mais importante dos Tenetehára. É dança, música e espiritualidade ao mesmo tempo" },
      { g: "Maracá",          ph: "ma-ra-KÁ",              pt: "Maracá — chocalho cerimonial", note: "Feito de cabaça com sementes, é o instrumento central do Toré" },
      { g: "Mbaraka",         ph: "mba-ra-KA",             pt: "Violão indígena / instrumento de corda", note: "Instrumento de cordas usado em cerimônias" },
      { g: "Takwara porahẽi", ph: "ta-kwa-ra-po-ra-HẼI",  pt: "Flauta de taquara / bambu", note: "Instrumento de sopro artesanal" },
      { g: "Mokantar",        ph: "mo-kan-TAR",            pt: "Cantar (verbo)", ex: "Xe mokantar = Eu canto; A'e mokantar toré = Ele canta o Toré" },
      { g: "Mokantar aty",    ph: "mo-kan-tar-a-TÎ",       pt: "Cantar junto / coro / cantar em grupo" },
      { g: "Jeroky",          ph: "je-ro-KÎ",              pt: "Dançar / dança (verbo e substantivo)", ex: "Xe jeroky toré pe = Eu danço no Toré" },
      { g: "Jeroky aty",      ph: "je-ro-kî-a-TÎ",         pt: "Roda de dança / dança coletiva" },
      { g: "Porahẽi angatu",  ph: "po-ra-hẽi-an-ga-TU",   pt: "Bela canção / canto bonito" },
      { g: "Ñe'ẽng porahẽi",  ph: "nhê-ẽng-po-ra-HẼI",    pt: "Palavra cantada / verso / letra de canto" },
      { g: "Karuwar porahẽi", ph: "ka-ru-war-po-ra-HẼI",  pt: "Canto dos espíritos / música sagrada", note: "Cantada nos rituais do pajé" },
      { g: "Hu hu hu",        ph: "hu-hu-HU",               pt: "Vocalize ritual (onomatopeia do Toré)", note: "Som de chamada espiritual no Toré — 'hu' é o som do vento/espírito" },
      { g: "Yrywó porahẽi",   ph: "î-rî-wó-po-ra-HẼI",    pt: "Canto do pássaro / imitar pássaro cantando" },
      { g: "Pituna porahẽi",  ph: "pi-tu-na-po-ra-HẼI",    pt: "Canto da madrugada / canto ao amanhecer", note: "Cantos especiais ao amanhecer têm significado espiritual" },
      { g: "Maraí porahẽi",   ph: "ma-ra-í-po-ra-HẼI",     pt: "Canto de cura / benzimento cantado" },
      { g: "Tatuarana",       ph: "ta-tu-a-RA-na",          pt: "Ritmo de percussão (lit. como a lagartixa)", note: "Padrão rítmico específico do Toré Tenetehára" },
    ]
  },

  // ── CORES AMPLIADO ────────────────────────────────────────────────────────
  cores: {
    name: "🎨 Cores", level: "basic",
    words: [
      { g: "Pytãng",          ph: "pî-TÃNG",              pt: "Vermelho", ex: "Pytãng hé = É vermelho" },
      { g: "Sasy",            ph: "sa-SÎ",                pt: "Azul / Azul-verde (espectro)", note: "Uma palavra cobre o espectro azul-verde" },
      { g: "Oby",             ph: "o-BÎ",                 pt: "Verde (vivo, como folha)", ex: "Kaá oby = Folha verde" },
      { g: "Tawá",            ph: "ta-WÁ",                pt: "Amarelo", ex: "Ko'yr tawá = Sol amarelo" },
      { g: "Hũ",              ph: "HŨ",                   pt: "Preto / escuro" },
      { g: "Morotĩ",          ph: "mo-ro-TĨ",             pt: "Branco / claro / puro" },
      { g: "Pinĩ",            ph: "pi-NĨ",                pt: "Malhado / pintado / multicolorido" },
      { g: "Pykasé",          ph: "pî-ka-SÊ",             pt: "Cinza / cor de cinza" },
      { g: "Tawá syk",        ph: "ta-wá-SÎK",            pt: "Laranja (lit. amarelo queimado)" },
      { g: "Pytãng hũ",       ph: "pî-tãng-HŨ",           pt: "Marrom / vermelho escuro (lit. vermelho-preto)", note: "Equivalente ao marrom/castanho" },
      { g: "Pytãng iky",      ph: "pî-tãng-i-KÎ",         pt: "Rosa / vermelho suave (lit. vermelho pequenininho)" },
      { g: "Sasy hũ",         ph: "sa-sî-HŨ",              pt: "Roxo / azul-escuro (lit. azul-preto)" },
      { g: "Pytãng tawá",     ph: "pî-tãng-ta-WÁ",        pt: "Cor de urucum / vermelho-alaranjado", note: "O urucum é tinta corporal sagrada dos Tenetehára" },
      { g: "Oby hũ",          ph: "o-bî-HŨ",               pt: "Verde escuro / verde mata" },
      { g: "Tawá morotĩ",     ph: "ta-wá-mo-ro-TĨ",        pt: "Bege / amarelo-claro (lit. amarelo-branco)" },
      { g: "Itá hũ",          ph: "i-tá-HŨ",               pt: "Preto brilhante / preto pedra" },
      { g: "Ywyrá pytãng",    ph: "î-wî-rá-pî-TÃNG",       pt: "Cor de madeira / marrom-avermelhado natural" },
      { g: "Hupe oby",        ph: "hu-pê-o-BÎ",             pt: "Verde-pele / verde musgo", note: "Lit. 'pele verde'" },
      { g: "Maracá pytãng",   ph: "ma-ra-ká-pî-TÃNG",       pt: "Vermelho de urucum (na pintura corporal)", note: "Pintura ritual — cor sagrada dos Tenetehára" },
      { g: "Tatá sasy",       ph: "ta-tá-sa-SÎ",            pt: "Azul-chama / cor de brasa azul" },
    ]
  },

  // ── CASA E ALDEIA AMPLIADO ────────────────────────────────────────────────
  casa: {
    name: "🏡 Casa e Aldeia", level: "basic",
    words: [
      { g: "Oka",             ph: "o-KA",                 pt: "Casa / habitação", ex: "Xe oka = Minha casa" },
      { g: "Oka porã",        ph: "o-ka-po-RÃ",           pt: "Casa bonita / bem construída" },
      { g: "Tapé",            ph: "ta-PÊ",                pt: "Caminho / estrada / trilha" },
      { g: "Tekohaw",         ph: "te-ko-HAW",            pt: "Aldeia / território / modo de ser do povo", note: "Conceito central — mais que aldeia: é o jeito de existir juntos" },
      { g: "Ywyrá",           ph: "î-wî-RÁ",              pt: "Madeira / árvore (para construção)" },
      { g: "Typé",            ph: "tî-PÊ",                pt: "Rede de dormir", note: "Dormitório tradicional — toda casa Tenetehára tem redes" },
      { g: "Tatapiré",        ph: "ta-ta-pi-RÊ",          pt: "Fogão a lenha / fogo doméstico" },
      { g: "Xipó",            ph: "shí-PÓ",               pt: "Cipó (para amarrar, construir)" },
      { g: "Meruwyra",        ph: "me-ru-wî-RA",          pt: "Porta / entrada da casa" },
      { g: "Jeju",            ph: "je-JÚ",                pt: "Telhado / cobertura de palha" },
      { g: "Mokã",            ph: "mo-KÃ",                pt: "Roça / plantação" },
      { g: "Taperé",          ph: "ta-pe-RÊ",             pt: "Rua da aldeia / espaço central comunitário" },
      { g: "Ka'a moká",       ph: "ka-a-mo-KÁ",           pt: "Beira do mato / floresta próxima" },
      { g: "Oka wirapohá",    ph: "o-ka-wî-ra-po-HÁ",    pt: "Janela (lit. abertura na madeira da casa)", note: "Casas tradicionais tinham aberturas de ventilação" },
      { g: "Oka kwer",        ph: "o-ka-KWER",            pt: "Quintal / área ao redor da casa" },
      { g: "Y'y rykó",        ph: "Î-Î-rî-KÓ",            pt: "Poço / reservatório de água (lit. onde fica a água)" },
      { g: "Xamõ",            ph: "sha-MÕ",               pt: "Cuia / vasilha de cerâmica (cozinha)", note: "Artesanato cerâmico tradicional Tenetehára" },
      { g: "Myrã",            ph: "mî-RÃ",                pt: "Panela / vasilha de cozinhar" },
      { g: "Oka kyty",        ph: "o-ka-kÎ-TÎ",           pt: "Cozinha (lit. lugar de cortar/preparar na casa)" },
      { g: "Typé rykó",       ph: "tî-pê-rî-KÓ",          pt: "Quarto / espaço das redes (lit. onde ficam as redes)" },
      { g: "Oka aty",         ph: "o-ka-a-TÎ",            pt: "Casa de reunião / maloca comunitária" },
      { g: "Oka moko'yr",     ph: "o-ka-mo-ko-ÎR",        pt: "Casa de um morador / moradia individual" },
    ]
  },
};

// ─── MERGE WITH MAIN VOCAB ────────────────────────────────────────────────────
if (typeof VOCAB !== 'undefined') {
  Object.assign(VOCAB, VOCAB_EXTRA);
  // Update level modules
  if (typeof LEVELS !== 'undefined') {
    LEVELS.basic.modules.push('escola', 'clima', 'trabalho', 'cantos');
    LEVELS.inter.modules.push('emocoes', 'plantas');
    // Override cores and casa with expanded versions
    // (already named 'cores' and 'casa' — will override automatically)
  }
  console.log('[Nhe\'ẽ] Vocab extra carregado:', Object.keys(VOCAB_EXTRA).length, 'módulos');
}
