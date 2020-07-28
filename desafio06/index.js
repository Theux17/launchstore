//Desafio - 06 (Funções assíncronas)
function doubleAndSum(number, result) {

    return new Promise(function (resolve) {
        setTimeout(function () {


            resolve(total = number * 2 + result)

            console.log(`O resultado total foi de: ${total}`)

        }, Math.floor(Math.random() * 100))

    })
}

async function doubleResultAndSum() {
    let result

    result = await doubleAndSum(5, 0)
    result = await doubleAndSum(12, result)
    result = await doubleAndSum(2, result)
    result = await doubleAndSum(4, result)
    result = await doubleAndSum(3, result)

}

doubleResultAndSum()

// Máscara de CPF
const Mask = {

    CPF(value) {
        value = String(value)
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
        return value
    }

}