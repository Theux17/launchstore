const Mask = {
    apply(input ,func){
        setTimeout(function(){
            input.value = Mask[func](input.value)
        }, 1)
        
    },
    formatBRL(value){
        // Permite digitar apenas numeros 
        value = value.replace(/\D/g, "")

        // formata moeda para R$
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)

    }
}
