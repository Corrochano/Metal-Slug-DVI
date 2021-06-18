[wikipedia]: https://es.wikipedia.org/wiki/Metal_Slug
[snk]: https://www.snk-corp.co.jp/us/
[video]: https://youtu.be/ueu1LQtrQOI

# **PRÁCTICA FINAL** <br> DESARROLLO DE VIDEOJUEGOS MEDIANTE TECNOLOGÍAS WEB <br> CURSO 2020/21 <br> METAL SLUG

<img src=https://upload.wikimedia.org/wikipedia/commons/a/ac/UniComplutense.png height=250>  <img src=https://image.ibb.co/cJvCrT/metalslugsupervehicle001neogeologo.gif height=250>

[Enlace al juego]
<br>
[Video de Gameplay en Youtube][video]

### Miembros:

<ul>
  <li>Pablo Álvaro García</li> 
  <li>Álvaro Corrochano López</li>
  <li>Carlos Jiménez Álvarez</li>
  <li>Alejandro Ruiz Martín</li>
</ul>

Juego basado en [Metal Slug][wikipedia], videojuego creado por [SNK][snk].<br>
Los sprites, música y sonidos de juego son propiedad de [SNK][snk].

<br><br><br>

## **CONTROLES**

<ul>
  <li>Flecha arriba: Saltar.</li>
  <li>Flecha derecha: Moverse a la derecha.</li>
  <li>Flecha izquierda: Moverse a la izquierda.</li>
  <li>Espacio / Z / X: Disparar.</li>
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

Para el diseño del juego, analizamos diferentes juegos de la saga y buscamos recursos de estos para ser lo más parecido a la saga, adaptándolo al sistema de Quintus.

<div id='id2' />

### **1.1 Objetivo del Juego**

En el juego somos el soldado Rossi y debemos ir avanzando por el mapa sin ser eliminados mientras derrotamos enemigos y recolectamos objetos que nos darán puntos o nos ayudarán en la partida.

Para poder ganar, debemos llegar a la torre del final del mapa, siendo transportados a otro mapa donde encontraremos al jefe final, el general del equipo enemigo al que debemos derrotar.

La partida se pierde una vez que Rossi se queda sin vidas y no podamos reiniciar la partida desde la última muerte gracias a una moneda.

Como objetivo extra, sería el lograr finalizar el juego con el máximo número de puntos posibles sin que nos quiten vidas.

<div id='id3' />

### **1.2 Mecánicas**

Durante la partida, podremos desplazarnos por el mapa derrotando enemigos y avanzando entre las diferentes plataformas, encontrándonos con diferentes obstáculos que podemos sortear o destruir (algunos no pueden ser saltados y deben ser destruidos obligatoriamente). Estos obstáculos al ser destruidos sueltan objetos que nos suman puntos o nos pueden otorgar la "Heavy Machinegun". Los enemigos en el mapa en su mayoría aparecen mediante spawners situados en diferentes partes del mapa.
El mapa se divide en dos mapas, una donde ocurre la mayor parte del juego, que es tal y como se ha descrito arriba y otra zona más pequeña donde ocurre la batalla contra el jefe final, Allen O'Neill. Aquí nos será otorgada una Heavy Machinegun y nos encontraremos un obstáculo para poder cubrirnos del ataque enemigo y con el enemigo, Allen O'Neill, al que tendremos que matar para ganar el juego.

También encontraremos algunos prisioneros que, una vez liberados al dispararlos, empezarán a andar por el mapa y nos darán objetos al chocar con ellos que incrementarán nuestra puntuación o nos darán mejor equipamiento, la “Heavy Machinegun” (igual que los obstáculos). Tras darnos el objeto, saldrán corriendo hasta chocar con algo, desapareciendo tras esto.

Durante el juego podremos recolectar las monedas que encontraremos por el mapa y que usaremos para que, en caso de quedarnos sin vidas, volver a aparecer en el mismo sitio en el que hemos muerto, con el inconveniente de que nuestros puntos y la cantidad de prisioneros rescatados se reiniciarán. El juego comienza con 3 vidas y cada moneda otroga 3 vidas más.

Por último, nos encontramos con el tiempo, el cual baja 1 cada 4 segundos (igual que en el juego original). El tiempo se resetea al morir y también al llegar a la batalla contra Allen O'Neill. Si el tiempo llega a 0, Marco perderá una vida (será igual que si lo mata un enemigo).

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

Ese enemigo nos disparará a una distancia media, con una pistola de baja cadencia, además si Rossi se encuentra cerca, le atacará con un cuchillo.

<div id='id8' />

##### Soldado con Rifle

Tiene las mismas acciones que el Soldado, pero su velocidad de ataque es mayor. También puede atacarnos si estamos cerca con un golpe de culata.

<div id='id9' />

##### Soldado con Escudo

Este enemigo se irá desplazando por el mapa con su escudo. A diferencia de sus compañeros, este enemigo no disparará ni cambiará su dirección al detectarse lejos, pero si estamos cerca nos atacará con su espada.

Además, su escudo le protege de las balas, por lo que aunque le dispares, continuará su patrulla hasta detectar a Rossi o le disparas a la espalda.

<div id='id10' />

##### Helicóptero

El único enemigo volador implementado, aparecerá para ir disparando balas. Para eliminarlo, debemos usar el disparo vertical.

<div id='id11' />

##### Allen O'Neill

El jefe final que aparecerá al final del juego y al que al derrotarlo ganaremos el juego.

Este enemigo tiene más vida que el resto de enemigos y al disparar, su arma lanza 3 balas, una tras otra, 3 veces seguidas, por lo que es más complejo de esquivar. Una vez hace esto, recarga el arma, momento que se puede aprovechar para dispararle. También dice frases o se ríe aleatoriamente (pudiendo ser disparado en este momento también).

<div id='id12' />

#### Prisionero

Este personaje aparecerá atado en alguna zona del mapa. Si lo liberamos y chocamos con él, soltará alguno de los objetos que tiene disponibles y procederá a desaparecer del mapa.

<div id='id13' />

### **1.4 Objetos**

Hay diferentes tipos de objetos que podemos encontrar en el mapa, como recompensa por liberar a Prisioneros, o al destruir Obstáculos.

<div id='id14' />

#### Objetos de puntos

Este es uno de los objetos que obtendremos del Prisionero o destruyendo Obstáculos y aparecerán como comida. La función de estos objetos será incrementar el número de puntos que tenemos.

<div id='id15' />

#### Heavy Machinegun

Este arma nos la dará también el Prisionero o los Obstáculos. Al cogerlo, cambiará el torso de Rossi para que aparezca con su nueva arma. Este arma tiene un número limitado de balas y dispara más rápido. Una vez que te quedes sin balas volverás a la pistola de munición infinita.

<div id='id16' />

#### Monedas

Las monedas las podremos ir encontrando por el mapa, nos darán puntos y las podremos utilizar en caso de muerte para resucitar.

<div id='id17' />

#### Obstáculos

Son estructuras que encontraremos en el mapa. Alguno de estos elementos son sorteables, pero también pueden ser destruidos, soltando objetos de puntos o la "Heavy Machinegun" (igual que el Prisionero).

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

El funcionamiento del Juego comienza en game.js, donde se inicializa Quintus para luego poder cargar los Sprites, el nivel del juego, las diferentes pantallas de transición y el HUD del juego. Durante la ejecución del juego, irá generando los diferentes elementos del juego.

El fichero Enemies.js contiene las clases relacionadas con los enemigos. 

El componente defaultEnemy contiene la lógica del daño que reciben los enemigos, por lo que todos los enemigos deben usar este componente.

El componente meleeEnemy contiene la lógica de ataque cuerpo a cuerpo de los enemigos que usen el componente, mientras que el componente shooterEnemy contiene la lógica de ataque a distancia de los enemigos que usen el componente.

El componente enemyBehaviourController actúa como una máquina de estados controlando los estados de cada enemigo según los componentes que tiene.

Cada clase de cada enemigo, a parte de sus animaciones y su funcionalidad extendida, tiene funciones para el movimiento, el disparo, y la muerte.

El ShieldSoldier, a diferencia del resto de enemigos, no cuenta con el componente aiBounce ya que al disparar al escudo provocaba que girase y resultase más fácil de matar, por lo que implementamos las colisiones y cambios de direcciones sin el uso de esas funciones de quintus_2d.

En este mismo fichero, vemos las diferentes balas que tienen los enemigos normales y las del jefe final, que cuentan con diferentes Sprites. Las balas del helicóptero son como las de los enemigos normales pero tienen velocidad en el eje Y en lugar de en el eje X.

El fichero Spawner.js contiene las clases relacionadas con un "objeto invisible" (introducidos en Tiled como un objeto por detrás del mapa colocados en ciertos puntos del mapa) de donde spawnean enemigos, especificándose la cantidad que salen, los tipos de enemigos, cada cuanto tiempo salen y el rango de activación del mismo.

El componente Allies.js contiene las animaciones del Prisionero junto con su comportamiento, los parámetros de los diferentes objetos que puede soltar y las interacciones que puede tener el personaje con el Prisionero.

A su vez, en Objects.js también se encuentra la interacción del personaje con los objetos. Se controla el efecto que tiene cada objeto y su aplicación cuando el personaje choca con ellos (los coge).

El fichero Coins.js contiene tanto la animación de la moneda como la interacción que tiene el personaje con estas. Cada vez que se consiga una se incrementará el número de monedas en el estado del juego.

Rossi, a diferencia del resto de componentes, está formado por dos clases: la clase perteneciente a las piernas, que es de la altura total del personaje y es el que lleva las colisiones con el entorno, y por ello, la muerte del personaje y las animaciones de las piernas o de cuerpo entero; la clase del torso se sitúa encima de las piernas y lleva la animación del torso de Rossi dependiendo del arma que tenga el personaje y de si está o no disparando.

Al igual que el enemigo, cuenta con una clase que define la diferente munición con la que cuenta, que serían las balas de la pistola y las de la Heavy Machinegun.

<div id='id21' />

## **3. Equipo de Trabajo**

En primer lugar, nos reunimos para analizar el juego y ver los sistemas que podíamos implementar y adaptar a Quintus. Con ello, se generó una lista de mecánicas y escenas a implementar junto con los recursos necesarios que se necesitarían.

Procedimos a la búsqueda de recursos para montar el mapa y los personajes, pero nos encontramos con el dilema de que las hojas de Sprites no estaban adaptadas al formato de Quintus y tenían colores de fondo que había que eliminar, por lo que decidimos dividir el equipo en dos:

<ul>
<li>Equipo de creación de hojas de Sprites: Formado por Álvaro Corrochano López y Alejandro Ruiz Martín, el equipo se encargó de ir recortando cada Frame de las animaciones y pegandolas en una hoja nueva de Sprites que seguía unas dimensiones concretas definidas por una rejilla y con un fondo transparente. Una vez terminadas las hojas, el equipo pasó a ayudar al equipo de desarrollo para terminar de programar mecánicas y realizar la presentación del juego.</li>
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
<li>Quintus: https://github.com/cykod/Quintus <https://github.com/cykod/Quintus></li>
<li>Audios, sonidos y voces del Juego: https://www.zedge.net/find/ringtones/metal%20slug <https://www.zedge.net/find/ringtones/metal%20slug></li>
<li>Más audios, sonidos y voces del juego: https://www.youtube.com/user/Lyndione/videos <https://www.youtube.com/user/Lyndione/videos></li>
<li>Sprites originales: https://www.spriters-resource.com/neo_geo_ngcd/ms/ <https://www.spriters-resource.com/neo_geo_ngcd/ms/></li>
<li>Música del juego: https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soundtrack <https://downloads.khinsider.com/game-soundtracks/album/metal-slug-original-soundtrack></li>
</ul>
