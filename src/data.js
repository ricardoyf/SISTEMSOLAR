/*
 * Datos educativos: NASA Science y NASA NSSDCA. Véase ../SOURCES.md.
 * radiusKm: radio medio volumétrico, no ecuatorial.
 * distanceAU: semieje mayor medio; en la Luna, referencia heliocéntrica terrestre.
 * orbitDays y rotationHours: periodos sidéreos; signo negativo = retrógrado.
 * La órbita lunar se mide alrededor de la Tierra (384 400 km de media).
 * Valores de referencia aproximados; no son efemérides ni posiciones actuales.
 */

export const BODIES = [
  {
    id: 'sun',
    name: 'Sol',
    color: '#ffcc70',
    radiusKm: 695700,
    distanceAU: 0,
    orbitDays: 0,
    rotationHours: 609.12,
    tiltDeg: 7.25,
    type: 'star',
    kind: 'Estrella',
    tagline: 'Nuestra estrella, el origen de tanta energía',
    description: 'El Sol es una estrella de plasma que ilumina los planetas. Su gravedad domina el sistema solar y mantiene los planetas en órbita.',
    facts: [
      { title: 'Una fábrica de energía', text: 'En su núcleo, la fusión transforma hidrógeno en helio y libera energía. El Sol no arde como una hoguera.' },
      { title: 'Un viaje de luz', text: 'La luz tarda unos 8 minutos y 20 segundos en recorrer la distancia media entre el Sol y la Tierra.' },
      { title: 'Un giro diferente', text: 'El Sol no es sólido: sus regiones ecuatoriales giran más rápido que las polares. La rotación indicada es un valor de referencia.' }
    ],
    learn: { question: '¿Por qué brilla el Sol y la Tierra no?', answer: 'El Sol produce energía mediante fusión nuclear. La Tierra se ve iluminada porque refleja parte de la luz solar.' },
    source: 'https://science.nasa.gov/sun/facts/'
  },
  {
    id: 'mercury',
    name: 'Mercurio',
    color: '#b6aaa0',
    radiusKm: 2439.7,
    distanceAU: 0.38709893,
    orbitDays: 87.969,
    rotationHours: 1407.6,
    tiltDeg: 0.034,
    type: 'rocky',
    kind: 'Planeta rocoso',
    tagline: 'Pequeño y veloz, muy cerca del Sol',
    description: 'Mercurio es el planeta más pequeño y el más cercano al Sol. Su superficie conserva cráteres y grandes contrastes de temperatura.',
    facts: [
      { title: 'Años muy cortos', text: 'Da una vuelta al Sol en unos 88 días terrestres. Durante un año de la Tierra completa algo más de cuatro órbitas.' },
      { title: 'Apenas una envoltura', text: 'Posee una exosfera muy tenue. Apenas retiene calor: la superficie puede alcanzar unos 430 °C de día y bajar a −180 °C de noche.' },
      { title: 'Giro y día no son iguales', text: 'Una rotación tarda unos 59 días terrestres; un ciclo completo de día y noche, unos 176 días.' }
    ],
    learn: { question: '¿Es el planeta más caliente por estar más cerca?', answer: 'No. Venus es más caliente porque su densa atmósfera retiene mucho más calor.' },
    source: 'https://science.nasa.gov/mercury/facts/'
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#e5bf8b',
    radiusKm: 6051.8,
    distanceAU: 0.72333199,
    orbitDays: 224.701,
    rotationHours: -5832.6,
    tiltDeg: 177.36,
    type: 'rocky',
    kind: 'Planeta rocoso',
    tagline: 'Bajo sus nubes, un calor extraordinario',
    description: 'Venus tiene un tamaño parecido al de la Tierra, pero un ambiente muy distinto. Su densa atmósfera de dióxido de carbono provoca un intenso efecto invernadero.',
    facts: [
      { title: 'Más caliente que Mercurio', text: 'Su temperatura superficial media ronda los 464 °C. La distancia al Sol no basta para explicar la temperatura de un planeta.' },
      { title: 'Gira al revés', text: 'Su rotación es retrógrada: gira en sentido contrario al de la Tierra. Una vuelta sobre sí mismo tarda unos 243 días terrestres.' },
      { title: 'Dos maneras de medir un día', text: 'Su órbita tarda unos 225 días. Su rotación dura más que su año, pero el día solar, de un mediodía al siguiente, dura unos 117 días.' }
    ],
    learn: { question: '¿Un tamaño parecido significa un planeta parecido?', answer: 'No. La atmósfera, el agua y la historia de cada mundo pueden producir ambientes completamente diferentes.' },
    source: 'https://science.nasa.gov/venus/venus-facts/'
  },
  {
    id: 'earth',
    name: 'Tierra',
    color: '#72c1e8',
    radiusKm: 6371,
    distanceAU: 1,
    orbitDays: 365.256,
    rotationHours: 23.9345,
    tiltDeg: 23.44,
    type: 'rocky',
    kind: 'Planeta rocoso',
    tagline: 'Un mundo de océanos, nuestro único hogar',
    description: 'La Tierra alberga océanos de agua líquida y es el único mundo donde conocemos vida. Su atmósfera y su campo magnético ayudan a protegerla.',
    facts: [
      { title: 'Dos movimientos', text: 'La rotación produce la sucesión de días y noches. La traslación es el recorrido alrededor del Sol, que tarda unos 365,25 días.' },
      { title: 'La clave de las estaciones', text: 'El eje terrestre está inclinado unos 23,4°. Esa inclinación cambia la duración del día y el ángulo de la luz durante el año.' },
      { title: 'Nuestra regla espacial', text: 'Una unidad astronómica, o UA, equivale a unos 149,6 millones de kilómetros: aproximadamente la distancia media entre la Tierra y el Sol.' }
    ],
    learn: { question: '¿Es verano porque estamos mucho más cerca del Sol?', answer: 'Las estaciones se deben principalmente a la inclinación del eje. Cuando es verano en el hemisferio norte, es invierno en el sur.' },
    source: 'https://science.nasa.gov/earth/facts/'
  },
  {
    id: 'moon',
    name: 'Luna',
    color: '#c7cbd2',
    radiusKm: 1737.4,
    distanceAU: 1,
    orbitDays: 27.3217,
    rotationHours: 655.7208,
    tiltDeg: 6.68,
    type: 'moon',
    kind: 'Satélite de la Tierra',
    tagline: 'Nuestra compañera, una cara siempre familiar',
    description: 'La Luna es el satélite natural de la Tierra y refleja la luz del Sol. Orbita nuestro planeta a unos 384.400 kilómetros de distancia media.',
    facts: [
      { title: 'Sí que gira', text: 'Tarda unos 27,3 días en rotar y en orbitar la Tierra. Esa sincronización hace que veamos aproximadamente la misma cara.' },
      { title: 'La explicación de las fases', text: 'Vemos distintas porciones de su mitad iluminada por el Sol. Las fases no las produce la sombra de la Tierra; esa sombra interviene en los eclipses lunares.' },
      { title: 'Dos meses diferentes', text: 'La órbita dura 27,3 días, pero de una luna llena a la siguiente pasan unos 29,5. Mientras la Luna gira, la Tierra también avanza alrededor del Sol.' }
    ],
    learn: { question: '¿La cara oculta está siempre a oscuras?', answer: 'No. También recibe luz solar. «Oculta» significa que normalmente no la vemos desde la Tierra.' },
    source: 'https://science.nasa.gov/moon/facts/'
  },
  {
    id: 'mars',
    name: 'Marte',
    color: '#e88b65',
    radiusKm: 3389.5,
    distanceAU: 1.52366231,
    orbitDays: 686.98,
    rotationHours: 24.6229,
    tiltDeg: 25.19,
    type: 'rocky',
    kind: 'Planeta rocoso',
    tagline: 'Un desierto rojo con huellas de agua',
    description: 'Marte es un mundo rocoso, frío y de atmósfera muy tenue. Su color rojizo procede de minerales de hierro oxidados en la superficie.',
    facts: [
      { title: 'Un día familiar', text: 'Su día solar dura unas 24 horas y 40 minutos. Sin embargo, su año dura unos 687 días terrestres: casi el doble que el nuestro.' },
      { title: 'Pistas de un pasado húmedo', text: 'Antiguos cauces y minerales muestran que hubo agua líquida en la superficie. Hoy conserva hielo de agua.' },
      { title: 'Dos pequeñas lunas', text: 'Fobos y Deimos son sus satélites. Marte también tiene el enorme volcán Olympus Mons y grandes sistemas de cañones.' }
    ],
    learn: { question: '¿Encontrar agua demuestra que hubo vida?', answer: 'No. El agua ayuda a identificar ambientes que pudieron ser habitables, pero eso no demuestra que estuvieran habitados.' },
    source: 'https://science.nasa.gov/mars/facts/'
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    color: '#d4ac8c',
    radiusKm: 69911,
    distanceAU: 5.20336301,
    orbitDays: 4332.589,
    rotationHours: 9.925,
    tiltDeg: 3.13,
    type: 'gas',
    kind: 'Gigante gaseoso',
    tagline: 'El mayor planeta, un mundo de tormentas',
    description: 'Júpiter es el planeta más grande del sistema solar. Está formado principalmente por hidrógeno y helio, con una atmósfera de bandas y tormentas.',
    facts: [
      { title: 'Grande y rápido', text: 'Su diámetro medio es casi once veces el terrestre. Aun así, completa una rotación en menos de diez horas.' },
      { title: 'Sin suelo donde aterrizar', text: 'No tiene una superficie sólida como la Tierra. Al descender, los gases pasan gradualmente a fluidos sometidos a presiones enormes.' },
      { title: 'Todo un sistema', text: 'Ío, Europa, Ganímedes y Calisto son cuatro de sus lunas. Ganímedes es la luna más grande del sistema solar.' }
    ],
    learn: { question: '¿Un planeta grande tiene siempre un día más largo?', answer: 'No. Júpiter gira mucho más deprisa que la Tierra. El tamaño no determina por sí solo la duración del día.' },
    source: 'https://science.nasa.gov/jupiter/jupiter-facts/'
  },
  {
    id: 'saturn',
    name: 'Saturno',
    color: '#e5d2a6',
    radiusKm: 58232,
    distanceAU: 9.53707032,
    orbitDays: 10755.699,
    rotationHours: 10.656,
    tiltDeg: 26.73,
    type: 'gas',
    kind: 'Gigante gaseoso',
    tagline: 'Miles de anillos alrededor de un gigante',
    description: 'Saturno es el segundo planeta más grande y destaca por sus brillantes anillos. Como Júpiter, está compuesto principalmente por hidrógeno y helio.',
    facts: [
      { title: 'Los anillos no son sólidos', text: 'Están formados por innumerables fragmentos, sobre todo de hielo, con roca y polvo. Cada fragmento orbita Saturno.' },
      { title: 'Un aniversario lejano', text: 'Una vuelta al Sol tarda unos 29,4 años terrestres. Su rotación, en cambio, dura alrededor de 10,7 horas.' },
      { title: 'Mundos entre sus lunas', text: 'Titán tiene una atmósfera densa y lagos de metano y etano. Encélado expulsa chorros de agua y hielo desde su región polar sur.' }
    ],
    learn: { question: '¿Solo Saturno tiene anillos?', answer: 'No. Júpiter, Urano y Neptuno también tienen anillos, aunque son mucho menos llamativos.' },
    source: 'https://science.nasa.gov/saturn/facts/'
  },
  {
    id: 'uranus',
    name: 'Urano',
    color: '#a3d4d8',
    radiusKm: 25362,
    distanceAU: 19.19126393,
    orbitDays: 30685.4,
    rotationHours: -17.24,
    tiltDeg: 97.77,
    type: 'ice',
    kind: 'Gigante de hielo',
    tagline: 'Un gigante azulado que gira casi tumbado',
    description: 'Urano es un gigante de hielo de tonos azul verdosos. Su eje está tan inclinado que parece avanzar alrededor del Sol girando de lado.',
    facts: [
      { title: 'Estaciones extremas', text: 'Su eje tiene una inclinación cercana a 98° y su órbita dura unos 84 años terrestres. Cerca de los polos puede haber décadas de luz u oscuridad.' },
      { title: 'Azul gracias al metano', text: 'El metano de su atmósfera absorbe parte de la luz roja. La luz que vuelve al espacio adquiere tonos azul verdosos.' },
      { title: 'Hielo no significa suelo helado', text: 'La expresión «gigante de hielo» alude a materiales como agua, amoníaco y metano en su interior. No es una esfera sólida de hielo donde aterrizar.' }
    ],
    learn: { question: '¿Los −224 °C describen todo Urano?', answer: 'No. Son mínimos medidos en algunas capas de la atmósfera. La temperatura depende de la altura y aumenta mucho hacia el interior.' },
    source: 'https://science.nasa.gov/uranus/facts/'
  },
  {
    id: 'neptune',
    name: 'Neptuno',
    color: '#83b6d1',
    radiusKm: 24622,
    distanceAU: 30.06896348,
    orbitDays: 60189.018,
    rotationHours: 16.11,
    tiltDeg: 28.32,
    type: 'ice',
    kind: 'Gigante de hielo',
    tagline: 'Años larguísimos en el reino del viento',
    description: 'Neptuno es el más lejano de los ocho planetas. Su atmósfera tiene vientos muy intensos y grandes tormentas que aparecen y desaparecen.',
    facts: [
      { title: 'Una órbita de generaciones', text: 'Su año dura unos 165 años terrestres. Se encuentra, de media, unas treinta veces más lejos del Sol que la Tierra.' },
      { title: 'Un azul menos intenso', text: 'Urano y Neptuno tienen colores azul verdosos parecidos. El azul intenso de muchas fotos de Neptuno fue realzado para mostrar mejor sus nubes.' },
      { title: 'Más allá de los ocho planetas', text: 'El sistema solar continúa más allá de Neptuno. Allí está el cinturón de Kuiper, con cuerpos helados y planetas enanos como Plutón.' }
    ],
    learn: { question: '¿Plutón ha desaparecido del sistema solar?', answer: 'No. Sigue orbitando el Sol. Se clasifica como planeta enano porque comparte su región orbital con muchos otros cuerpos.' },
    source: 'https://science.nasa.gov/neptune/neptune-facts/'
  }
];

export const QUESTIONS = [
  {
    question: 'Mercurio está más cerca del Sol. ¿Por qué Venus es más caliente?',
    choices: ['Porque es más grande', 'Por su densa atmósfera y su efecto invernadero', 'Porque el Sol ilumina solo a Venus', 'Porque Venus no tiene noche'],
    answer: 1,
    explanation: 'La atmósfera de Venus retiene mucho calor. La temperatura depende también de la atmósfera, no solo de la distancia al Sol.',
    bodyId: 'venus'
  },
  {
    question: '¿Qué explica que normalmente veamos la misma cara de la Luna?',
    choices: ['La Luna no gira', 'La Tierra tapa siempre su otra mitad', 'Gira una vez por cada órbita alrededor de la Tierra', 'Solo recibe luz por una cara'],
    answer: 2,
    explanation: 'La Luna sí gira. Su rotación está sincronizada con su órbita, ambas de unos 27,3 días. La cara oculta también recibe luz solar.',
    bodyId: 'moon'
  },
  {
    question: '¿Cuál es la causa principal de las estaciones en la Tierra?',
    choices: ['La inclinación de su eje durante la órbita', 'La sombra de la Luna', 'Que el Sol se enciende más en verano', 'Un gran cambio de distancia al Sol'],
    answer: 0,
    explanation: 'El eje inclinado cambia el ángulo de la luz y las horas de sol de cada hemisferio. Por eso sus estaciones son opuestas.',
    bodyId: 'earth'
  },
  {
    question: 'Durante un año terrestre, ¿qué sucede aproximadamente en Mercurio?',
    choices: ['No llega a completar una órbita', 'Completa exactamente una órbita', 'Completa dos órbitas', 'Completa algo más de cuatro órbitas'],
    answer: 3,
    explanation: 'Un año terrestre dura unos 365 días y una órbita de Mercurio, 88. Al dividir 365 entre 88 obtenemos aproximadamente 4,15.',
    bodyId: 'mercury'
  },
  {
    question: '¿Qué significa que Júpiter sea un gigante gaseoso?',
    choices: ['Que es una nube que se puede atravesar sin peligro', 'Que está hecho de aire como el terrestre', 'Que no tiene un suelo sólido accesible como el terrestre', 'Que es una estrella pequeña'],
    answer: 2,
    explanation: 'Júpiter está compuesto principalmente por hidrógeno y helio. Al descender, la presión y la temperatura aumentan y los gases pasan a fluidos muy densos.',
    bodyId: 'jupiter'
  },
  {
    question: '¿Cómo son realmente los anillos de Saturno?',
    choices: ['Un único disco sólido', 'Muchos fragmentos que orbitan el planeta', 'Caminos trazados por sus lunas', 'Luz que emite Saturno'],
    answer: 1,
    explanation: 'Son innumerables partículas y fragmentos, sobre todo de hielo, con roca y polvo. Cada uno recorre su propia órbita.',
    bodyId: 'saturn'
  },
  {
    question: 'Si mostramos tamaños y distancias con una misma escala real, ¿qué ocurre?',
    choices: ['Los planetas llenan casi todo el espacio', 'Todos los planetas parecen iguales', 'El Sol ocupa toda la órbita de Mercurio', 'Los planetas quedan diminutos y muy separados'],
    answer: 3,
    explanation: 'Las distancias entre órbitas son enormes frente al tamaño de los planetas. Para explorarlos juntos se suelen ampliar sus tamaños y comprimir las separaciones.',
    bodyId: 'earth'
  },
  {
    question: 'En Venus, ¿qué dura más que su año de unos 225 días terrestres?',
    choices: ['Una vuelta sobre su eje, de unos 243 días', 'Su ciclo solar, de unos 117 días', 'Un eclipse', 'El viaje de la luz hasta la Tierra'],
    answer: 0,
    explanation: 'Su rotación sidérea es más larga que su año. El día solar es otra medida y dura unos 117 días terrestres, así que conviene distinguirlos.',
    bodyId: 'venus'
  },
  {
    question: 'Los antiguos cauces de Marte indican que hubo agua. ¿Qué podemos concluir?',
    choices: ['Que hubo seres humanos', 'Que pudo haber ambientes habitables, sin demostrar vida', 'Que aún hay ríos por toda su superficie', 'Que el planeta es cálido hoy'],
    answer: 1,
    explanation: 'Las pruebas de agua pasada ayudan a reconstruir ambientes. Un lugar habitable puede reunir condiciones para la vida, pero no demuestra que estuviera habitado.',
    bodyId: 'mars'
  },
  {
    question: 'Neptuno es el último de los ocho planetas. ¿Termina allí el sistema solar?',
    choices: ['Sí, más allá no hay cuerpos', 'Sí, allí desaparece la gravedad solar', 'No, hay cuerpos helados y planetas enanos más allá', 'No, porque Plutón es una estrella'],
    answer: 2,
    explanation: 'El cinturón de Kuiper contiene numerosos cuerpos helados, incluido Plutón, que es un planeta enano. El sistema solar se extiende mucho más allá de Neptuno.',
    bodyId: 'neptune'
  }
];

export const MISSIONS = [
  {
    id: 'venus-heat',
    title: 'El misterio del planeta más caliente',
    description: 'Visita Mercurio y Venus. Compara su distancia al Sol y lee qué ocurre con sus atmósferas antes de responder.',
    bodyId: 'venus',
    question: '¿Qué explica que Venus sea más caliente aunque esté más lejos?',
    choices: ['Su atmósfera retiene mucho calor', 'Es el planeta más grande', 'Mercurio no recibe luz'],
    answer: 0,
    explanation: 'La distancia importa, pero no lo explica todo. Venus tiene un potente efecto invernadero; la tenue exosfera de Mercurio apenas retiene calor.'
  },
  {
    id: 'neptune-year',
    title: 'Un cumpleaños en Neptuno',
    description: 'Selecciona Neptuno y acelera el tiempo. Observa cuánto avanza frente a la Tierra y consulta la duración de su año.',
    bodyId: 'neptune',
    question: 'Si hoy nacieras allí, ¿cuándo completarías tu primer año neptuniano?',
    choices: ['Dentro de 16 horas terrestres', 'Dentro de unos 165 años terrestres', 'Dentro de 365 días terrestres'],
    answer: 1,
    explanation: 'Un año es una órbita alrededor del Sol. Neptuno necesita unos 165 años terrestres; sus 16 horas aproximadas corresponden a una rotación.'
  },
  {
    id: 'moon-turns',
    title: 'La Luna también gira',
    description: 'Visita la Luna y consulta sus tiempos de rotación y órbita. Imagina que caminas alrededor de una silla mirando siempre hacia ella.',
    bodyId: 'moon',
    question: 'Al completar la vuelta a la silla mirándola, ¿habrás girado sobre ti mismo?',
    choices: ['No, mirar la silla impide girar', 'Habrás girado dos veces', 'Sí, una vez: como la Luna alrededor de la Tierra'],
    answer: 2,
    explanation: 'Tu orientación respecto a la habitación cambia durante el recorrido. La Luna hace lo mismo: una rotación por órbita mantiene la misma cara hacia la Tierra.'
  },
  {
    id: 'empty-space',
    title: 'Descubre cuánto espacio hay',
    description: 'Abre la comparación de tamaños y después la de distancias. Fíjate en lo pequeña que es la Tierra frente al espacio de su órbita.',
    bodyId: 'earth',
    question: '¿Por qué la vista de exploración amplía los planetas?',
    choices: ['Para que puedan verse entre distancias enormes', 'Porque los planetas crecen al alejarnos', 'Porque todos tienen el mismo tamaño real'],
    answer: 0,
    explanation: 'A una única escala real, los planetas serían puntos diminutos. Separar tamaños y distancias en dos comparaciones permite comprender ambas proporciones.'
  }
];
