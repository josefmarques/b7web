function showWarning(text) {
    let avisoElement = document.querySelector('.aviso')
    avisoElement.innerText = text
    avisoElement.classList.add('mostrar')

    setTimeout(() => {
        avisoElement.classList.remove('mostrar')        
    }, 3000)
}

document.querySelector('button').addEventListener('click', () => {
    showWarning('Conteúdo apareceu com sucesso')
})