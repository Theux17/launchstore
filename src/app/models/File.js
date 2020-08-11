const db = require("../../config/db")
const fs = require("fs")

module.exports = {
    create({ filename, path, product_id }) {
        const query = `
            INSERT INTO files (
                name,
                path,
                product_id
            ) VALUES($1, $2, $3)
            RETURNING id  
        `
        const values = [
            filename,
            path,
            product_id
        ]

        return db.query(query, values)
    },
    async delete(productId) {

        try {
            const result = await db.query(`SELECT * FROM files WHERE product_id = $1`, [productId])
            const files = result.rows

            files.map(file => fs.unlinkSync(file.path) )

            return db.query(`
                DELETE FROM files WHERE product_id = $1
            
            `, [productId])

        }catch(err){
            console.error(err)
        }
    }
}