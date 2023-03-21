const config = require('../../src/index'), 
    DeliveryCompany = require('../../src/model/DeliveryCompany').DeliveryCompany,
    DeliveryPrice = require('../../src/model/DeliveryPrice').DeliveryPrice;

//-------------------------------------------------
//---------------- DELIVERY COMPANY ---------------
//-------------------------------------------------

const insertDeliveryCompany = async (price) => {
    try {
        const insert = config.then(async function (connection) {
            const deliCat = new DeliveryPrice();
            deliCat.isDeleted = deliCat.isDeleted;
            deliCat.price
            
            const dup = await duplicateServiceType(servCat.name);

            if(dup) return true;
            else{
                await config.manager.save(servCat);
                console.log('[Server] Service Category Saved');
                return false;
            }
        })
    } catch (error) {
        console.log('Insert Company Error: ' + error)
    }
}