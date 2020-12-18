
/*      Variables Globales                   */
/* ------------------------------------------*/



  // Obtiene el tablero de la partida
  const tablero = document.querySelector('.tablero')
  // Obtiene las banderas que faltan
  const banderasRestantes = document.querySelector('#banderas-restantes')
  console.log(banderasRestantes)
  // Obtiene el resultado
  const resultado = document.querySelector('#resultado')
  // Define el tamaño del tablero
  let tamano = 16
  // Define la cantidad de bombas
  let cantidadBomba = 40
  // Define el número de banderas que se han utilizado hasta el momento por defecto es 0
  let banderas = 0
  // Define una lista de cuadrados
  let cuadrados = []
  // Indica si el juego se ha acabado
  let juegoAcabado = false

crearTablero()


//Función crea Tablero 
function crearTablero() {
  // Indica el número de banderas que faltan por colocar
  banderasRestantes.innerHTML = cantidadBomba

  //Genera un arra con las bombas y las posiciones validas y lo reordena de forma aleatoria
  const bombasArray = Array(cantidadBomba).fill('bomba')
  console.log(bombasArray)
  const vacioArray = Array(tamano*tamano - cantidadBomba).fill('valid')
  console.log(vacioArray)
  const juegoArray = vacioArray.concat(bombasArray)
  console.log(juegoArray)
  const reordenadoArray = juegoArray.sort(() => Math.random() -0.5)
  console.log(reordenadoArray)

  for(let i = 0; i < tamano*tamano; i++) {
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
      if (i > 0 && !esAristaIzquierda && cuadrados[i -1].classList.contains('bomba')) total ++
      if (i > 9 && !esAristaDerecha && cuadrados[i +1 -tamano].classList.contains('bomba')) total ++
      if (i > 10 && cuadrados[i -tamano].classList.contains('bomba')) total ++
      if (i > 11 && !esAristaIzquierda && cuadrados[i -1 -tamano].classList.contains('bomba')) total ++
      if (i < 98 && !esAristaDerecha && cuadrados[i +1].classList.contains('bomba')) total ++
      if (i < 90 && !esAristaIzquierda && cuadrados[i -1 +tamano].classList.contains('bomba')) total ++
      if (i < 88 && !esAristaDerecha && cuadrados[i +1 +tamano].classList.contains('bomba')) total ++
      if (i < 89 && cuadrados[i +tamano].classList.contains('bomba')) total ++
      cuadrados[i].setAttribute('data', total)
    }
  }
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
      if (total == 1) cuadrado.classList.add('one')
      if (total == 2) cuadrado.classList.add('two')
      if (total == 3) cuadrado.classList.add('three')
      if (total == 4) cuadrado.classList.add('four')
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
    if (idActual > 9 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1 -tamano].id
      //const nuevoId = parseInt(idActual) +1 -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual > 10) {
      const nuevoId = cuadrados[parseInt(idActual -tamano)].id
      //const nuevoId = parseInt(idActual) -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual > 11 && !esAristaIzquierda) {
      const nuevoId = cuadrados[parseInt(idActual) -1 -tamano].id
      //const nuevoId = parseInt(idActual) -1 -tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < 98 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1].id
      //const nuevoId = parseInt(idActual) +1   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < 90 && !esAristaIzquierda) {
      const nuevoId = cuadrados[parseInt(idActual) -1 +tamano].id
      //const nuevoId = parseInt(idActual) -1 +tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < 88 && !esAristaDerecha) {
      const nuevoId = cuadrados[parseInt(idActual) +1 +tamano].id
      //const nuevoId = parseInt(idActual) +1 +tamano   ....refactor
      const nuevoCuadrado = document.getElementById(nuevoId)
      click(nuevoCuadrado)
    }
    if (idActual < 89) {
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









