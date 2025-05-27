let isAnimating = false
let pullCardDistance= 0 //distancia recorrida por la carta
const DECISION_LIMIT = 150

document.addEventListener('mousedown',startDrag)
document.addEventListener('touchstart',startDrag,{passive:true})//al usar el passive true ignora varios comportamientos por defecto




function startDrag (e){
if (isAnimating) return
const actualCard = e.target.closest('article')//asegurarnos que si o si se mueva toda la card(evita el problema de mover solo el titulo)

//detectar la posicion inicial del puntero(buscamos el pageX)

startX = e.pageX?? e.touches[0].pageX//el event.touch[n] es para detectar el orden de dedos ya que soporta multitouch




//detectar movimientos del puntero tanto el mientras, como el final

let onMove=(e)=>{
    //haremos un seguimiento de la posicion 
    const currentX = e.pageX ?? e.touches[0].pageX
    //y encontraremos la forma de encontrar la diferencia de posicion con la inicial
    pullCardDistance = currentX - startX
   //sin distancia recorrida
    if(pullCardDistance === 0) return
    //unir la rotacion con la distancia recorrida
    const deg = pullCardDistance / 10
    //aplicar la tranformacion a la card
    actualCard.style.transform=`translateX(${pullCardDistance}px)rotate(${deg}deg)`
    actualCard.style.cursor='grabbing'//crea el efecto de agarre en el cursor
    isAnimating=true //por una cuestion de clean code y optimizacion de recursos
   

}
let onEnd=(e)=>{
    // limpiar los listener al terminar la accion 
    isAnimating=false
    document.removeEventListener('mousemove',onMove)
    document.removeEventListener('mouseup',onEnd)

    document.removeEventListener('touchmove',onMove)
    document.addEventListener('touchend',onEnd)
    
    //saber si el usuario tomo una decision
    const decisionMade = Math.abs(pullCardDistance) >= DECISION_LIMIT 
    //usamos el Math.abs para saber el valor absoluto, ya que necesitamos terminar la accion,
    //  aunque los valores positivos y negativos sirven para saber que decision fue tomada
    
    if (decisionMade){
        console.log('decision hecha')
        const goRight = pullCardDistance >= 0
        const goLeft = !goRight
        //añadir la clase a la carta segun la decision tomada
        actualCard.classList.add(goRight? 'right' : 'left')
        actualCard.addEventListener('transitionend',()=>{
            actualCard.remove()
        },({once:true}))

    }else{
        console.log('pensando...')
        actualCard.classList.add('restart')
        actualCard.classList.remove('righ','left')
    }

    //reset variable
    actualCard.addEventListener('transitionend',()=>{
        actualCard.removeAttribute('style')
        actualCard.classList.remove('restart')
        pullCardDistance=0
        isAnimating=false
    })




}


document.addEventListener('mousemove',onMove)
document.addEventListener('mouseup',onEnd)

document.addEventListener('touchmove',onMove,{passive:true})
document.addEventListener('touchend',onEnd,{passive:true})





}

