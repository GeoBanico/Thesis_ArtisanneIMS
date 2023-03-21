const typeorm = require("typeorm");

const Book = require("./model/Book").Book;
const BookService = require("./model/BookService").BookService;
const BookStatus = require("./model/BookStatus").BookStatus;
const Cart = require("./model/Cart").Cart;
const Customer = require("./model/Customer").Customer;
const CustomerStatus = require("./model/CustomerStatus").CustomerStatus;
const DeliveryStatus = require("./model/DeliveryStatus").DeliveryStatus;
const Employee = require("./model/Employee").Employee;
const EmployeeAccess = require("./model/EmployeeAccess").EmployeeAccess;
const EmployeeShift = require("./model/EmployeeShift").EmployeeShift;
const Product = require("./model/Product").Product;
const ProductCategory = require("./model/ProductCategory").ProductCategory;
const ProductReceipt = require("./model/ProductReceipt").ProductReceipt;
const Receipt = require("./model/Receipt").Receipt;
const Service = require("./model/Service").Service;
const ServiceCategory = require("./model/ServiceCategory").ServiceCategory;
const ServiceReceipt = require("./model/ServiceReceipt").ServiceReceipt

// typeorm.createConnection({
//     type: "mssql",
//     host: "banico-server.database.windows.net",
//     username: "banico",
//     password: "Destiny@1222",
//     database: "Artisanne",
//     authentication: {
//         type: 'default'
//     },
//     options: {
//         encrypt: true
//     },
//     synchronize: true,
//     logging: false,
//     entities: [
//         require("./entity/BookSchema"),
//         require("./entity/BookServiceSchema"),
//         require("./entity/BookStatusSchema"),
//         require("./entity/CartSchema"),
//         require("./entity/CustomerSchema"),
//         require("./entity/CustomerStatusSchema"),
//         require("./entity/DeliveryStatusSchema"),
//         require("./entity/EmployeeAccessSchema"),
//         require("./entity/EmployeeSchema"),
//         require("./entity/EmployeeShiftSchema"),
//         require("./entity/ProductCategorySchema"),
//         require("./entity/ProductReceiptSchema"),
//         require("./entity/ProductSchema"),
//         require("./entity/ReceiptSchema"),
//         require("./entity/ServiceCategorySchema"),
//         require("./entity/ServiceReceiptSchema"),
//         require("./entity/ServiceSchema"),
//     ]
// })
// .catch(function(error) {
//     console.log("Error: ", error);
// })
// .then(async function (connection) {
//     console.log("Connected to Database");

//     const serviceRep = connection.getRepository(Service);
//     const searchAService = await serviceRep.find({
//         relations: ["categories"]
//     })
//     console.log(await searchAService)
// } )
// .then(function (connection) {
//     const cat1 = new ServiceCategory(0, 'Nails', 0);

//     return connection
//     .manager
//     .save(cat1)
//     .then(() => {

//         let service = new Service();
//         service.name = 'Manicure (Regular)';
//         service.price = 150;
//         service.duration = 15;
//         service.description = 'A beauty treatment for your fingernails and hands.'
//         service.isDeleted = false;
//         service.categories = cat1;

//         let serviceRepo = connection.getRepository(Service);

//         serviceRepo.save(service)
//         .then(function (savedPost) {
//             console.log("Post has been saved: ", savedPost);
//             console.log("Now lets load all posts: ");

//             return serviceRepo.find();
//         })
//         .then(function(allPosts) {
//             console.log("All posts: ", allPosts);
//         });
//     })
// })

const config = typeorm.createConnection({
    type: "mssql",
    host: "banico-server.database.windows.net",
    username: "banico",
    password: "Destiny@1222",
    database: "Artisanne",
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    },
    synchronize: true,
    logging: false,
    entities: [
        require("./entity/BookSchema"),
        require("./entity/BookServiceSchema"),
        require("./entity/BookStatusSchema"),
        require("./entity/CartSchema"),
        require("./entity/CustomerSchema"),
        require("./entity/CustomerStatusSchema"),
        require("./entity/DeliveryStatusSchema"),
        require("./entity/EmployeeAccessSchema"),
        require("./entity/EmployeeSchema"),
        require("./entity/EmployeeShiftSchema"),
        require("./entity/ProductCategorySchema"),
        require("./entity/ProductReceiptSchema"),
        require("./entity/ProductSchema"),
        require("./entity/ReceiptSchema"),
        require("./entity/ServiceCategorySchema"),
        require("./entity/ServiceReceiptSchema"),
        require("./entity/ServiceSchema"),
    ]
})
module.exports = config;

//config.initialize()
