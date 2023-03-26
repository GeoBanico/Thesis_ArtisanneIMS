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
            });

            console.log(customer);

            const bookRep = connection.getRepository(Book);
            const [book, bookCount] = await bookRep.findAndCountBy({
                customers: customer.id,
                bookDate: data.bookDate
            })

            if(bookCount > 0) return 'duplicate';
            const boolResult = await maxBookCapacity(connection, data.bookDate, data.bookTime)
            console.log(boolResult);
            if(boolResult) return 'max capacity'
            
            const bookStatusRep = connection.getRepository(BookStatus);
            const bookStatus = await bookStatusRep.findOneBy({
                id: 1
            })

            const newBook = new Book();
            newBook.bookDate = data.bookDate;
            newBook.bookStartTime = data.bookTime;
            newBook.isDeleted = false;

            newBook.customerId = customer.id;
            newBook.bookStatusId = bookStatus.id;

            newBook.customers = customer;
            newBook.bookStatuses = bookStatus;

            await connection.manager.save(newBook);

            const newBookRep = connection.getRepository(Book);
            const currentBook = await newBookRep.findOneBy({
                customerId: newBook.customerId,
                bookDate: newBook.bookDate,
            })
            
            var bookServiceArray = []

            const serviceRep = connection.getRepository(Service);
            for (let i = 0; i < data.servicesBooked.length; i++) {
                var serviceToBook = await serviceRep.findOneBy({
                    name: data.servicesBooked[i]
                })
                
                var bookAService = new BookService();
                bookAService.bookId = currentBook.id;
                bookAService.books = currentBook;
                bookAService.serviceId = serviceToBook.id;
                bookAService.services = serviceToBook;

                bookServiceArray.push(bookAService);
            }

            await connection.manager.save(bookServiceArray);

            return 'success';
        })

        return insert;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

async function maxBookCapacity(connection, bookDate,bookTime){
    const newBookRep = connection.getRepository(Book);
    const [bookings, bookingsCount] = await newBookRep.findAndCountBy({
        bookDate: bookDate,
        bookStartTime: bookTime
    })

    if(bookingsCount > 3) return true;
    return false;
}

const getUserBooking = async(data) => {
    try {
        const userBooking = config.then(async function (connection){

            const customerRep = connection.getRepository(Customer);
            const customer = await customerRep.findOneBy({
                username: data.username
            });

            const userBookings = await connection.getRepository(BookService)
                .createQueryBuilder("bookService")
                .innerJoinAndSelect("bookService.books", "books")
                .innerJoinAndSelect("books.customers", "customers")
                .where(`customers.Id = ${customer.id}`)
                .getMany();

            return userBookings;
        })

        return userBooking;
        
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}

const getBookStatus = async(data) => {
    try {
        const get = config.then(async function (connection){
            
            const statusRep = connection.getRepository(BookStatus);
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

const getAllBookings = async(data) => {
    try {
        const userBooking = config.then(async function (connection){
            
            const userBookings = await connection.getRepository(BookService)
                .createQueryBuilder("bookService")
                .innerJoinAndSelect("bookService.books", "books")
                .innerJoinAndSelect("books.customers", "customers")
                .leftJoinAndSelect("books.bookStatuses", "bookStatuses")
                .innerJoinAndSelect("bookService.services", "services")
                .orderBy('books.bookDate', 'ASC')
                .getMany();

            return userBookings;
            
        })

        return userBooking;
        
    } catch (error) {
        
    }
}

const changeBookStatus = async(data) =>{
    try {
        const stats = config.then(async function (connection){

            const bookStatsRepo = connection.getRepository(BookStatus);
            const getbookStat = await bookStatsRepo.findOneBy({
                type: data.status
            })

            const bookRepo = connection.getRepository(Book);
            const getBook = await bookRepo.findOne({
                where: {id: data.bookProductId},
                relations: ["customers", "bookStatuses"]
            })

            if(getBook.bookStatusId == getbookStat.id) return 'Repeated Book Status: \n Kindly select a different status';
            getBook.bookStatusId = getbookStat.id;
            getBook.bookStatuses = getbookStat;

            await bookRepo.save(getBook);

            return '';
        })

        return stats;
    } catch (error) {
        console.log('Insert Customer ERROR: '+error);
    }
}


module.exports = {
    insertBooking,
    getUserBooking,
    getBookStatus,
    getAllBookings,
    changeBookStatus

}