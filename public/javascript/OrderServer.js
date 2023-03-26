const config = require('../../src/index'), 
    Customer = require('../../src/model/Customer').Customer,
    Cart = require('../../src/model/Cart').Cart,
    CartProduct = require('../../src/model/CartProduct').CartProduct,
    DeliveryStatus = require('../../src/model/DeliveryStatus').DeliveryStatus,
    Product = require('../../src/model/Product').Product

const insertOrder = async(data) => {
    try {
        const insert = config.then(async function (connection){

            if(await hasSufficientQuantity(connection, data.productOrdered, data.quantities) != '') return false

            console.log('enter')
            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.findOneBy({
                username: data.username
            });
            
            const orderStatusRep = connection.getRepository(DeliveryStatus);
            const deliveryStatus = await orderStatusRep.findOneBy({
                id: 1
            })

            const newOrder = new Cart();
            newOrder.orderNumber = data.orderNumber;
            newOrder.dateOrdered = data.orderDate;
            newOrder.isDeleted = false;
            
            newOrder.customerId = customer.id;
            newOrder.deliveryStatusId = deliveryStatus.id;

            newOrder.customers = customer;
            newOrder.deliveryStatuses = deliveryStatus;

            await connection.manager.save(newOrder);

            const newOrderRep = connection.getRepository(Cart);
            const currentOrder = await newOrderRep.findOne({
                where: {orderNumber: newOrder.orderNumber},
                relations: ["customers", "deliveryStatuses"]
            })

            var orderProductArray = []

            const productRep = connection.getRepository(Product);
            for (let i = 0; i < data.productOrdered.length; i++) {
                var productToOrder = await productRep.findOneBy({
                    name: data.productOrdered[i]
                })
                
                var orderAProduct = new CartProduct();
                orderAProduct.cartId = await currentOrder.id;
                orderAProduct.carts = currentOrder;
                orderAProduct.productId = productToOrder.id;
                orderAProduct.products = productToOrder;
                orderAProduct.boughtquantity = data.quantities[i];                

                orderProductArray.push(orderAProduct);
            }

            console.log(orderProductArray);
            
            await connection.manager.save(orderProductArray); //error

            console.log('[Server] Cart Saved');
            return true;
        })

        return insert;
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

async function hasSufficientQuantity(connection, productOrdered, quantities){
    const productRep = connection.getRepository(Product);
    const insufficientQuantityList = '';

    //check database for quantity deficiency
    for (let i = 0; i < productOrdered.length; i++) {
        var productToOrder = await productRep.findOneBy({
            name: productOrdered[i]
        })
        
        if(productToOrder.storeQuantity < quantities[i]) insufficientQuantityList += `${productToOrder.name}\n`;
    }

    //minus the produts
    if(insufficientQuantityList == '') {
        for (let i = 0; i < productOrdered.length; i++) {
            var productToOrder = await productRep.findOneBy({
                name: productOrdered[i]
            })

            productToOrder.storeQuantity -= quantities[i];
            await productRep.save(productToOrder);
        }
    }

    return insufficientQuantityList;
}

const getUserCart = async(data) => {
    try {
        const userCart = config.then(async function (connection){

            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.findOneBy({
                username: data.username
            });
            
            const userCarts = await connection.getRepository(CartProduct)
            .createQueryBuilder("cartProduct")
            .innerJoinAndSelect("cartProduct.carts", "carts")
            .innerJoinAndSelect("carts.customers", "customers")
            .where(`customers.Id = ${customer.id}`)
            .getMany();

            return userCarts;
            
        })

        return userCart;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

const getDeliveryStatus = async(data) => {
    try {
        const get = config.then(async function (connection){
            
            const statusRep = connection.getRepository(DeliveryStatus);
            const status = await statusRep.findOneBy({
                id: data
            });

            return status.type;
        })

        return get;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

const getAllOrders = async(data) => {
    try {
        const userOrder = config.then(async function (connection){
            
            const userOrders = await connection.getRepository(CartProduct)
                .createQueryBuilder("cartProduct")
                .innerJoinAndSelect("cartProduct.carts", "carts")
                .innerJoinAndSelect("carts.customers", "customers")
                .leftJoinAndSelect("carts.deliveryStatuses", "deliveryStatuses")
                .innerJoinAndSelect("cartProduct.products", "products")
                .orderBy('carts.orderNumber', 'ASC')
                .getMany();

            return userOrders;
            
        })

        return userOrder;
        
    } catch (error) {
        console.log('get Order ERROR: '+error);
    }
}

const changeOrderStatus = async(data) =>{
    try {
        const stats = config.then(async function (connection){

            const statsRepo = connection.getRepository(DeliveryStatus);
            const status = await statsRepo.findOneBy({
                type: data.status
            })

            const cartRepo = connection.getRepository(Cart);
            const getCart= await cartRepo.findOne({
                where: {id: data.cartId},
                relations: ["customers", "deliveryStatuses"]
            })

            if(getCart.deliveryStatuses.type == status.type) return 'Repeated Cart Status: \n Kindly select a different status';
            getCart.deliveryStatusId = status.id;
            getCart.deliveryStatuses = status;

            await cartRepo.save(getCart);

            //CANCELED
            // if(status.type == 'Canceled'){
            //     const cartProdRepo = connection.getRepository(CartProduct);
            //     const cartProd = await cartProdRepo.find({
            //         where: {cartId: data.cartId},
            //         relations: ["products", "carts"]
            //     })


            //     cartProd.forEach(obj => {
            //         Object.entries(obj).forEach(([key, value]) => {
            //             if(key === 'boughtquantity') {
                            
            //             }
            //         });
            //     });
            // }

            return '';
        })

        return stats;
    } catch (error) {
        console.log('Change Status ERROR: '+error);
    }
}


module.exports = {
    insertOrder,
    getUserCart,
    getDeliveryStatus,
    getAllOrders,
    changeOrderStatus
}