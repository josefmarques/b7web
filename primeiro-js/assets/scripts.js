let form = document.querySelector('form')
let input = document.querySelector('#nome')
let botao = document.querySelector('#botao')
let erro = document.querySelector('#erro')

function clearInput() {
    input.value = ''
    input.focus()
    input.classList.remove('erro')
    erro.innerText = ''
}

function sendMessage(text) {
    let textSanitized = text.trim()
    if (textSanitized.length > 2) {
        console.log(textSanitized) 
        clearInput()       
    } else {
        input.classList.add('erro')
        erro.innerText = "Digitou errado, necessário mais de 2 caracteres"
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault() 
    sendMessage(input.value)
})