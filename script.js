
/*      Variables Globales                   */
/* ------------------------------------------*/



  // Obtiene el tablero de la partida
  const tablero = document.querySelector('.tablero')
  // Obtiene las banderas que faltan
  const banderasRestantes = document.querySelector('#banderas-restantes')
  // Obtiene el resultado
  const resultado = document.querySelector('#resultado')
  // Obtiene la variable el id del selector que se ha pulsado
  const selectores = document.querySelectorAll(".selectores")
  selectores.forEach((selector) => selector.addEventListener("click", (e) => cambiarPartida(e.target.id)))
  // Obtiene la variable tiempo
  const tiempo = document.getElementById("tiempo")
  // Define el tamaño del tablero
  let tamano = 10
  // Define la cantidad de bombas
  let cantidadBomba = 10
  // Define el número de banderas que se han utilizado hasta el momento por defecto es 0
  let banderas = 0
  // Define una lista de cuadrados
  let cuadrados = []
  // Indica si el juego se ha acabado
  let juegoAcabado = false
  // Indica el tiempo que se lleva de juego
  let tiempoJuego 
  let tiempoActivo = false


//Ejecución del tablero al cargar la página web

crearTablero()

function cambiarTamonoTablero() {
  var ancho = tamano*30
  tablero.style.width = `${String(ancho)}px`
  tablero.style.height = `${String(ancho)}px`
}

//Función crea Tablero 
function crearTablero() {

  // Adapta en tamaño del css del tablaro para adaptarlo al numero de
  

  // Indica el número de banderas que faltan por colocar
  banderasRestantes.innerHTML = cantidadBomba
  //Adapta el tamaño del tablero en el css
  cambiarTamonoTablero()

  //Genera un arra con las bombas y las posiciones validas y lo reordena de forma aleatoria
  const bombasArray = Array(cantidadBomba).fill('bomba')
  const vacioArray = Array(tamano*tamano - cantidadBomba).fill('valido')
  const juegoArray = vacioArray.concat(bombasArray)
  const reordenadoArray = juegoArray.sort(() => Math.random() -0.5)

  // Genera el código HTML en función del tipo de cuadrado que se haya obtenido y generas los 
  //eventos para cada cuadrado
  for(let i = 0; i < tamano*tamano; i++) {
    const cuadrado = document.createElement('div')
    cuadrado.setAttribute('id', i)
    cuadrado.classList.add(reordenadoArray[i])
    tablero.appendChild(cuadrado)
    cuadrados.push(cuadrado)

    //click normal
    cuadrado.addEventListener('click', function(e) {
      click(cuadrado)
    })

    //click derecho del ratón
    cuadrado.oncontextmenu = function(e) {
      e.preventDefault()
      añadeBandera(cuadrado)
    }
  }
  

  //Añade los números al html que despues utilizaremos para mostrar cuantas bombas tenemos alrededor
  for (let i = 0; i < cuadrados.length; i++) {
    let total = 0
    const esAristaIzquierda = (i % tamano === 0)
    const esAristaDerecha = (i % tamano === tamano -1)

    // Solo añade el valor en los cuadrados que no son bombas
    if (cuadrados[i].classList.contains('valido')) {
      // Lo comprubeba 
      if (i > 0 && !esAristaIzquierda && cuadrados[i -1].classList.contains('bomba')) total ++
      if (i > tamano-1 && !esAristaDerecha && cuadrados[i +1 -tamano].classList.contains('bomba')) total ++
      if (i >= tamano && cuadrados[i -tamano].classList.contains('bomba')) total ++
      if (i > tamano+1 && !esAristaIzquierda && cuadrados[i -1 -tamano].classList.contains('bomba')) total ++
      if (i < (tamano*tamano)-1 && !esAristaDerecha && cuadrados[i +1].classList.contains('bomba')) total ++
      if (i < (tamano*tamano)-tamano+1  && !esAristaIzquierda && cuadrados[i -1 +tamano].classList.contains('bomba')) total ++
      if (i < (tamano*tamano)-tamano-1 && !esAristaDerecha && cuadrados[i +1 +tamano].classList.contains('bomba')) total ++
      if (i < (tamano*tamano)-tamano && cuadrados[i +tamano].classList.contains('bomba')) total ++
      cuadrados[i].setAttribute('data', total)
    }
  }
}



//Añade las banderas con el botón derecho del raton
function añadeBandera(cuadrado) {
  // Si el juego ya ha acabado sal de la función, evita que se añadan banderas cuando ya ha terminado la partida
  if (juegoAcabado) return
  // Si el cuadrado no ha sido chuequeado previamente y no contiene ninguna bandera, añadela
  if (!cuadrado.classList.contains('chequeado') && (banderas <= cantidadBomba)) {
    if (!cuadrado.classList.contains('bandera') && (banderas < cantidadBomba)) {
      cuadrado.classList.add('bandera')
      cuadrado.innerHTML = ' 🚩'
      banderas ++
      banderasRestantes.innerHTML = cantidadBomba- banderas
      compruebaGanado()
    } 
    //Si no  ha sido chequeado y ya contiene una bandera, simplemente quitar la bandera
    else if (cuadrado.classList.contains('bandera')) {
      cuadrado.classList.remove('bandera')
      cuadrado.innerHTML = ''
      banderas --
      banderasRestantes.innerHTML = cantidadBomba- banderas
    }
  }
}

//Si hacemos click normal
function click(cuadrado) {

  // Función que nos permite activar el timer
  function activaTiempo(){
    tiempoJuego = setInterval(actualizaTiempo, 1000)
    tiempoActivo = true
  }
  
  // obtenemos el id del cuadrado
  let idActual = cuadrado.id
  // Si el tiempo no ha sido activado lo activamos
  if (!tiempoActivo) activaTiempo()
  // Si el juego ya ha terminado nos salimos
  if (juegoAcabado) return
  // Si el cuadrado ha sido chequeado o contiene una bandera nos salimos
  if (cuadrado.classList.contains('chequeado') || cuadrado.classList.contains('bandera')) return
  // Si contiene una bomba simplemente acaba el juego
  if (cuadrado.classList.contains('bomba')) {
    gameOver(cuadrado)
  } 
  // En caso contrario lo descubrimos y colocamos el valor que contiene en el data que sera visible
  else {
    let total = cuadrado.getAttribute('data')
    if (total !=0) {
      cuadrado.classList.add('chequeado')
      if (total == 1) cuadrado.classList.add('uno')
      if (total == 2) cuadrado.classList.add('dos')
      if (total == 3) cuadrado.classList.add('tres')
      if (total == 4) cuadrado.classList.add('cuatro')
      if (total == 5) cuadrado.classList.add('cinco')
      if (total == 6) cuadrado.classList.add('seis')
      if (total == 7) cuadrado.classList.add('siete')
      if (total == 8) cuadrado.classList.add('ocho')
      cuadrado.innerHTML = total
      return
    }
    // Solo llegamos a este caso si el cuadrado es un cuadrado que permite expandirse 
    chequeaCuadrado(cuadrado, idActual)
  }
  cuadrado.classList.add('chequeado')
}


//cchequeamos los cuadrados vecinos de un cuadrado que permite expansión. Este método funciona 
// ya que contamos con que los cuadrados vecinos de un cuadrado en expansión no contienen bombas
function chequeaCuadrado(cuadrado, idActual) {
  // Determia si el cuadrado esta situado en los limites de la derecha y de la izquierda
  const esAristaIzquierda = (idActual % tamano === 0)
  const esAristaDerecha = (idActual % tamano === tamano -1)

  // Simplemente clikeamos sobre los 8 cuadrados vecinos en caso de que exista cuadrado
  setTimeout(() => {
    if (idActual > 0 && !esAristaIzquierda) {
      const nuevoId = cuadrados[parseInt(idActual) -1].id
      //const nuevoId = parseInt(idActual) - 1   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual > tamano-1 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1 -tamano].id
      //const nuevoId = parseInt(idActual) +1 -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual >= tamano) {
      const nuevoId = cuadrados[parseInt(idActual -tamano)].id
      //const nuevoId = parseInt(idActual) -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual > tamano+1 && !esAristaIzquierda) {
      const nuevoId = cuadrados[parseInt(idActual) -1 -tamano].id
      //const nuevoId = parseInt(idActual) -1 -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < (tamano*tamano)-1 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1].id
      //const nuevoId = parseInt(idActual) +1   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < (tamano*tamano)-tamano+1 && !esAristaIzquierda) {
      const nuevoId = cuadrados[parseInt(idActual) -1 +tamano].id
      //const nuevoId = parseInt(idActual) -1 +tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < (tamano*tamano)-tamano-1 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1 +tamano].id
      //const nuevoId = parseInt(idActual) +1 +tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < (tamano*tamano)-tamano) {
      const nuevoId = cuadrados[parseInt(idActual) +tamano].id
      //const nuevoId = parseInt(idActual) +tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
  }, 10)
}

//El juego ha terminado función que se ejecuta cuando clickeamos sobre una bomba
function gameOver(cuadrado) {
  resultado.innerHTML = 'BOMBA!! HAS PERDIDO'
  juegoAcabado = true
  resetearTiempo()

  //Muestra todas las bombas que había en la partida
  cuadrados.forEach(cuadrado => {
    if (cuadrado.classList.contains('bomba')) {
      cuadrado.innerHTML = '💣'
      cuadrado.classList.remove('bomba')
      cuadrado.classList.add('chequeado')
    }
  })
}

//Comprueba si hemos ganado la partida
function compruebaGanado() {
  ///
let matches = 0

  for (let i = 0; i < cuadrados.length; i++) {
    if (cuadrados[i].classList.contains('bandera') && cuadrados[i].classList.contains('bomba')) {
      matches ++
    }
    // Comprueba si en número de banderas colocadas correctamenes(banderas que están encima de una bomba) es igual 
    // al número de bombas
    if (matches === cantidadBomba) {
      resultado.innerHTML = 'HAS GANADO!'
      juegoAcabado = true
      resetearTiempo()
    }
  }
}

// Cambia el tipo de partida o la resetea a su estado inicial
function cambiarPartida(tipo){
  
  // Elimina el tablero de juego para poder crear uno nuevo
  function eliminarTablero(){
    for(let i = 0; i < tamano*tamano; i++) {
      var ultimo = document.getElementById(i);
      tablero.removeChild(ultimo)
    }
    // resetea numero de banderas la variable juego acabado, los cuadrados y el resultado.
    banderas = 0
    juegoAcabado = false
    cuadrados = []
    resultado.innerHTML = ""
  }

  // En caso de seleccionar un tipo diferente de partida cambia las caracteristicas
  function cambiaTamano(tipo){
    switch (tipo) {
      case "principiante":
        tamano = 10
        cantidadBomba = 10
        break
      case "intermedio":
        tamano = 12
        cantidadBomba = 20
        break
      case "avanzado":
        tamano = 16
        cantidadBomba = 40
        break
      case "experto":
        tamano = 20
        cantidadBomba = 100
        break
    }
  }

  // Elimina el tablero actual 
  eliminarTablero()
  // Cambia el tamaño del buscamina actual
  cambiaTamano(tipo)
  // Crea el nuevo Tablero del buscamina
  crearTablero()
  // Reseta el contador de tiempo
  if (tiempoActivo) resetearTiempo()
  tiempo.innerHTML = 0
}

// Contador para que se actualiza en función de la variable tiempo
function actualizaTiempo() {
  var contador = parseInt(tiempo.innerHTML)
  contador = contador +1
  tiempo.innerHTML = contador
}

// Función que elimina el contador de tiempo actual
function resetearTiempo(){
  clearInterval(tiempoJuego);
  tiempoActivo = false
}




