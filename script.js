
/*      Variables Globales                   */
/* ------------------------------------------*/



  // Obtiene el tablero de la partida
  const tablero = document.querySelector('.tablero')
  // Obtiene las banderas que faltan
  const banderasRestantes = document.querySelector('#banderas-restantes')
  // Obtiene el resultado
  const resultado = document.querySelector('#resultado')

  const selectores = document.querySelectorAll(".selectores");
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



//Función crea Tablero 
function crearTablero() {
  // Indica el número de banderas que faltan por colocar
  banderasRestantes.innerHTML = cantidadBomba
  //Adapta el tamaño del tablero en el css
  cambiarTamonoTablero()

  //Genera un arra con las bombas y las posiciones validas y lo reordena de forma aleatoria
  const bombasArray = Array(cantidadBomba).fill('bomba')
  const vacioArray = Array(tamano*tamano - cantidadBomba).fill('valid')
  const juegoArray = vacioArray.concat(bombasArray)
  const reordenadoArray = juegoArray.sort(() => Math.random() -0.5)

  for(let i = 0; i < tamano*tamano; i++) {
    console.log(cuadrados)
    const cuadrado = document.createElement('div')
    cuadrado.setAttribute('id', i)
    cuadrado.classList.add(reordenadoArray[i])
    tablero.appendChild(cuadrado)
    cuadrados.push(cuadrado)

    //normal click
    cuadrado.addEventListener('click', function(e) {
      click(cuadrado)
    })

    //cntrl and left click
    cuadrado.oncontextmenu = function(e) {
      e.preventDefault()
      añadeBandera(cuadrado)
    }
  }
  

  //add numbers
  for (let i = 0; i < cuadrados.length; i++) {
    let total = 0
    const esAristaIzquierda = (i % tamano === 0)
    const esAristaDerecha = (i % tamano === tamano -1)

    if (cuadrados[i].classList.contains('valid')) {
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

function cambiarTamonoTablero() {
  var ancho = tamano*30
  tablero.style.width = `${String(ancho)}px`
  tablero.style.height = `${String(ancho)}px`
}

//add Flag with right click
function añadeBandera(cuadrado) {
  if (juegoAcabado) return
  if (!cuadrado.classList.contains('checked') && (banderas <= cantidadBomba)) {
    if (!cuadrado.classList.contains('flag') && (banderas < cantidadBomba)) {
      cuadrado.classList.add('flag')
      cuadrado.innerHTML = ' 🚩'
      banderas ++
      banderasRestantes.innerHTML = cantidadBomba- banderas
      checkForWin()
    } else if (cuadrado.classList.contains('flag')) {
      cuadrado.classList.remove('flag')
      cuadrado.innerHTML = ''
      banderas --
      banderasRestantes.innerHTML = cantidadBomba- banderas
    }
  }
}

//click on cuadrado actions
function click(cuadrado) {
  let idActual = cuadrado.id
  if (juegoAcabado) return
  if (cuadrado.classList.contains('checked') || cuadrado.classList.contains('flag')) return
  if (cuadrado.classList.contains('bomba')) {
    gameOver(cuadrado)
  } else {
    let total = cuadrado.getAttribute('data')
    if (total !=0) {
      cuadrado.classList.add('checked')
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
    checkSquare(cuadrado, idActual)
  }
  cuadrado.classList.add('checked')
}


//check neighboring cuadrados once cuadrado is clicked
function checkSquare(cuadrado, idActual) {
  const esAristaIzquierda = (idActual % tamano === 0)
  const esAristaDerecha = (idActual % tamano === tamano -1)

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

//game over
function gameOver(cuadrado) {
  resultado.innerHTML = 'BOOM! Game Over!'
  juegoAcabado = true

  //show ALL the bombs
  cuadrados.forEach(cuadrado => {
    if (cuadrado.classList.contains('bomba')) {
      cuadrado.innerHTML = '💣'
      cuadrado.classList.remove('bomba')
      cuadrado.classList.add('checked')
    }
  })
}

//check for win
function checkForWin() {
  ///simplified win argument
let matches = 0

  for (let i = 0; i < cuadrados.length; i++) {
    if (cuadrados[i].classList.contains('flag') && cuadrados[i].classList.contains('bomba')) {
      matches ++
    }
    if (matches === cantidadBomba) {
      resultado.innerHTML = 'YOU WIN!'
      juegoAcabado = true
    }
  }
}


//Ejecución del tablero

crearTablero()

selectores.forEach((selector) => selector.addEventListener("click", (e) => cambiarPartida(e.target.id)));

function cambiarPartida(tipo){
  function eliminarTablero(){
    for(let i = 0; i < tamano*tamano; i++) {
      var ultimo = document.getElementById(i);
      tablero.removeChild(ultimo)
    }
    banderas = 0
    juegoAcabado = false
    cuadrados = []
  }
  function cambiaTamano(tipo){
    if(tipo == "principiante"){
      tamano = 10
      cantidadBomba = 10
    }
    if(tipo == "intermedio"){
      tamano = 12
      cantidadBomba = 20
    }
    if(tipo == "avanzado"){
      tamano = 16
      cantidadBomba = 40
    }
    if(tipo == "experto"){
      tamano = 20
      cantidadBomba = 100
    }
  }

  // Elimina el tablero actual 
  eliminarTablero()
  // Cambia el tamaño del buscamina actual
  cambiaTamano(tipo)
  // Crea el nuevo Tablero del buscamina
  crearTablero()
}








