const config = require('../../src/index'), 
    ProductCategory = require('../../src/model/ProductCategory').ProductCategory,
    Product = require('../../src/model/Product').Product;
    

//------------------------------------------------
//------------------- SERVICE --------------------
//------------------------------------------------

const insertProduct = async(productToAdd) => {
    try {

        const insert = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const searchOneProdCat = await prodCatRep.findOneBy({
                name:productToAdd.categories,
                isDeleted: false
            })

            let product = new Product();
            product.productCategoryId = searchOneProdCat.id;
            product.name = productToAdd.name;
            product.price = productToAdd.price;
            product.description = productToAdd.description;
            product.isDeleted = productToAdd.isDeleted;
            product.storeQuantity = productToAdd.quantity;
            product.categories = searchOneProdCat;

            const productRep = connection.getRepository(Product);

            const dup = await duplicateProduct(product.name);
            if(dup) return true;
            else{
                await productRep.save(product);
                console.log('[Server] Product Saved');
                return false;
            }
        })
        
        return insert;

    } catch (error) {
        console.log('insert product '+ error);
    }
}

const duplicateProduct = async(productName) => {
    try {

        const duplicate = config.then(async function(connection){
            const productRep = connection.getRepository(Product);
            const searchOneProduct = await productRep.findOneBy({
                name:productName,
                isDeleted: false
            })

            if (searchOneProduct != null) return true;
            else return false;
        })
        return duplicate;

    } catch (error) {
        console.log('Select specific product '+error);
    }
}

const searchAllProduct = async() => {
    try {
            const search = config.then(async function(connection){
            const productRep = connection.getRepository(Product);
            const allProduct = await productRep.findBy({
                isDeleted:false
            })

            return allProduct
        })
        return search;

    } catch (error) {
        console.log('Select specific product '+error);
    }
}

const searchOneProduct = async(productName) => {
    try {
        
        const search = config.then(async function(connection){
            const productRep = connection.getRepository(Product);
            const searchAProduct = await productRep.find({
                where: {
                    name: productName,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAProduct;
        })
        return search;

    } catch (error) {
        console.log('Select specific product '+error);
    }
}

const searchOneProductById = async(productId) => {
    try {
        
        const search = config.then(async function(connection){
            const productRep = connection.getRepository(Product);
            const searchAProduct = await productRep.findOne({
                where: {
                    id: productId,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAProduct;
        })
        return search;

    } catch (error) {
        console.log('Select specific product '+error);
    }
}

const sortProductByCategory= async(productName) => {
    try {
        const search = config.then(async function(connection){
            const productCatRep = connection.getRepository(ProductCategory);
            const productCat = await productCatRep.findOneBy({
                name: productName.value,
                isDeleted: false
            })

            const productRep = connection.getRepository(Product);
            const searchAProduct = await productRep.find({
                where: {
                    productCategoryId: productCat.id,
                    isDeleted: false
                },
                relations: ["categories"]
            })

            return searchAProduct;
        })
        return search;

    } catch (error) {
        console.log('Select specific product '+error);
    }
}

const editProduct = async(newProduct) => {
    try {
        const edit = config.then(async function (connection) {
            const productRep = connection.getRepository(Product);
            const productToUpdate = await productRep.findOneBy({
                name: newProduct.oldName,
                isDeleted: false
            })

            const prodCatRep = connection.getRepository(ProductCategory);
            const searchOneProdCat = await prodCatRep.findOneBy({
                name:newProduct.categories,
                isDeleted: false
            })

            productToUpdate.productCategoryId = searchOneProdCat.id;
            productToUpdate.name = newProduct.name;
            productToUpdate.price = newProduct.price;
            productToUpdate.description = newProduct.description;
            productToUpdate.storeQuantity = newProduct.quantity;
            productToUpdate.categories = searchOneProdCat;

            await productRep.save(productToUpdate);
            console.log('[Server] Product Saved');
        })

    } catch (error) {
        console.log('insert product '+ error);
    }
}

const deleteProduct = async(productName) => {
    try {
        const toDelete = config.then(async function (connection) {
            const productRep = connection.getRepository(Product);
            const productToDelete = await productRep.findOneBy({
                name: productName.name,
                isDeleted: false
            })

            productToDelete.isDeleted = true;

            await productRep.save(productToDelete);
            console.log('[Server] Product Deleted');
        })

        return await toDelete;

    } catch (error) {
        console.log('insert product '+ error);
    }
}

const selectSpecificProduct = async(productName) => {
    try {

        var select = config.then(async function (connection) {
            const prodRep = connection.getRepository(Product);
            const allProd = await prodRep.findBy({
                isDeleted: false
            });

            var specificProduct = new Array();

            allProd.forEach(product => {
                var prodName = String(product.name).toLowerCase();
                if(prodName.includes(String(productName.name).toLowerCase(),0)){
                    var jsonProd = new Object();
                    jsonProd.name = product.name;

                    specificProduct.push(jsonProd);
                }
            });

            return specificProduct;
        })

        return select;
        
    } catch (error) {
        console.log('select All Product Category '+error);
    }
}

//------------------------------------------------
//---------------PRODUCT CATEGORIES---------------
//------------------------------------------------

const insertProductType = async(productType) => {
    try {

        var insert = config.then(async function (connection) {
            const prodCat = new ProductCategory();
            prodCat.isDeleted = productType.isDeleted;
            prodCat.name = productType.name;
            
            const dup = await duplicateProductType(prodCat.name);

            if(dup) return true;
            else{
                await connection.manager.save(prodCat);
                console.log('[Server] Product Category Saved');
                return false;
            }
        })

        return insert;
        
    } catch (error) {
        console.log('insert product category '+ error);
    }
}

const selectProductTypeAll = async() => {
    try {
        var selectProductType = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const allProdCat = await prodCatRep.findBy({
                isDeleted: false
            });

            return allProdCat;
        })

        return selectProductType;

    } catch (error) {
        console.log('select All Product Category '+error);
    }
}

const selectSpecificProductType = async(productName) => {
    try {

        var select = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const allProdCat = await prodCatRep.findBy({
                isDeleted: false
            });

            var specificProductsCat = new Array();

            allProdCat.forEach(productCat => {
                var catName = String(productCat.name).toLowerCase();
                if(catName.includes(String(productName.name).toLowerCase(),0)){
                    var jsonProdCat = new Object();
                    jsonProdCat.name = productCat.name;

                    specificProductsCat.push(jsonProdCat);
                }
            });
            
            //var jsonArray = JSON.parse(JSON.stringify(specificProductsCat));

            return specificProductsCat;
        })

        return select;
        
    } catch (error) {
        console.log('select All Product Category '+error);
    }
}

const duplicateProductType = async(productTypeName) => {
    try {

        const duplicate = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const searchOneProdCat = await prodCatRep.findOneBy({
                name:productTypeName,
                isDeleted: false
            })

            if (searchOneProdCat != null) return true;
            return false;
        })  
        return duplicate;
        
    } catch (error) {
        console.log('select specific product category'+error);
    }
}

const updateProductType = async(prodCat) => {
    try {

        const updates = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const prodCatToUpdate = await prodCatRep.findOneBy({
                name: prodCat.oldName,
                isDeleted: false
            })

            const dup = await duplicateProductType(prodCat.name);
            if(dup) return dup

            prodCatToUpdate.name = prodCat.name;
            await prodCatRep.save(prodCatToUpdate);

            return dup
        })

        return await updates
        
    } catch (error) {
        console.log('update product type '+error);
    }
}

const deleteProductType = async(prodCat) => {
    try {

        const deletes = config.then(async function (connection) {
            const prodCatRep = connection.getRepository(ProductCategory);
            const prodCatToUpdate = await prodCatRep.findOneBy({
                name: prodCat.name,
                isDeleted: false
            })

            prodCatToUpdate.isDeleted = true;
            await prodCatRep.save(prodCatToUpdate);
        })

        return await deletes
        
    } catch (error) {
        console.log('delete product category '+error);
    }
}

module.exports = {
    //Product Category
    insertProductType,
    selectProductTypeAll,
    selectSpecificProductType,
    duplicateProductType,
    updateProductType,
    deleteProductType,
    //Product
    insertProduct,
    searchAllProduct,
    searchOneProduct,
    editProduct,
    deleteProduct,
    selectSpecificProduct,
    sortProductByCategory,
    searchOneProductById
}
