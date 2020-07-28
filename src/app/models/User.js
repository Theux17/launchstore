const db = require('../../config/db')


module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM users"

        // Está rodando no - WHERE | OR 
        Object.keys(filters).map(key => {
            query = ` ${query}
                ${key}
            `
            // Entra no where ou no or e pega o email ou cpf_cnpj            
            Object.keys(filters[key]).map(field => {
                query = ` ${query} ${field} = '${filters[key][field]}' `
            })

        })
        const results = await db.query(query)
        return results.rows[0]
    }
}