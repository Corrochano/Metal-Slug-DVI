// Práctica 1 DVI - Álvaro Corrochano López

/**
 * Clase MemoryGame que representa el juego de memoria.
 * @param {*} gs MyCustomGraphicServer
 */
var MemoryGame = function(gs){
    this.myCustomGraphicServer = gs; // Graphic Server
    this.cartas = new Array(); // Cartas en el tablero
    this.mensaje = "Juego Memoria Spectrum"; // Mensaje a sacar por el canvas
    this.pairs = 0;

    this.click = -1;

    /**
    * Método de MemoryGame que inicializa el juego.
    */
    this.initGame = function(){ // Función InitGame
        this.cartas[0] = new MemoryGameCard("perico"); // Creo las cartas
        this.cartas[1] = new MemoryGameCard("perico");
        this.cartas[2] = new MemoryGameCard("mortadelo");
        this.cartas[3] = new MemoryGameCard("mortadelo");
        this.cartas[4] = new MemoryGameCard("fernandomartin");
        this.cartas[5] = new MemoryGameCard("fernandomartin");
        this.cartas[6] = new MemoryGameCard("sabotaje");
        this.cartas[7] = new MemoryGameCard("sabotaje");
        this.cartas[8] = new MemoryGameCard("phantomas");
        this.cartas[9] = new MemoryGameCard("phantomas");
        this.cartas[10] = new MemoryGameCard("poogaboo");
        this.cartas[11] = new MemoryGameCard("poogaboo");
        this.cartas[12] = new MemoryGameCard("sevilla");
        this.cartas[13] = new MemoryGameCard("sevilla");
        this.cartas[14] = new MemoryGameCard("abadia");
        this.cartas[15] = new MemoryGameCard("abadia");

        this.cartas.sort(() => .5 - Math.random()); // Barajo
        
        this.loop(); // Inicio el bucle
    }

    /**
     * Función para dibujar el juego
     */
    this.draw = function(){
        this.myCustomGraphicServer.drawMessage(this.mensaje); // Imprimimos el mensaje

        for (var i = 0; i < 16; i++) { // Imprimimos las cartas
            this.cartas[i].draw(this.myCustomGraphicServer,i);
        }
    }

    /**
     * Función para tener el un bucle de refresco a 60 fps
     */
    this.loop = function(){
        var dat = this; // Me guardo a mí mismo para no perder la referencia
        setInterval(function(){dat.draw()}, 16); // Dibujo el juego cada 16ms (60 fps)
    }

    /**
     * Método para voltear cartas y, en el caso de haberse volteado dos, comprobar si se ha encontrado la pareja.
     * @param {*} cardId Posición de la carta seleccionada {0...15}
     */
    this.onClick = function(cardId){
        if(this.click == -1){ // Si no hay otra carta seleccionada
            this.click = cardId;
            this.cartas[cardId].flip();
        }
        else{ // Si sí la hay
            this.cartas[cardId].flip(); 
            if(this.cartas[cardId].compareTo(this.click)){ // Si se ha encontrado pareja

            }
            else{ // Si no se ha encontrado
                this.mensaje = "Inténtalo de nuevo";
                /*setTimeout(function(){ 
                    this.cartas[cardId].flip();
                    this.cartas[this.click].flip();
                }, 3000);*/
                this.cartas[cardId].flip();
                this.cartas[this.click].flip();
            }
            this.click = -1;
        }
    }

}

/**
 * Clase MemoryGameCard, que representa a una carta.
 * @param {string} sprite String con el nombre del sprite al que representa
 */
var MemoryGameCard = function(sprite){
    this.nombre = sprite;
    this.estado = 0; // 0 = boca abajo, 1 = boca arriba, 2 = encontrada

    /**
     * Método para dar la vuelta a las cartas
     */
    this.flip = function(){
        if(this.estado == 1) this.estado = 0;
        else if(this.estado == 0) this.estado = 1;
    }

    /**
     * Método para marcar una carta como encontrada
     */
    this.found = function(){
        this.estado = 2;
    }

    /**
     * Compara con la carta pasada por parámetro para identificar si son iguales
     * @param {MemoryGameCard} otherCard Carta con la que se compara
     */
    this.compareTo = function(otherCard){
        return (this.nombre == otherCard.nombre);
    }

    /**
     * Función para dibujar la carta dependiendo del estado en el que se encuentre
     * @param {*} gs GraphicServer para dibujar la carta
     * @param {*} pos Posición de la carta en el tablero {0...15}
     */
    this.draw = function(gs, pos){
        if (this.estado != 0){ // Si está boca arriba/descubierta
            gs.draw(this.nombre, pos);
        }
        else{ // Si está boca abajo
            gs.draw("back", pos);
        } 
    }

}