const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
}

/*
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
*/