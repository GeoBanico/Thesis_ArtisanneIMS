const config = require('../../src/index'), 
    ProductCategory = require('../../src/model/ProductCategory').ProductCategory,
    Product = require('../../src/model/Product').Product;
    
function testProductQuantity(name){
    const testStoreQuantity = config.then(async function (connection){
        const productRep = connection.getRepository(Product);
        const productToOrder = await productRep.findOneBy({
            name: name
        })

        return productToOrder.storeQuantity;
    })

    return testStoreQuantity;
}

module.exports = testProductQuantity;