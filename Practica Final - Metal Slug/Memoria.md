![](Aspose.Words.5709fbb1-45f0-402c-9a54-9c13e3246a6a.001.png)

DESARROLLO DE VIDEOJUEGOS MEDIANTE TECNOLOGÍAS WEB

CURSO 2020/21

**PRÁCTICA FINAL:**

![](Aspose.Words.5709fbb1-45f0-402c-9a54-9c13e3246a6a.002.png)

Pablo Álvaro García Álvaro Corrochano López Carlos Jiménez Álvarez

Alejandro Ruiz Martín

**ÍNDICE**

[**El juego](#_page2_x72.00_y72.00)

  1.1 [Objetivo del Juego](#_page2_x72.00_y214.47) <br>
  1.2 [Mecánicas](#_page2_x72.00_y470.62) <br>
  1.3 [Personajes](#_page3_x72.00_y72.00) <br>
    [Marco Rossi](#_page3_x72.00_y103.10) <br>
    [Enemigos](#_page3_x72.00_y397.88) <br>
      [SOLDIER](#_page3_x72.00_y560.62) <br>
      [RIFLE](#_page3_x72.00_y649.21) <br>
      [SHIELD](#_page4_x72.00_y72.00) <br>
      [HELICÓPTERO](#_page4_x72.00_y198.35) <br>
      [ALLEN](#_page4_x72.00_y286.94) <br>
      [Prisionero](#_page4_x72.00_y427.29) <br>

  1.4 [Objetos](#_page5_x72.00_y72.00) <br>
    [Objetos de putos](#_page5_x72.00_y152.15) <br>
    [Heavy Machinegun](#_page5_x72.00_y245.88) <br>
    [Monedas](#_page5_x72.00_y356.86) <br>
    [Obstáculos](#_page5_x72.00_y450.58) <br>

[**Arquitectura](#_page6_x72.00_y72.00) <br>

   2.1 [Estructura de ficheros](#_page6_x72.00_y110.94) <br>
   2.2 [Arquitectura de clase](#_page6_x72.00_y378.35) <br>

[**Equipo de Trabajo](#_page8_x72.00_y72.00) <br>
[Fuentes de recursos](#_page9_x72.00_y72.00) <br>

**1.El juego**

Creación de un nivel propio del Metal Slug mediante recursos originales del Juego.

Para el diseño del juego, analizamos diferentes juegos de la saga y buscamos recursos de estos para ser lo más parecido a la saga, adaptándolo al sistemas de Quintus.

1. **Objetivo del Juego**

En el juego somos el soldado Rossi y debemos ir avanzando por el mapa sin ser eliminados mientras derrotamos enemigos y recolectamos objetos que nos darán puntos o nos ayudarán en la partida.

Para poder ganar, debemos llegar al final del mapa donde encontraremos al jefe final, el general del equipo enemigo al que debemos derrotar.

La partida se pierde una vez que Rossi se queda sin vidas y no podamos reiniciar la partida desde la última muerte gracias a una moneda.

Como objetivo extra, sería el lograr finalizar el juego con el máximo número de puntos posibles sin que nos quiten vidas.

2. **Mecánicas**

Durante la partida, podremos desplazarnos por el mapa derrotando enemigos y avanzando entre las diferentes plataformas, encontrándonos con diferentes obstáculos que podemos sortear o destruir.

También encontraremos algunos prisioneros que, al liberarlos, nos darán objetos que incrementarán nuestra puntuación o nos darán mejor equipamiento como la “Heavy Machinegun”.

Durante el juego podremos recolectar las monedas que encontraremos por el mapa y que usaremos para que, en caso de quedarnos sin vidas, volver a aparecer en el mismo sitio en el que hemos muerto, con el inconveniente de que nuestros puntos se reiniciarán.

3. **Personajes**

Marco Rossi

El personaje principal que controlaremos y que nos permitirá desplazarnos horizontalmente, saltar entre las plataformas y disparar.

Al tener sus Sprites separados, separamos las animaciones en animación de Piernas y animación del Torso.

En las animaciones de las piernas tenemos la animación en movimiento, el salto y al estar quieto.

Las animaciones del torso tienen una al estar quieto y otra al estar disparando. Al poder tener varias armas, se tienen dos animaciones de este tipo por cada arma.

También cuenta con una animación de muerte al quedarse sin vidas que, al contrario que las otras animaciones, esta es la única en la que las piernas y el torso están juntos.

Enemigos

Los enemigos que encontraremos en el mapa pueden estar en movimiento o quietos, pero en el momento en el que nos detecten, nos atacarán de diferentes formas.

Estos personajes también cuentan con una animación de muerte que se ejecutará al ser disparado por Rossi.

SOLDIER

Ese enemigo no disparará a una distancia media, con una pistola de baja cadencia, además si Rossi se encuentra cerca, le atacará con un golpe.

RIFLE

Tiene las mismas acciones que el Soldier, pero su velocidad de ataque es más reducida pero golpea hace más daño. También puede atacarnos si estamos cerca.

SHIELD

Este enemigo se irá desplazando por el mapa con su escudo. A diferencia de sus compañeros, este enemigo no disparará ni cambiará su dirección al detectarse lejos, pero si estamos cerca nos atacará con su espada.

Además, su escudo le protege de las balas, por lo que aunque le dispares, continuará su patrulla hasta detectar a Rossi o le disparas a la espalda.

HELICÓPTERO

El único enemigo volador implementado, aparecerá para ir lanzandonos bombas. Para eliminarlo, debemos usar el disparo vertical para acabar con él.

ALLEN

El jefe final que aparecerá al final del juego y al que al derrotarlo ganaremos el juego.

Este enemigo tiene más vida que el resto de enemigos y al disparar, su arma lanza 3 balas al mismo tiempo, por lo que es más complejo de esquivar.

Prisionero

Este personaje aparecerá encadenado en alguna zona del mapa. Si lo liberamos y chocamos con él, soltará alguno de los objetos que tiene disponibles y procederá a desaparecer del mapa.

4. **Objetos**

Hay diferentes tipos de objetos que podemos encontrar en el mapa o que por el contrario nos lo puede entregar el Prisionero una vez liberado.

Objetos de putos

Este es uno de los objetos que obtendremos del Prisionero y aparecerán como comida. La función de estos objetos será incrementar el número de puntos que tenemos.

Heavy Machinegun

Este arma nos la dará también el Prisionero. Al cogerlo, cambiará el torso de Rossi para que aparezca con su nueva arma. Este arma tiene un número limitado de armas y dispara más rápido. Una vez que te quedes sin balas volverás a la pistola de munición infinita.

Monedas

Las monedas las podremos ir encontrando por el mapa, nos darán puntos y las podremos utilizar en caso de muerte para resucitar.

Obstáculos

Son estructuras que encontraremos en el mapa. Estos elementos son sorteables, pero también con la posibilidad de ser destruidos, siendo los furgones spawn de los enemigos.

**2.Arquitectura**

1. **Estructura de ficheros**

La organización de los ficheros se organizan en diferentes directorios:

- **index.html**: Se encuentra en el directorio raíz. En él cargamos los recursos Js y las librerías que vamos a utilizar para la implementación del juego.
- **lib**: En este directorio almacenamos las librerías de Quintus
- **data**: Sirve como almacén de los recursos JSON que estructuran los Sprites y el mapa tmx.
- **src**: Directorio donde se encuentran  los Js con las clases de cada componente.
- **audio**: Almacén de los sonidos y música del juego.
- **imágenes**: Contiene todas las imágenes y hojas de Sprites que se utilizarán en el juego
2. **Arquitectura de clase**

El funcionamiento del Juego comienza en game.js, donde se inicializa Quintus para luego poder cargar los Sprites, el nivel del juego, las diferentes pantallas de transición y el HUD del juego. Durante la ejecución del juego, irá generando los diferentes componentes del juego.

El componente Enemies.js contiene las clases relacionadas con el enemigo. La clase defaultEnemy es la clase padre de la que extienden los diferentes enemigos que hay en el juego que contiene la función de daño a los enemigos. De ella extienden las clases de shieldSoldier, trueRifleSoldier, rifleSoldier y allenSoldier.

Cada uno de estos componentes, a parte de sus animaciones y su función extendida, tiene funciones para el movimiento, el disparo, y la muerte.

El shieldSoldier, a diferencia del resto de componentes, no cuenta con el aiBounce ya que al disparar al escudo provocaba que girase y resultase más fácil de matar, por lo que implementamos las colisiones y cambios de direcciones sin el uso de esas funciones de quintus\_2d.

En este mismo archivo, vemos las diferentes balas que tienen los enemigos normales y las del jefe final, que cuentan con diferentes Sprites.

El componente Allies.js contiene las animaciones del prisionero junto con su comportamiento y los sprites de los diferentes objetos que puede soltar. En prisionero.js, se encuentra la interacción que puede tener el personaje con el prisionero.

A su vez, en objects.js también se encuentra la interacción del personaje con los objetos.

La clase Coins contiene tanto la animación de la moneda como la interacción que tiene el personaje con estas. Cada vez que se consiga una se incrementará el número de monedas en el estado del juego.

Rossi, a diferencia del resto de componentes, está formado por dos clases, la clase perteneciente a las piernas, que es de la altura total del personaje y es el que lleva las colisiones con el entorno, y por ello, la muerte del personaje, y las animaciones de las piernas o de cuerpo entero; la clase del torso se sitúa encima de las piernas y lleva la animación del torso de Rossi.

Al igual que el enemigo, cuenta con una clase que define la diferente munición con la que cuenta, que serían las balas de la pistola y las de la Heavy Machinegun.

**3.Equipo de Trabajo**

En primer lugar, nos reunimos para analizar le juego y ver los sistemas que podíamos implementar y adaptar a Quintus. Con ello, se generó una lista de mecánicas y escenas a implementar junto con los recursos necesarios que se necesitarán.

Procedimos a la búsqueda de recursos para montar el mapa y los personajes, pero nos encontramos con el dilema de que las hojas de Sprites no estaban adaptadas al formato de Quintus y tenían colores de fondo que había qie eliminar, por lo que decidimos dividir el equipo en dos:

- Equipo de creación de hojas de Sprites: Formado por Álvaro Corrochano López y Alejandro Ruiz Martín,  el equipo se encargó de ir recortando cada Frame de las animaciones y pegandolas en una hoja nueva de Sprites que seguía unas dimensiones concretas definidas por una rejilla y con un fondo transparente. Una vez terminadas las hojas, el equipo pasó a ayudar al equipo de desarrollo para terminar de programar mecánicas y realizar la presentación del Juego.
- Equipo de desarrollo: Formado por Carlos Jiménez Álvarez y Pablo Álvarez García, el equipo utilizaba Sprites y animaciones de prácticas anteriores para poder implementar las diferentes funciones y escenas a desarrollar mientras se generaban las hojas de Sprites. También se encargaron de la creación del mapa del juego mediante Tiled y la grabación de la DEMO.

Al estar bien repartido el trabajo, la carga de cada integrante del equipo es la misma:

- Pablo Álvarez García: 25%
- Álvaro Corrochano López: 25%
- Carlos Jiménez Álvarez: 25%
- Alejandro Ruiz Martín: 25%

**4.Fuentes de recursos**

- Audios, sonidos y voces del Juego: zedge.net <https://www.zedge.net/find/ringtones/metal%20slug>
- Sprites originales: https://www.spriters-resource.com/ <https://www.spriters-resource.com/neo_geo_ngcd/ms/>
- Música del juego: downloads.khinsider.com [https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soun dtrack](https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soundtrack)
