# Fuentes y criterios científicos

Revisión de contenido: **24 de octubre de 2026**. Datos y textos educativos de referencia; esta aplicación no es un servicio de efemérides ni representa las posiciones actuales de los planetas.

Los textos son explicaciones originales en español basadas en las fuentes primarias que se enumeran a continuación. NASA no patrocina ni certifica esta aplicación.

## Convenciones de los datos

- **Radio (`radiusKm`)**: radio medio volumétrico. El diámetro mostrado se calcula como dos veces ese radio. No se mezclan diámetros medios y ecuatoriales en la comparación.
- **Distancia (`distanceAU`)**: semieje mayor aproximado, con elementos medios J2000 de las fichas NSSDCA. Una UA equivale exactamente a 149.597.870,7 km. En las explicaciones se redondea a 149,6 millones de km y se relaciona con la distancia media Tierra–Sol.
- **Órbita (`orbitDays`)**: periodo sidéreo expresado en días terrestres. La tabla resumida de NASA también publica periodos tropicales; aquí se usan las fichas individuales para mantener una definición consistente.
- **Rotación (`rotationHours`)**: periodo sidéreo en horas terrestres. El signo negativo indica rotación retrógrada; su duración es el valor absoluto. No equivale necesariamente al día solar, medido de un mediodía al siguiente.
- **Inclinación (`tiltDeg`)**: oblicuidad respecto a la perpendicular al plano de la órbita. Venus y Urano tienen valores mayores de 90°; el motor gráfico debe evitar invertir dos veces el giro al combinar inclinación y signo retrógrado.
- **Sol**: `orbitDays: 0` y `distanceAU: 0` señalan el centro de referencia del modelo, no inmovilidad absoluta. El Sol orbita la galaxia. Sus 609,12 horas son un periodo de rotación de referencia a 16° de latitud; la rotación real varía con la latitud.
- **Luna**: `distanceAU: 1` es una referencia aproximada a su distancia heliocéntrica, compartida con la Tierra. Su `orbitDays: 27.3217` corresponde a la órbita alrededor de la Tierra, a unos 384.400 km de distancia media. El ciclo de fases dura aproximadamente 29,53 días. El valor de rotación se conserva sincronizado con la órbita al nivel de precisión utilizado.
- **Gigantes**: los radios se refieren al cuerpo, sin anillos. Las rotaciones son valores convencionales aproximados; sus atmósferas no se comportan como una superficie rígida.
- **Colores**: ilustrativos. Urano y Neptuno se presentan con tonos azul verdosos parecidos; el azul muy intenso habitual de Neptuno procede de imágenes con color y contraste realzados.

## Fichas numéricas de NASA NSSDCA

| Cuerpo | Radio medio km | Distancia UA aprox. | Órbita sidérea días | Rotación sidérea horas | Fuente |
|---|---:|---:|---:|---:|---|
| Sol | 695.700 | 0, centro del modelo | No aplicable | 609,12, referencia | [Sun Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html) |
| Mercurio | 2.439,7 | 0,387 | 87,969 | 1.407,6 | [Mercury Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html) |
| Venus | 6.051,8 | 0,723 | 224,701 | −5.832,6 | [Venus Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html) |
| Tierra | 6.371 | 1 | 365,256 | 23,9345 | [Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) |
| Luna | 1.737,4 | ≈1, heliocéntrica | 27,3217, alrededor de Tierra | ≈655,72 | [Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) |
| Marte | 3.389,5 | 1,524 | 686,980 | 24,6229 | [Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) |
| Júpiter | 69.911 | 5,203 | 4.332,589 | 9,925 | [Jupiter Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html) |
| Saturno | 58.232 | 9,537 | 10.755,699 | 10,656 | [Saturn Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html) |
| Urano | 25.362 | 19,191 | 30.685,4 | −17,24 | [Uranus Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html) |
| Neptuno | 24.622 | 30,069 | 60.189,018 | 16,11 | [Neptune Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html) |

Los parámetros orbitales varían con la época y el método empleado. La interfaz debe redondear de forma educativa: por ejemplo, 29,4 años para Saturno, 84 para Urano y 165 para Neptuno. Los decimales del archivo de datos no implican esa exactitud del modelo gráfico.

Definiciones: [notas de la tabla planetaria](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planetfact_notes.html) y [notas de las fichas individuales](https://nssdc.gsfc.nasa.gov/planetary/factsheet/fact_notes.html).

## Fuentes de las fichas y las actividades

| Tema | Fuente primaria | Aplicación didáctica |
|---|---|---|
| Sol | [NASA: Sun Facts](https://science.nasa.gov/sun/facts/) | Fusión, luz, gravedad y rotación diferencial. |
| Mercurio | [NASA: Mercury Facts](https://science.nasa.gov/mercury/facts/) | Exosfera, temperaturas extremas, órbita y diferencia entre rotación y día solar. |
| Venus | [NASA: Venus Facts](https://science.nasa.gov/venus/venus-facts/) | Atmósfera, efecto invernadero, rotación retrógrada. Las duraciones de día solar y rotación se contrastan con su ficha NSSDCA. |
| Tierra | [NASA: Earth Facts](https://science.nasa.gov/earth/facts/) | Agua, movimientos y estaciones debidas al eje inclinado. |
| Estaciones | [NASA: Milankovitch Cycles](https://science.nasa.gov/science-research/earth-science/climate-science/milankovitch-orbital-cycles-and-their-role-in-earths-climate/) | Distinguir inclinación, distancia y cambios estacionales. |
| Luna | [NASA: Moon Facts](https://science.nasa.gov/moon/facts/) | Rotación síncrona, cara visible, distancia y ciclos. |
| Fases lunares | [NASA: Moon Phases](https://science.nasa.gov/moon/moon-phases/) | La fracción iluminada visible depende de la geometría; diferencia entre ciclo orbital y ciclo de fases. |
| Giro lunar | [NASA: The Moon's Rotation](https://science.nasa.gov/resource/the-moons-rotation/) | Actividad de rodear una silla manteniendo la mirada hacia ella. |
| Marte | [NASA: Mars Facts](https://science.nasa.gov/mars/facts/) | Geología, agua pasada, satélites y diferencia entre habitabilidad y vida demostrada. |
| Júpiter | [NASA: Jupiter Facts](https://science.nasa.gov/jupiter/jupiter-facts/) | Composición, tamaño, rotación y ausencia de superficie sólida accesible. |
| Saturno | [NASA: Saturn Facts](https://science.nasa.gov/saturn/facts/) | Anillos de partículas, año largo y lunas. |
| Anillos | [NASA: Cassini FAQ](https://science.nasa.gov/mission/cassini/faq/) | Cada fragmento del anillo orbita por separado. |
| Urano | [NASA: Uranus Facts](https://science.nasa.gov/uranus/facts/) | Eje inclinado, composición y mínimo de temperatura atmosférica. |
| Neptuno | [NASA: Neptune Facts](https://science.nasa.gov/neptune/neptune-facts/) | Año de 165 años terrestres, tormentas cambiantes y corrección del color realzado. |
| Color | [Universidad de Oxford: revisión de los colores de Urano y Neptuno, 2024](https://www.ox.ac.uk/news/2024-01-05-new-images-reveal-what-neptune-and-uranus-really-look-0) | Fuente primaria complementaria para los tonos azul verdosos similares. |
| Plutón | [NASA: Pluto Facts](https://science.nasa.gov/dwarf-planets/pluto/facts/) y [planetas enanos](https://science.nasa.gov/dwarf-planets/) | El sistema solar continúa más allá de los ocho planetas. |

## Decisiones para evitar errores frecuentes

1. No se afirma que Mercurio carezca por completo de envoltura gaseosa: posee una exosfera muy tenue.
2. En Venus se distingue una rotación de unos 243 días de un día solar de unos 117 días. Solo la primera supera su año de unos 225 días.
3. La Luna gira sobre sí misma y tiene rotación síncrona. La cara oculta no es una cara permanentemente oscura.
4. Las fases lunares dependen de la geometría Sol–Tierra–Luna. La sombra terrestre interviene en eclipses lunares, no explica las fases ordinarias.
5. Las estaciones terrestres se deben principalmente a la inclinación del eje, no a estar mucho más cerca del Sol en verano.
6. Los −224 °C de Urano son un mínimo en determinadas capas atmosféricas, no una temperatura uniforme del planeta.
7. No se ofrece un número exacto permanente de lunas de los planetas gigantes: los descubrimientos y las confirmaciones cambian.
8. En comparaciones de escala se separa el tamaño de los cuerpos de las distancias orbitales. Una vista que amplía los planetas no es una representación única a escala real.
9. Encontrar indicios de agua pasada no demuestra la existencia de vida.
10. Plutón sigue formando parte del sistema solar y se presenta como planeta enano.

## Alcance del modelo visual

El sistema visual es una representación didáctica simplificada. Las formas, texturas y colores ilustran rasgos generales, no sustituyen imágenes científicas ni mapas de superficie. Las posiciones no corresponden a una fecha real. La escala de exploración facilita seleccionar y observar los cuerpos; las comparaciones numéricas usan las magnitudes indicadas arriba.

Para mantener el rigor, los periodos orbitales relativos deben derivarse de `orbitDays` y del tiempo transcurrido. La órbita lunar debe mantenerse separada de la rotación de la esfera terrestre. Si se usan órbitas circulares, deben explicarse como aproximación; una elipse física necesita el Sol en un foco y velocidad orbital variable.
