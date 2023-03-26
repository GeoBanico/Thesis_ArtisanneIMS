const config = require('../../src/index'), 
    Receipt = require('../../src/model/Receipt').Receipt,
    ProductReceipt = require('../../src/model/ProductReceipt').ProductReceipt,
    Product = require('../../src/model/Product').Product,
    ServiceReceipt = require('../../src/model/ServiceReceipt').ServiceReceipt,
    Service = require('../../src/model/Service').Service

    const insertReceipt = async(data) => {
        try {
            const insert = config.then(async function (connection){
                
                const quantitySet = await hasSufficientQuantity(connection, data.productListToAdd)
                if(quantitySet != '') return quantitySet;
                
                const newReceipt = new Receipt();
                newReceipt.date = data.dateReceipt;
                newReceipt.totalCost = data.costTotal;
                newReceipt.receiptNumber = data.receiptNumber;

                await connection.manager.save(newReceipt);

                //get saved receipt
                const currReceiptRepo = connection.getRepository(Receipt);
                const currReceipt = await currReceiptRepo.findOne({
                    where: {receiptNumber: newReceipt.receiptNumber}
                })

                //get product
                var receiptProductArray = []
                const productRep = connection.getRepository(Product);
                for (let i = 0; i < data.productListToAdd.length; i++) {
                    var productToOrder = await productRep.findOneBy({
                        name: data.productListToAdd[i].productName
                    })
                    
                    var addProductToReceipt = new ProductReceipt();
                    addProductToReceipt.cost = await productToOrder.price;
                    addProductToReceipt.boughtQuantity = data.productListToAdd[i].productQuantity;
                    addProductToReceipt.isDeleted = false;
                    addProductToReceipt.productId = productToOrder.id;
                    addProductToReceipt.products = productToOrder;
                    addProductToReceipt.receiptId = currReceipt.id;
                    addProductToReceipt.receipts = currReceipt;              
    
                    receiptProductArray.push(addProductToReceipt);
                }
    
                await connection.manager.save(receiptProductArray); //error
                
                //get serivce
                var receiptServiceArray = []
                const serviceRep = connection.getRepository(Service);
                for (let i = 0; i < data.serviceListToAdd.length; i++) {
                    var serviceToOrder = await serviceRep.findOneBy({
                        name: data.serviceListToAdd[i]
                    })
                    
                    var addServiceToReceipt = new ServiceReceipt();
                    addServiceToReceipt.cost = await serviceToOrder.price;
                    addServiceToReceipt.isDeleted = false;
                    addServiceToReceipt.serviceId = serviceToOrder.id;
                    addServiceToReceipt.services = serviceToOrder;
                    addServiceToReceipt.receiptId = currReceipt.id;
                    addServiceToReceipt.receipts = currReceipt;              
    
                    receiptServiceArray.push(addServiceToReceipt);
                }
    
                await connection.manager.save(receiptServiceArray);
    
                console.log('[Server] Receipt Saved');
                return '';
            })
    
            return insert;
        } catch (error) {
            console.log('Insert Customer ERROR: '+error);
        }
    }

    async function hasSufficientQuantity(connection, productList){
        const productRep = connection.getRepository(Product);
        const insufficientQuantityList = '';
    
        //check database for quantity deficiency
        for (let i = 0; i < productList.length; i++) {
            var productToOrder = await productRep.findOneBy({
                name: productList[i].productName
            })
            
            if(productToOrder.storeQuantity < productList[i].productQuantity) insufficientQuantityList += `- ${productToOrder.name} | ${productToOrder.boughtQuantity}x\n`;
        }
    
        //minus the produts
        if(insufficientQuantityList == '') {
            console.log('Minus Product')
            for (let i = 0; i < productList.length; i++) {
                var productToOrder = await productRep.findOneBy({
                    name: productList[i].productName
                })
    
                productToOrder.storeQuantity -= productList[i].productQuantity;
                await productRep.save(productToOrder);
            }
        }
    
        return insufficientQuantityList;
    }

    const getAllServiceReceipts = async() => {
        try {
            const get = config.then(async function (connection){
                
                const servReceiptRepo = connection.getRepository(ServiceReceipt)
                .createQueryBuilder("serviceReceipt")
                .innerJoinAndSelect("serviceReceipt.receipts", "receipts")
                .leftJoinAndSelect("serviceReceipt.services", "services")
                .orderBy(`receipts.date`, "ASC")
                .getMany();

                return servReceiptRepo;
            })
    
            return get;
        } catch (error) {
            console.log('Insert Customer ERROR: '+error);
        }
    }

    const getAllProductReceipts = async() => {
        try {
            const get = config.then(async function (connection){
                
                const prodReceiptRepo = connection.getRepository(ProductReceipt)
                .createQueryBuilder("productReceipt")
                .innerJoinAndSelect("productReceipt.receipts", "receipts")
                .leftJoinAndSelect("productReceipt.products", "products")
                .orderBy(`receipts.date`, "ASC")
                .getMany();

                return prodReceiptRepo;
            })
    
            return get;
        } catch (error) {
            console.log('Insert Customer ERROR: '+error);
        }
    }


module.exports = {
    insertReceipt,
    getAllServiceReceipts,
    getAllProductReceipts,
    //getUserCart,
}