[wikipedia]: https://es.wikipedia.org/wiki/Metal_Slug

# **PRÁCTICA FINAL** <br> DESARROLLO DE VIDEOJUEGOS MEDIANTE TECNOLOGÍAS WEB <br> CURSO 2020/21 <br> METAL SLUG

<img src=https://upload.wikimedia.org/wikipedia/commons/a/ac/UniComplutense.png height=250>  <img src=https://image.ibb.co/cJvCrT/metalslugsupervehicle001neogeologo.gif height=250>


### Miembros:

<ul>
  <li>Pablo Álvaro García</li> 
  <li>Álvaro Corrochano López</li>
  <li>Carlos Jiménez Álvarez</li>
  <li>Alejandro Ruiz Martín</li>
</ul>

Juego basado en [Metal Slug][wikipedia], videojuego creado por SNK. 
Los sprites, música y sonidos de juego son propiedad de SNK.

<br><br><br>

## **CONTROLES**

<ul>
  <li>Flecha arriba: Saltar.</li>
  <li>Flecha derecha: Moverse a la derecha.</li>
  <li>Flecha izquierda: Moverse a la izquierda.</li>
  <li>Espacio/Z: Disparar.</li>
  <li>S: Disparar hacia arriba.</li>
</ul>
  
<br><br><br>
  
## **ÍNDICE**

### [1. El juego](#id1)

  #### [1.1 Objetivo del Juego](#id2)
  #### [1.2 Mecánicas](#id3)
  #### [1.3 Personajes](#id4)
  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Marco Rossi](#id5)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Enemigos](#id6)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Soldado](#id7)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Solado Rifle](#id8)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Soldado Escudo](#id9)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Helicóptero](#id10)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Allen O'Neill](#id11)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Prisionero](#id12)
  
  #### [1.4 Objetos](#id13)
  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Objetos de putos](#id14)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Heavy Machinegun](#id15)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Monedas](#id16)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Obstáculos](#id17)

  #### [1.5 Sonidos](#id23)

### [2. Arquitectura](#id18)
 
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2.1 Estructura de ficheros](#id19)<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2.2 Arquitectura de clase](#id20)<br>
 
### [3. Equipo de Trabajo](#id21)
### [4. Fuentes de recursos](#id22)

<br><br><br>

<div id='id1' />

## **1. El juego**

Creación de un nivel propio del Metal Slug mediante recursos originales del Juego.

Para el diseño del juego, analizamos diferentes juegos de la saga y buscamos recursos de estos para ser lo más parecido a la saga, adaptándolo al sistemas de Quintus.

<div id='id2' />

### **1.1 Objetivo del Juego**

En el juego somos el soldado Rossi y debemos ir avanzando por el mapa sin ser eliminados mientras derrotamos enemigos y recolectamos objetos que nos darán puntos o nos ayudarán en la partida.

Para poder ganar, debemos llegar al final del mapa donde encontraremos al jefe final, el general del equipo enemigo al que debemos derrotar.

La partida se pierde una vez que Rossi se queda sin vidas y no podamos reiniciar la partida desde la última muerte gracias a una moneda.

Como objetivo extra, sería el lograr finalizar el juego con el máximo número de puntos posibles sin que nos quiten vidas.

<div id='id3' />

### **1.2 Mecánicas**

Durante la partida, podremos desplazarnos por el mapa derrotando enemigos y avanzando entre las diferentes plataformas, encontrándonos con diferentes obstáculos que podemos sortear o destruir.

También encontraremos algunos prisioneros que, al liberarlos, nos darán objetos que incrementarán nuestra puntuación o nos darán mejor equipamiento como la “Heavy Machinegun”.

Durante el juego podremos recolectar las monedas que encontraremos por el mapa y que usaremos para que, en caso de quedarnos sin vidas, volver a aparecer en el mismo sitio en el que hemos muerto, con el inconveniente de que nuestros puntos se reiniciarán.

<div id='id4' />

### **1.3. Personajes**

<div id='id5' />

#### Marco Rossi

El personaje principal que controlaremos y que nos permitirá desplazarnos horizontalmente, saltar entre las plataformas y disparar.

Al tener sus Sprites separados, separamos las animaciones en animación de Piernas y animación del Torso.

En las animaciones de las piernas tenemos la animación en movimiento, el salto y al estar quieto.

Las animaciones del torso tienen una al estar quieto y otra al estar disparando. Al poder tener varias armas, se tienen dos animaciones de este tipo por cada arma.

También cuenta con una animación de muerte al quedarse sin vidas que, al contrario que las otras animaciones, esta es la única en la que las piernas y el torso están juntos.

<div id='id6' />

#### Enemigos

Los enemigos que encontraremos en el mapa pueden estar en movimiento o quietos, pero en el momento en el que nos detecten, nos atacarán de diferentes formas.

Estos personajes también cuentan con una animación de muerte que se ejecutará al ser disparado por Rossi.

<div id='id7' />

##### Soldado

Ese enemigo no disparará a una distancia media, con una pistola de baja cadencia, además si Rossi se encuentra cerca, le atacará con un golpe.

<div id='id8' />

##### Soldado Rifle

Tiene las mismas acciones que el Soldier, pero su velocidad de ataque es más reducida pero golpea hace más daño. También puede atacarnos si estamos cerca.

<div id='id9' />

##### Soldado Escudo

Este enemigo se irá desplazando por el mapa con su escudo. A diferencia de sus compañeros, este enemigo no disparará ni cambiará su dirección al detectarse lejos, pero si estamos cerca nos atacará con su espada.

Además, su escudo le protege de las balas, por lo que aunque le dispares, continuará su patrulla hasta detectar a Rossi o le disparas a la espalda.

<div id='id10' />

##### Helicóptero

El único enemigo volador implementado, aparecerá para ir disparando balas. Para eliminarlo, debemos usar el disparo vertical.

<div id='id11' />

##### Allen O'Neill

El jefe final que aparecerá al final del juego y al que al derrotarlo ganaremos el juego.

Este enemigo tiene más vida que el resto de enemigos y al disparar, su arma lanza 3 balas al mismo tiempo 3 veces seguidas, por lo que es más complejo de esquivar. Una vez hace esto, recarga el arma, momento que se puede aprovechar para dispararle. También dice frases o se ríe aleatoriamente (pudiendo ser disparado en este momento también).

<div id='id12' />

#### Prisionero

Este personaje aparecerá encadenado en alguna zona del mapa. Si lo liberamos y chocamos con él, soltará alguno de los objetos que tiene disponibles y procederá a desaparecer del mapa.

<div id='id13' />

### **1.4 Objetos**

Hay diferentes tipos de objetos que podemos encontrar en el mapa o que por el contrario nos lo puede entregar el Prisionero una vez liberado.

<div id='id14' />

#### Objetos de puntos

Este es uno de los objetos que obtendremos del Prisionero y aparecerán como comida. La función de estos objetos será incrementar el número de puntos que tenemos.

<div id='id15' />

#### Heavy Machinegun

Este arma nos la dará también el Prisionero. Al cogerlo, cambiará el torso de Rossi para que aparezca con su nueva arma. Este arma tiene un número limitado de armas y dispara más rápido. Una vez que te quedes sin balas volverás a la pistola de munición infinita.

<div id='id16' />

#### Monedas

Las monedas las podremos ir encontrando por el mapa, nos darán puntos y las podremos utilizar en caso de muerte para resucitar.

<div id='id17' />

#### Obstáculos

Son estructuras que encontraremos en el mapa. Estos elementos son sorteables, pero también con la posibilidad de ser destruidos, soltando objetos de puntos o heavy machinegun (igual que el prisionero).

<div id='id23' />

### **1.5 Sonidos**

En el juego hay diferentes sonidos:

Música de fondo: 
<ul>
  <li>main_theme.mp3: Música de fondo del mapa principal. </li>
  <li>boos_fight.mp3: Música de fondo de la batalla final contra Allen O'Neill.</li>
  <li>game_over.mp3: Música de fondo al perder el juego.</li>
  <li>mission_complete.mp3: Música de fondo al ganar el juego.</li>
</ul>

Sonidos de Marco Rossi:
<ul>
  <li>Marco_Rossi_Death.mp3: Sonido de Marco al morir.</li>
  <li>rossi_shot.mp3: Sonido de disparo de la pistola.</li>
  <li>rossi_shot_HM.mp3: Sonido de disparo de la Heavy Machinegun.</li>
</ul>
  
Sonidos de Allen O'Neill:
<ul>
  <li>allen_come_on.mp3: Sonido de una de las burlas de Allen O'Neill.</li>
  <li>allen_go_to.mp3: Sonido de otra de las burlas de Allen O'Neill.</li>
  <li>allen_laugh.mp3: Sonido de risa de Allen O'Neill.</li>
  <li>allen_reload.mp3: Sonido de recarga de Allen O'Neill.</li>
  <li>allen_shot.mp3: Sonido de disparo de Allen O'Neill.</li>
  <li>allen_die.mp3: Sonido de muerte a Allen O'Neill.</li>
</ul>
  
Otros personajes y objetos:
<ul>
  <li>metal_slug_coin.mp3: Sonido al recoger una moneda.</li>
  <li>metal_slug_HM.mp3: Sonido al recoger la Heavy Machinegun.</li>
  <li>metal_slug_ok.mp3: Sonido al recoger objetos de puntos.</li>
  <li>explosion.mp3: Sonido producido cuando hay una explosión (coches, helicópteros...)</li>
  <li>rebel_scream.mp3: Sonido de los soldados al morir.</li>
  <li>prisionero.mp3: Sonido de los prisioneros al entregarte un objeto.</li>
</ul>

<div id='id18' />

## **2. Arquitectura**

<div id='id19' />

### **2.1 Estructura de ficheros**

La organización de los ficheros se organizan en diferentes directorios:

<ul>
<li> index.html: Se encuentra en el directorio raíz. En él cargamos los recursos Js y las librerías que vamos a utilizar para la implementación del juego.</li>
<li> lib: En este directorio almacenamos las librerías de Quintus.</li>
<li> data: Sirve como almacén de los recursos JSON que estructuran los Sprites y el mapa tmx.</li>
<li> src: Directorio donde se encuentran  los Js con las clases de cada componente.</li>
<li> audio: Almacén de los sonidos y música del juego.</li>
<li> imágenes: Contiene todas las imágenes y hojas de Sprites que se utilizarán en el juego</li>
</ul>

<div id='id20' />

### **2.2 Arquitectura de clase**

El funcionamiento del Juego comienza en game.js, donde se inicializa Quintus para luego poder cargar los Sprites, el nivel del juego, las diferentes pantallas de transición y el HUD del juego. Durante la ejecución del juego, irá generando los diferentes componentes del juego.

El componente Enemies.js contiene las clases relacionadas con el enemigo. La clase defaultEnemy es la clase padre de la que extienden los diferentes enemigos que hay en el juego que contiene la función de daño a los enemigos. De ella extienden las clases de shieldSoldier, trueRifleSoldier, rifleSoldier y allenSoldier.

Cada uno de estos componentes, a parte de sus animaciones y su función extendida, tiene funciones para el movimiento, el disparo, y la muerte.

El shieldSoldier, a diferencia del resto de componentes, no cuenta con el aiBounce ya que al disparar al escudo provocaba que girase y resultase más fácil de matar, por lo que implementamos las colisiones y cambios de direcciones sin el uso de esas funciones de quintus\_2d.

En este mismo archivo, vemos las diferentes balas que tienen los enemigos normales y las del jefe final, que cuentan con diferentes Sprites.

El componente Spawner.js contiene las clases relacionadas con un "objeto invisible" (localizados en un puntos del mapa como puertas etc.) de donde spawnean enemigos, especificándose la cantidad que salen, los tipos de enemigos, cada cuanto tiempo salen y el rango de activación del mismo.

El componente Allies.js contiene las animaciones del prisionero junto con su comportamiento y los sprites de los diferentes objetos que puede soltar. En prisionero.js, se encuentra la interacción que puede tener el personaje con el prisionero.

A su vez, en objects.js también se encuentra la interacción del personaje con los objetos.

La clase Coins contiene tanto la animación de la moneda como la interacción que tiene el personaje con estas. Cada vez que se consiga una se incrementará el número de monedas en el estado del juego.

Rossi, a diferencia del resto de componentes, está formado por dos clases, la clase perteneciente a las piernas, que es de la altura total del personaje y es el que lleva las colisiones con el entorno, y por ello, la muerte del personaje, y las animaciones de las piernas o de cuerpo entero; la clase del torso se sitúa encima de las piernas y lleva la animación del torso de Rossi.

Al igual que el enemigo, cuenta con una clase que define la diferente munición con la que cuenta, que serían las balas de la pistola y las de la Heavy Machinegun.

<div id='id21' />

## **3. Equipo de Trabajo**

En primer lugar, nos reunimos para analizar le juego y ver los sistemas que podíamos implementar y adaptar a Quintus. Con ello, se generó una lista de mecánicas y escenas a implementar junto con los recursos necesarios que se necesitarán.

Procedimos a la búsqueda de recursos para montar el mapa y los personajes, pero nos encontramos con el dilema de que las hojas de Sprites no estaban adaptadas al formato de Quintus y tenían colores de fondo que había qie eliminar, por lo que decidimos dividir el equipo en dos:

<ul>
<li>Equipo de creación de hojas de Sprites: Formado por Álvaro Corrochano López y Alejandro Ruiz Martín,  el equipo se encargó de ir recortando cada Frame de las animaciones y pegandolas en una hoja nueva de Sprites que seguía unas dimensiones concretas definidas por una rejilla y con un fondo transparente. Una vez terminadas las hojas, el equipo pasó a ayudar al equipo de desarrollo para terminar de programar mecánicas y realizar la presentación del Juego.</li>
<li>Equipo de desarrollo: Formado por Carlos Jiménez Álvarez y Pablo Álvarez García, el equipo utilizaba Sprites y animaciones de prácticas anteriores para poder implementar las diferentes funciones y escenas a desarrollar mientras se generaban las hojas de Sprites. También se encargaron de la creación del mapa del juego mediante Tiled y la grabación de la DEMO.</li>
</ul>

Al estar bien repartido el trabajo, la carga de cada integrante del equipo es la misma:

<ul>
<li>Pablo Álvarez García: 25%</li>
<li>Álvaro Corrochano López: 25%</li>
<li>Carlos Jiménez Álvarez: 25%</li>
<li>Alejandro Ruiz Martín: 25%</li>
</ul>
  
<div id='id22' />
  
## **4. Fuentes de recursos**

<ul>
<li>Audios, sonidos y voces del Juego: https://www.zedge.net/find/ringtones/metal%20slug <https://www.zedge.net/find/ringtones/metal%20slug></li>
<li>Más audios, sonidos y voces del juego: https://www.youtube.com/user/Lyndione/videos <https://www.youtube.com/user/Lyndione/videos></li>
<li>Sprites originales: https://www.spriters-resource.com/neo_geo_ngcd/ms/ <https://www.spriters-resource.com/neo_geo_ngcd/ms/></li>
<li>Música del juego: https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soundtrack <https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soundtrack></li>
</ul>
  
  
