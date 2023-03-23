const config = require('../../src/index'), 
    Customer = require('../../src/model/Customer').Customer,
    Book = require('../../src/model/Book').Book,
    BookStatus = require('../../src/model/BookStatus').BookStatus,
    BookService = require('../../src/model/BookService').BookService,
    Service = require('../../src/model/Service').Service

const insertBooking = async(data) => {
    try {
        const insert = config.then(async function (connection){

            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.findOneBy({
                username: data.username
            })

            
            for (let i = 0; i < data.servicesBooked.length; i++) {
                var newBookingService = new BookService();
                newBookingService
            }   

            return false;
        })

        return insert;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

module.exports = {
    insertBooking,

}