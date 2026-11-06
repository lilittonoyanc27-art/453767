import { QuizQuestion } from './types.ts';

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionEs: "¿Qué debe hacer un centrocampista antes de recibir el balón?",
    questionHy: "Ի՞նչ պետք է անի կիսապաշտպանը գնդակը ստանալուց առաջ։",
    options: [
      { key: 'A', es: "Mirar solamente el balón", hy: "Նայել միայն գնդակին" },
      { key: 'B', es: "Observar el campo y la posición de los rivales", hy: "Դիտել խաղադաշտը և մրցակիցների դիրքերը" },
      { key: 'C', es: "Correr hacia el árbitro", hy: "Վազել դեպի մրցավարը" },
      { key: 'D', es: "Quedarse inmóvil", hy: "Մնալ անշարժ" },
    ],
    correctAnswer: 'B',
    tacticalTipEs: "El escaneo previo (visión periférica) permite decidir la jugada antes de que llegue el balón.",
    tacticalTipHy: "Խաղադաշտը նախապես դիտելը թույլ է տալիս որոշում կայացնել դեռ գնդակը ստանալուց առաջ։",
    topic: "Visión periférica / Տեսադաշտ և կողմնորոշում"
  },
  {
    id: 2,
    questionEs: "¿Qué significa jugar entre líneas?",
    questionHy: "Ի՞նչ է նշանակում խաղալ մրցակցի պաշտպանական և կիսապաշտպանական գծերի միջև։",
    options: [
      { key: 'A', es: "Jugar solamente por las bandas", hy: "Խաղալ միայն եզրերով" },
      { key: 'B', es: "Permanecer cerca del portero", hy: "Մնալ դարպասապահի մոտ" },
      { key: 'C', es: "Ocupar los espacios entre las líneas del rival", hy: "Զբաղեցնել մրցակցի գծերի միջև եղած տարածքները" },
      { key: 'D', es: "Enviar siempre balones largos", hy: "Միշտ երկար փոխանցումներ կատարել" },
    ],
    correctAnswer: 'C',
    tacticalTipEs: "Recibir entre la línea de mediocampo y defensa rival descoloca su estructura defensiva.",
    tacticalTipHy: "Մրցակցի գծերի միջև գնդակ ստանալը քանդում է նրանց պաշտպանական դասավորությունը։",
    topic: "Espacios / Տարածությունների օգտագործում"
  },
  {
    id: 3,
    questionEs: "¿Cuál es la mejor decisión en un contraataque de tres atacantes contra dos defensas?",
    questionHy: "Ո՞րն է լավագույն որոշումը երեք հարձակվողով երկու պաշտպանի դեմ հակագրոհի ժամանակ։",
    options: [
      { key: 'A', es: "Aprovechar la superioridad y pasar al compañero mejor colocado", hy: "Օգտագործել թվային առավելությունը և փոխանցել ավելի լավ դիրքում գտնվող թիմակցին" },
      { key: 'B', es: "Detenerse y esperar", hy: "Կանգնել և սպասել" },
      { key: 'C', es: "Regatear obligatoriamente a los dos defensas", hy: "Անպայման շրջանցել երկու պաշտպաններին" },
      { key: 'D', es: "Pasar el balón hacia el propio portero", hy: "Փոխանցել սեփական դարպասապահին" },
    ],
    correctAnswer: 'A',
    tacticalTipEs: "La superioridad numérica se concreta fijando un defensa y asistiendo al compañero libre.",
    tacticalTipHy: "Թվային առավելությունը իրացվում է պաշտպանին շեղելով և ազատ թիմակցին փոխանցելով։",
    topic: "Contraataque / Հակագրոհ և թվային առավելություն"
  },
  {
    id: 4,
    questionEs: "¿Por qué es importante controlar el balón con el primer toque?",
    questionHy: "Ինչո՞ւ է կարևոր գնդակի առաջին հպումով ճիշտ ընդունումը։",
    options: [
      { key: 'A', es: "Para detener el partido", hy: "Խաղը կանգնեցնելու համար" },
      { key: 'B', es: "Para evitar correr", hy: "Վազելուց խուսափելու համար" },
      { key: 'C', es: "Para conseguir una tarjeta", hy: "Քարտ ստանալու համար" },
      { key: 'D', es: "Para preparar la siguiente acción rápidamente", hy: "Հաջորդ գործողությունն արագ պատրաստելու համար" },
    ],
    correctAnswer: 'D',
    tacticalTipEs: "Un buen control orientado deja el balón listo para disparar, pasar o progresar.",
    tacticalTipHy: "Առաջին հպումով ճիշտ կառավարումը անմիջապես պատրաստում է հաջորդ հարվածը կամ փոխանցումը։",
    topic: "Control orientado / Առաջին հպում"
  },
  {
    id: 5,
    questionEs: "¿Qué significa hacer una cobertura defensiva?",
    questionHy: "Ի՞նչ է նշանակում ապահովագրել թիմակցին պաշտպանությունում։",
    options: [
      { key: 'A', es: "Subir siempre al ataque", hy: "Միշտ միանալ հարձակմանը" },
      { key: 'B', es: "Ayudar a un compañero y proteger el espacio detrás de él", hy: "Օգնել թիմակցին և պաշտպանել նրա հետևի տարածքը" },
      { key: 'C', es: "Permanecer fuera del campo", hy: "Մնալ խաղադաշտից դուրս" },
      { key: 'D', es: "Pedir un cambio", hy: "Փոխարինում խնդրել" },
    ],
    correctAnswer: 'B',
    tacticalTipEs: "La cobertura garantiza que si el compañero es superado, haya un segundo apoyo de inmediato.",
    tacticalTipHy: "Ապահովագրումը երաշխավորում է, որ եթե թիմակցին շրջանցեն, երկրորդ պաշտպանը պատրաստ կլինի։",
    topic: "Defensa / Պաշտպանական ապահովագրություն"
  },
  {
    id: 6,
    questionEs: "¿Qué debe hacer un jugador cuando pierde el balón cerca del área rival?",
    questionHy: "Ի՞նչ պետք է անի խաղացողը, երբ գնդակը կորցնում է մրցակցի տուգանային հրապարակի մոտ։",
    options: [
      { key: 'A', es: "Dejar de participar", hy: "Դադարել մասնակցել խաղին" },
      { key: 'B', es: "Esperar a que el rival ataque", hy: "Սպասել մրցակցի հարձակմանը" },
      { key: 'C', es: "Intentar recuperarlo rápidamente si la situación lo permite", hy: "Փորձել արագ վերադարձնել գնդակը, եթե իրավիճակը թույլ է տալիս" },
      { key: 'D', es: "Correr hacia el banquillo", hy: "Վազել դեպի պահեստայինների նստարան" },
    ],
    correctAnswer: 'C',
    tacticalTipEs: "La presión tras pérdida (gegenpressing) aprovecha el desorden inicial del rival para volver a atacar.",
    tacticalTipHy: "Կորստից հետո անհապաղ պրեսինգը թույլ է տալիս գնդակը հետ բերել մրցակցի դարպասին մոտ։",
    topic: "Presión tras pérdida / Պրեսինգ կորստից հետո"
  },
  {
    id: 7,
    questionEs: "¿Para qué sirve un cambio de orientación?",
    questionHy: "Ինչի՞ համար է օգտագործվում խաղի ուղղության փոփոխությունը։",
    options: [
      { key: 'A', es: "Para encontrar espacios libres en el otro lado", hy: "Մյուս եզրում ազատ տարածքներ գտնելու համար" },
      { key: 'B', es: "Para perder tiempo obligatoriamente", hy: "Պարտադիր ժամանակ ձգելու համար" },
      { key: 'C', es: "Para detener el ataque", hy: "Հարձակումը դադարեցնելու համար" },
      { key: 'D', es: "Para cambiar de portero", hy: "Դարպասապահին փոխելու համար" },
    ],
    correctAnswer: 'A',
    tacticalTipEs: "Mover el balón de una banda a otra desorganiza el bloque defensivo rival.",
    tacticalTipHy: "Գնդակը մի եզրից մյուսը տեղափոխելը ստիպում է մրցակցի պաշտպանությանը տեղաշարժվել և բացվել։",
    topic: "Cambio de juego / Խաղի ուղղության փոփոխություն"
  },
  {
    id: 8,
    questionEs: "¿Qué es una transición defensiva?",
    questionHy: "Ի՞նչ է պաշտպանական անցումը։",
    options: [
      { key: 'A', es: "Pasar de la defensa al ataque", hy: "Պաշտպանությունից հարձակման անցնելը" },
      { key: 'B', es: "Preparar un saque de esquina", hy: "Անկյունայինին պատրաստվելը" },
      { key: 'C', es: "Cambiar de posición antes del partido", hy: "Խաղից առաջ դիրքը փոխելը" },
      { key: 'D', es: "Pasar rápidamente del ataque a la defensa al perder el balón", hy: "Գնդակը կորցնելիս արագ անցնել հարձակումից պաշտպանության" },
    ],
    correctAnswer: 'D',
    tacticalTipEs: "Es el momento crucial en el que el equipo se reorganiza tácticamente tras perder la posesión.",
    tacticalTipHy: "Սա այն վճռորոշ պահն է, երբ թիմը գնդակը կորցնելուն պես վերադասավորվում է պաշտպանության։",
    topic: "Transición / Պաշտպանական անցում"
  },
  {
    id: 9,
    questionEs: "¿Qué debe hacer un delantero para evitar caer en fuera de juego?",
    questionHy: "Ի՞նչ պետք է անի հարձակվողը խաղից դուրս վիճակից խուսափելու համար։",
    options: [
      { key: 'A', es: "Permanecer siempre junto al portero rival", hy: "Միշտ մնալ մրցակցի դարպասապահի մոտ" },
      { key: 'B', es: "Controlar su posición respecto al penúltimo adversario y al balón cuando se realiza el pase", hy: "Փոխանցման պահին հետևել իր դիրքին՝ գնդակի և նախավերջին մրցակցի նկատմամբ" },
      { key: 'C', es: "No correr nunca hacia la portería", hy: "Երբեք չվազել դեպի դարպասը" },
      { key: 'D', es: "Levantar la mano antes de cada pase", hy: "Յուրաքանչյուր փոխանցումից առաջ ձեռք բարձրացնել" },
    ],
    correctAnswer: 'B',
    tacticalTipEs: "El fuera de juego se determina en el instante exacto en que sale el pase del compañero.",
    tacticalTipHy: "Խաղից դուրս վիճակը որոշվում է թիմակցի փոխանցման ճիշտ պահին։",
    topic: "Fuera de juego / Խաղից դուրս վիճակ"
  },
  {
    id: 10,
    questionEs: "¿Qué significa crear superioridad numérica?",
    questionHy: "Ի՞նչ է նշանակում թվային առավելություն ստեղծել։",
    options: [
      { key: 'A', es: "Tener más espectadores", hy: "Ավելի շատ հանդիսատես ունենալ" },
      { key: 'B', es: "Marcar más goles", hy: "Ավելի շատ գոլ խփել" },
      { key: 'C', es: "Tener más jugadores que el rival en una zona concreta", hy: "Որոշակի հատվածում ունենալ ավելի շատ խաղացող, քան մրցակիցը" },
      { key: 'D', es: "Realizar más sustituciones", hy: "Ավելի շատ փոխարինումներ կատարել" },
    ],
    correctAnswer: 'C',
    tacticalTipEs: "Generar 2 contra 1 o 3 contra 2 en una zona del campo facilita superar la presión.",
    tacticalTipHy: "Դաշտի որոշակի գոտում 2-ը 1-ի դեմ կամ 3-ը 2-ի դեմ իրավիճակը հեշտացնում է գրոհի զարգացումը։",
    topic: "Superioridad / Թվային առավելություն"
  },
  {
    id: 11,
    questionEs: "¿Qué debe hacer un defensa cuando el delantero rival intenta regatearlo?",
    questionHy: "Ի՞նչ պետք է անի պաշտպանը, երբ մրցակցի հարձակվողը փորձում է շրջանցել նրան։",
    options: [
      { key: 'A', es: "Mantener el equilibrio, controlar la distancia y esperar el momento adecuado", hy: "Պահպանել հավասարակշռությունը, ճիշտ հեռավորությունը և սպասել հարմար պահին" },
      { key: 'B', es: "Lanzarse al suelo inmediatamente", hy: "Անմիջապես սահանկում կատարել" },
      { key: 'C', es: "Dar la espalda al delantero", hy: "Մեջքով շրջվել դեպի հարձակվողը" },
      { key: 'D', es: "Abandonar la jugada", hy: "Դուրս գալ խաղային դրվագից" },
    ],
    correctAnswer: 'A',
    tacticalTipEs: "Aguantar sobre los apoyos sin precipitarse reduce el ángulo de regate del atacante.",
    tacticalTipHy: "Հավասարակշռությունը պահելը և չշտապելը փոքրացնում է հարձակվողի շրջանցման հնարավորությունը։",
    topic: "Duelo 1 contra 1 / 1-ը 1-ի դեմ պայքար"
  },
  {
    id: 12,
    questionEs: "¿Qué es un desmarque de ruptura?",
    questionHy: "Ի՞նչ է նշանակում արագ բացվել պաշտպանների հետևում։",
    options: [
      { key: 'A', es: "Retroceder siempre hacia el portero", hy: "Միշտ հետ շարժվել դեպի դարպասապահը" },
      { key: 'B', es: "Permanecer junto a un defensa", hy: "Մնալ պաշտպանի կողքին" },
      { key: 'C', es: "Detenerse en el centro del campo", hy: "Կանգնել խաղադաշտի կենտրոնում" },
      { key: 'D', es: "Correr hacia un espacio libre detrás de la defensa", hy: "Վազել պաշտպանների հետևում գտնվող ազատ տարածություն" },
    ],
    correctAnswer: 'D',
    tacticalTipEs: "El desmarque de ruptura busca profundidad y superar la última línea para encarar al portero.",
    tacticalTipHy: "Այս բացվելու նպատակն է ստանալ գնդակը պաշտպանների թիկունքում և դուրս գալ դարպասապահի դեմ։",
    topic: "Desmarque / Բացվել տարածության մեջ"
  },
  {
    id: 13,
    questionEs: "¿Qué es más importante al realizar un pase bajo presión?",
    questionHy: "Ի՞նչն է ավելի կարևոր ճնշման տակ փոխանցում կատարելիս։",
    options: [
      { key: 'A', es: "Golpear el balón lo más fuerte posible", hy: "Հնարավորինս ուժեղ հարվածել գնդակին" },
      { key: 'B', es: "Elegir una opción segura y ejecutar el pase con precisión", hy: "Ընտրել անվտանգ տարբերակ և ճշգրիտ փոխանցել" },
      { key: 'C', es: "Pasar siempre hacia atrás", hy: "Միշտ հետ փոխանցել" },
      { key: 'D', es: "Cerrar los ojos antes del pase", hy: "Փոխանցումից առաջ փակել աչքերը" },
    ],
    correctAnswer: 'B',
    tacticalTipEs: "Mantener la calma, asegurar la precisión y no regalar la posesión son reglas clave.",
    tacticalTipHy: "Հանգստությունը, անվտանգ տարբերակի ընտրությունն ու ճշգրտությունը խաղում վճռորոշ են։",
    topic: "Pase bajo presión / Փոխանցում ճնշման տակ"
  },
  {
    id: 14,
    questionEs: "¿Qué debe hacer un extremo cuando su lateral sube al ataque por fuera?",
    questionHy: "Ի՞նչ կարող է անել եզրային հարձակվողը, երբ թիմակից եզրային պաշտպանը միանում է հարձակմանը արտաքին եզրով։",
    options: [
      { key: 'A', es: "Salir del campo", hy: "Դուրս գալ խաղադաշտից" },
      { key: 'B', es: "Ocupar exactamente el mismo espacio", hy: "Զբաղեցնել ճիշտ նույն տարածքը" },
      { key: 'C', es: "Moverse hacia dentro para abrir un espacio y crear opciones", hy: "Շարժվել դեպի կենտրոն՝ տարածք ազատելու և տարբերակներ ստեղծելու համար" },
      { key: 'D', es: "Dejar de participar en la jugada", hy: "Դադարել մասնակցել դրվագին" },
    ],
    correctAnswer: 'C',
    tacticalTipEs: "El desdoblamiento: al meterse hacia dentro, arrastra al defensa y deja el carril libre al lateral.",
    tacticalTipHy: "Կենտրոն շարժվելով՝ եզրայինը ազատում է եզրը միացող պաշտպանի համար և նոր տարբերակ ստեղծում։",
    topic: "Desdoblamiento / Եզրային փոխլրացում"
  },
  {
    id: 15,
    questionEs: "¿Qué significa defender en bloque compacto?",
    questionHy: "Ի՞նչ է նշանակում պաշտպանվել խիտ դասավորվածությամբ։",
    options: [
      { key: 'A', es: "Mantener distancias cortas entre los jugadores y las líneas", hy: "Պահպանել փոքր հեռավորություններ խաղացողների և գծերի միջև" },
      { key: 'B', es: "Separar mucho a los defensas", hy: "Պաշտպաններին իրարից շատ հեռացնել" },
      { key: 'C', es: "Dejar libre el centro del campo", hy: "Ազատ թողնել խաղադաշտի կենտրոնը" },
      { key: 'D', es: "Jugar sin centrocampistas", hy: "Խաղալ առանց կիսապաշտպանների" },
    ],
    correctAnswer: 'A',
    tacticalTipEs: "Un bloque compacto minimiza los huecos interiores por donde el rival puede filtrar balones.",
    tacticalTipHy: "Խիտ բլոկը փակում է գծերի միջև բոլոր ճեղքերը, որոնցով մրցակիցը կարող է գնդակ անցկացնել։",
    topic: "Bloque compacto / Խիտ պաշտպանություն"
  },
  {
    id: 16,
    questionEs: "¿Por qué es útil recibir el balón con el cuerpo orientado hacia delante?",
    questionHy: "Ինչո՞ւ է օգտակար գնդակը ստանալ մարմնի՝ դեպի առաջ ուղղված դիրքով։",
    options: [
      { key: 'A', es: "Porque permite perder tiempo", hy: "Որովհետև թույլ է տալիս ժամանակ ձգել" },
      { key: 'B', es: "Porque evita todos los contactos", hy: "Որովհետև կանխում է բոլոր բախումները" },
      { key: 'C', es: "Porque obliga a pasar hacia atrás", hy: "Որովհետև ստիպում է հետ փոխանցել" },
      { key: 'D', es: "Porque facilita ver el campo y continuar el ataque", hy: "Որովհետև հեշտացնում է խաղադաշտը տեսնելը և հարձակումը շարունակելը" },
    ],
    correctAnswer: 'D',
    tacticalTipEs: "El perfil corporal adecuado ahorra giros innecesarios y acelera la toma de decisiones.",
    tacticalTipHy: "Մարմնի ճիշտ կողմնորոշումը խնայում է թանկարժեք վայրկյաններ և արագացնում հարձակումը։",
    topic: "Perfil corporal / Մարմնի դիրք"
  },
  {
    id: 17,
    questionEs: "¿Qué debe hacer un equipo cuando el rival presiona con muchos jugadores?",
    questionHy: "Ի՞նչ պետք է անի թիմը, երբ մրցակիցը շատ խաղացողներով պրեսինգ է կիրառում։",
    options: [
      { key: 'A', es: "Perder el balón intencionadamente", hy: "Դիտավորյալ կորցնել գնդակը" },
      { key: 'B', es: "Buscar espacios libres y crear líneas de pase", hy: "Գտնել ազատ տարածքներ և ստեղծել փոխանցման ուղիներ" },
      { key: 'C', es: "Dejar de moverse", hy: "Դադարել շարժվել" },
      { key: 'D', es: "Reunir a todos los jugadores en una esquina", hy: "Բոլոր խաղացողներին հավաքել մեկ անկյունում" },
    ],
    correctAnswer: 'B',
    tacticalTipEs: "La movilidad constante crea líneas de pase para salir airosos de la presión alta.",
    tacticalTipHy: "Ակտիվ շարժումը և ազատ ուղիների ստեղծումը թույլ են տալիս հաղթահարել ուժեղ պրեսինգը։",
    topic: "Salida de presión / Ելք պրեսինգից"
  },
  {
    id: 18,
    questionEs: "¿Qué significa temporizar en defensa?",
    questionHy: "Ի՞նչ է նշանակում պաշտպանությունում ժամանակ շահել։",
    options: [
      { key: 'A', es: "Atacar sin esperar", hy: "Անմիջապես հարձակվել" },
      { key: 'B', es: "Abandonar la defensa", hy: "Լքել պաշտպանությունը" },
      { key: 'C', es: "Retrasar el avance del atacante para permitir que lleguen los compañeros", hy: "Դանդաղեցնել հարձակվողի առաջխաղացումը, որպեսզի թիմակիցները հասցնեն օգնության" },
      { key: 'D', es: "Cometer una falta obligatoriamente", hy: "Անպայման խախտում կատարել" },
    ],
    correctAnswer: 'C',
    tacticalTipEs: "Temporizar evita ser superado y da tiempo vital para que el repliegue defensivo se complete.",
    tacticalTipHy: "Դանդաղեցնելով մրցակցին՝ թույլ ես տալիս թիմակիցներին վերադառնալ և վերականգնել պաշտպանությունը։",
    topic: "Temporización / Ժամանակ շահել"
  },
  {
    id: 19,
    questionEs: "¿Qué debe hacer un mediocentro cuando tiene espacio para avanzar con el balón?",
    questionHy: "Ի՞նչ պետք է անի կենտրոնական կիսապաշտպանը, երբ գնդակով առաջ շարժվելու ազատ տարածք ունի։",
    options: [
      { key: 'A', es: "Aprovechar el espacio y avanzar si es seguro", hy: "Օգտագործել տարածքը և առաջ շարժվել, եթե դա անվտանգ է" },
      { key: 'B', es: "Pasar siempre hacia atrás", hy: "Միշտ հետ փոխանցել" },
      { key: 'C', es: "Detenerse sin motivo", hy: "Առանց պատճառի կանգնել" },
      { key: 'D', es: "Enviar el balón fuera del campo", hy: "Գնդակը դուրս ուղարկել խաղադաշտից" },
    ],
    correctAnswer: 'A',
    tacticalTipEs: "Conducir fija a un rival del siguiente escalón y libera a un compañero para recibir.",
    tacticalTipHy: "Ազատ տարածքով առաջ շարժվելը ստիպում է մրցակցի պաշտպանին մոտենալ՝ ազատելով քո թիմակցին։",
    topic: "Conducción / Առաջխաղացում տարածության մեջ"
  },
  {
    id: 20,
    questionEs: "¿Qué es fundamental para que funcione la presión colectiva?",
    questionHy: "Ի՞նչն է կարևոր, որպեսզի թիմային պրեսինգը արդյունավետ լինի։",
    options: [
      { key: 'A', es: "Que solamente presione un jugador", hy: "Որ միայն մեկ խաղացող պրեսինգ կիրառի" },
      { key: 'B', es: "Que todos corran sin organización", hy: "Որ բոլորը վազեն առանց կազմակերպվածության" },
      { key: 'C', es: "Que los defensas no participen", hy: "Որ պաշտպանները չմասնակցեն" },
      { key: 'D', es: "Que los jugadores actúen coordinados y cierren las líneas de pase", hy: "Որ խաղացողները գործեն համաձայնեցված և փակեն փոխանցման ուղիները" },
    ],
    correctAnswer: 'D',
    tacticalTipEs: "La presión en equipo solo funciona si todos se mueven como un bloque sincronizado (¡como un verdadero EQUIPO!).",
    tacticalTipHy: "Թիմային պրեսինգը աշխատում է միայն այն դեպքում, երբ բոլորը գործում են որպես մեկ միասնական ԹԻՄ (EQUIPO):",
    topic: "Presión colectiva / Թիմային պրեսինգ"
  }
];

export const SECRET_WORD = "EQUIPO";

export const WORD_HINTS = [
  { es: "Significa «Grupo de personas que juegan juntas»", hy: "Նշանակում է «Մարդկանց խումբ, որոնք միասին են խաղում (ԹԻՄ)»" },
  { es: "Tiene 6 letras en español", hy: "Սպաներենում ունի 6 տառ՝ E-Q-U-I-P-O" },
  { es: "La primera letra es E y la última es O", hy: "Առաջին տառն է E, իսկ վերջինը՝ O" },
  { es: "En armenio se traduce como «Թիմ»", hy: "Հայերեն թարգմանվում է որպես «ԹԻՄ»" },
];
