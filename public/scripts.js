const Mask = {
    apply(input, func) {

        input.value = input.value.replace(/\D/g, "")

        setTimeout(function () {
            input.value = Mask[func](input.value)
        }, 1)

    },
    formatBRL(value) {
        // Permite digitar apenas numeros 
        value = value.replace(/\D/g, "")

        // formata moeda para R$
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value / 100)
    },
    percentage(value) {

        value = String(value).replace(/\D/g, "")

        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            maximumSignificantDigits: 2,
            maximumSignificantDigits: 4,

        }).format(value / 100)
    },

    CPF(value) {
        value = String(value)
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
        return value
    }

}
/*

//Desafio - 06 (Funções assíncronas)

function doubleAndSum(number, result) {

    return new Promise (function (resolve) {
        setTimeout(function () {


            resolve(total = number * 2 + result )

            console.log(`O resultado total foi de: ${total}`)

        }, Math.floor(Math.random() * 100))

    })
}

async function doubleResultAndSum() {
    let result

    result =  await doubleAndSum(5, 0)
    result =  await doubleAndSum(12, result)
    result =  await doubleAndSum(2, result)
    result =  await doubleAndSum(4, result)
    result =  await doubleAndSum(3, result)

}

doubleResultAndSum()
*/

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            // adiciono cada file(arquivo) no array files
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            // Quando o reader estiver pronto, ele executa a função
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getConatainer(image)
                PhotosUpload.preview.appendChild(div)

            }


            // Esse é o momento que ele fica pronto, quando ele lê o file
            reader.readAsDataURL(file)

        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()

    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos.`)
            event.preventDefault()
            return true
        }

        const photosDiv = []

        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos!")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new DataTransfer()

        // Para cada file ele vai adicionar o dataTransfer adicionado um arquivo
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getConatainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"

        return button
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photos">

        // Pegando de uma lista que é o preview (dentro dele tem as fotos)
        const photosArray = Array.from(PhotosUpload.preview)
        const index = photosArray.indexOf(photoDiv)

        // Vai remover o index que ele encontrar (que é ele mesmo), e o 2° argumento é quantos elementos do array ele vai remover (no caso abaixo é 1, que é ele mesmo)
        PhotosUpload.files.splice(index, 1)

        // Atualizo o input com as imagens novas
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},` // Vai colocar id no value (1, 2, 3)
            }
        }

        photoDiv.remove()
    }
}