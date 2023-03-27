//SERVER DETAILS
const express = require('express'),
    index = require('./src/index');
const app = express();

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server stated at ${port}`);
});

app.use(express.static('HTML'));
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb'}));
app.use(express.urlencoded({
    extended: true
}));

//------------------------------------------------
//-------------------- CUSTOMER ------------------
//------------------------------------------------
const customerServer = require('./public/javascript/customerInfoServer')
//--Login
app.post('/userLogin', async(req, res) => {
    const data = req.body
    const userData = await customerServer.selectCustomerSpecific(data);
    
    res.json(userData);
});

app.post('/addCustomer', async(req, res) => {
    const data = req.body
    const customerValidation = customerServer.insertCustomer(data);

    res.json(await customerValidation)
});

app.post('/searchUserType', async(req, res) => {
    const data = req.body

    const userType = await customerServer.searchForUserType(data);

    res.json(userType);
});

app.post('/searchAllCustomers', async(req, res) => {
    const data = req.body
    const allCustomers = await customerServer.selectCustomerAll(data);

    res.json(allCustomers);
});

app.post('/searchSpecificCustomer', async(req, res) => {
    const data = req.body
    const allCustomers = await customerServer.searchSpecificCustomer(data);

    res.json(allCustomers);
});

app.post('/searchACustomerFromClick', async(req, res) => {
    const data = req.body
    const aCustomer = await customerServer.searchACustomerFromClick(data);

    res.json(aCustomer);
});

app.post('/editCustomer', async(req, res) => {
    const data = req.body
    const hasDuplicate = await customerServer.editCustomer(data);

    res.json(hasDuplicate);
});

app.post('/passwordChange', async(req, res) => {
    const data = req.body
    await customerServer.passwordChange(data);

    res.json({
        message: 'Password Changed'
    });
});

//------------------------------------------------
//-------------------- EMPLOYEE ------------------
//------------------------------------------------
app.post('/searchAllEmployee', async(req, res) => {
    const data = req.body
    const allEmployee = await customerServer.selectEmployeeAll(data);

    res.json(allEmployee);
});
//Search with textbox
app.post('/searchSpecificEmployee', async(req, res) => {
    const data = req.body
    const aEmployee = await customerServer.searchSpecificEmployee(data);

    res.json(aEmployee);
});

//Search with select click
app.post('/searchAEmployeeFromClick', async(req, res) => {
    const data = req.body
    const aEmployee = await customerServer.searchAEmployeeFromClick(data);

    res.json(aEmployee);
});

app.post('/insertCustomerToEmployee', async(req, res) => {
    const data = req.body
    await customerServer.insertCustomerToEmployee(data);

    res.json({message: 'success'});
});

//fill employee access
app.post('/fillEmployeeAccess', async(req, res) => {
    const data = req.body
    const access = await customerServer.fillEmployeeAccess(data);

    res.json(access);
});

//fill employee shifts
app.post('/fillEmployeeShift', async(req, res) => {
    const data = req.body
    const shifts = await customerServer.fillEmployeeShifts(data);

    res.json(shifts);
});

//remove employee
app.post('/removeEmployee', async(req, res) => {
    const data = req.body
    await customerServer.removeEmployee(data);

    res.json({
        message: "Success"
    });
});
//----------------------------------------------------------
//--------------------- ADVANCE SETTING --------------------
//----------------------------------------------------------

const productServer = require('./public/javascript/ProductsServer');
//----------------------------------------
//--------------------PRODUCT ------------
//----------------------------------------
app.post('/addProduct', async(req, res) => {
    const data = req.body

    const boolSameProduct = await productServer.insertProduct(data);
    
    await sameDuplicateGoods(boolSameProduct, res);
});

app.post('/searchAllProduct', async(req, res) => {
    const data = req.body

    const allProduct = await productServer.searchAllProduct(data);
    
    res.json(allProduct);

});

//Search a specific Product
app.post('/searchAProduct', async(req, res) => {
    const data = req.body

    const product = await productServer.searchOneProduct(data.name);

    res.json(product);
});

//Search a specific Product by Id
app.post('/searchAProductById', async(req, res) => {
    const data = req.body
    const product = await productServer.searchOneProductById(data.id);

    res.json(product);
});

//Searching specific product 
app.post('/searchSpecificProduct', async(req, res) => {
    const data = req.body
    const product = await productServer.selectSpecificProduct(data);
    res.json(product);
});

//Searching product by category
app.post('/sortProductByCategory', async(req, res) => {
    const data = req.body
    const product = await productServer.sortProductByCategory(data);

    res.json(product);
});

//Edit a specific Product
app.post('/editProduct', async(req, res) => {
    const data = req.body
    await productServer.editProduct(data);

    res.json({
        message: 'Product Save Success'
    });
});

//Delete a specific Product
app.post('/deleteProduct', async(req, res) => {
    const data = req.body
    await productServer.deleteProduct(data);

    res.json({
        message: 'Product Deleted Success'
    });
});

//Search product based on search box


//----------------------------------------
//--------------------PRODUCT CATEGORY----
//----------------------------------------
//ADD
app.post('/addProductCategory', async(req, res) => {
    const data = req.body

    const boolSameServCat = await productServer.insertProductType(data);
    
    await sameDuplicateGoods(boolSameServCat, res);
});

//SEARCH Specific Product Category base on textbox
app.post('/searchSpecificProductCategory', async(req, res) => {
    const data = req.body
    const selectServCat = await productServer.selectSpecificProductType(data);

    res.json(selectServCat);
});

//SEARCH ALL
app.post('/searchAllProductCategory', async(req, res) => {
    const data = req.body

    const selectAll = await productServer.selectProductTypeAll();

    res.json(selectAll);
});

//Edit
app.post('/editProductCategory', async(req, res) => {
    const data = req.body

    const boolSameServCat = await productServer.updateProductType(data);
    
    await sameDuplicateGoods(boolSameServCat, res);
});

//Delete
app.post('/deleteProductCategory', async(req, res) => {
    const data = req.body

    await productServer.deleteProductType(data);
});

const serviceServer = require('./public/javascript/ServicesServer');
//----------------------------------------
//--------------------SERVICE ------------
//----------------------------------------
app.post('/addService', async(req, res) => {
    const data = req.body

    const boolSameService = await serviceServer.insertService(data);
    
    await sameDuplicateGoods(boolSameService, res);
});

app.post('/searchAllService', async(req, res) => {
    const data = req.body

    const allService = await serviceServer.searchAllService(data);
    
    res.json(allService);

});

//Search a specific Service
app.post('/searchAService', async(req, res) => {
    const data = req.body

    const service = await serviceServer.searchOneService(data.name);

    res.json(service);
});

//Search a specific Service
app.post('/sortServiceByCategory', async(req, res) => {
    const data = req.body
    const service = await serviceServer.sortServiceByCategory(data);

    res.json(service);
});

//Search a specific Product by Id
app.post('/searchAServiceById', async(req, res) => {
    const data = req.body
    const product = await serviceServer.searchOneServiceById(data.id);

    res.json(product);
});

//Edit a specific Service
app.post('/editService', async(req, res) => {
    const data = req.body
    await serviceServer.editService(data);

    res.json({
        message: 'Service Save Success'
    });
});

//Delete a specific Service
app.post('/deleteService', async(req, res) => {
    const data = req.body
    await serviceServer.deleteService(data);

    res.json({
        message: 'Service Deleted Success'
    });
});

app.post('/quickSearchService', async(req, res) => {
    const data = req.body
    const quickSearch = await serviceServer.quickSearchService(data);

    res.json(quickSearch);
});

//----------------------------------------
//--------------------SERVICE CATEGORY----
//----------------------------------------
//ADD
app.post('/addServiceCategory', async(req, res) => {
    const data = req.body

    const boolSameServCat = await serviceServer.insertServiceType(data);
    
    await sameDuplicateGoods(boolSameServCat, res);
});

//SEARCH Specific Service Category base on textbox
app.post('/searchSpecificServiceCategory', async(req, res) => {
    const data = req.body
    const selectServCat = await serviceServer.selectSpecificServiceType(data);

    res.json(selectServCat);
});

//SEARCH ALL
app.post('/searchAllServiceCategory', async(req, res) => {
    const data = req.body

    const selectAll = await serviceServer.selectServiceTypeAll(data);
    
    res.json(selectAll);
});

//Edit
app.post('/editServiceCategory', async(req, res) => {
    const data = req.body

    const boolSameServCat = await serviceServer.updateServiceType(data);
    
    await sameDuplicateGoods(boolSameServCat, res);
});

//Delete
app.post('/deleteServiceCategory', async(req, res) => {
    const data = req.body

    await serviceServer.deleteServiceType(data);
});


//HelperFunction
async function sameDuplicateGoods(goods, res){
    if(await goods) {
        res.json({
            message: 'duplicate'
        });
    }
    else {
        res.json({
            message: 'success'
        });
    }
}

//----------------------------------------
//-------------------- BOOKING -----------
//----------------------------------------
const bookingServer = require('./public/javascript/BookingServer');
app.post('/confirmBooking', async(req, res) => {
    const data = req.body

    console.log(data.bookDate);
    const hasBooked = await bookingServer.insertBooking(data);

    res.json({
            message: hasBooked
        });
});

app.post('/getUserBooking', async(req, res) => {
    const data = req.body

    const userBooks = await bookingServer.getUserBooking(data);

    res.json(userBooks);
});

app.post('/getBookStatus', async(req, res) => {
    const data = req.body

    const get = await bookingServer.getBookStatus(data.status);

    res.json(get);
});

app.post('/getAllBookings', async(req, res) => {
    const allBooks = await bookingServer.getAllBookings();

    res.json(allBooks);
});

app.post('/changeBookStatus', async(req, res) => {
    const data = req.body
    const allBooks = await bookingServer.changeBookStatus(data);

    res.json(allBooks);
});
//----------------------------------------
//-------------------- ORDERS ------------
//----------------------------------------
const orderServer = require('./public/javascript/OrderServer');
app.post('/placeOrder', async(req, res) => {
    const data = req.body

    const hasQuantity = await orderServer.insertOrder(data);
    
    res.json(hasQuantity)

});

app.post('/getUserCarts', async(req, res) => {
    const data = req.body

    const userCart = await orderServer.getUserCart(data);

    res.json(userCart);
});

app.post('/getDeliveryStatus', async(req, res) => {
    const data = req.body

    const get = await orderServer.getDeliveryStatus(data.status);

    res.json(get);
});

app.post('/getAllOrders', async(req, res) => {
    const allBooks = await orderServer.getAllOrders();

    res.json(allBooks);
});

app.post('/changeOrderStatus', async(req, res) => {
    const data = req.body
    const allBooks = await orderServer.changeOrderStatus(data);

    res.json(allBooks);
});

//----------------------------------------
//-------------------- FINANCES ------------
//----------------------------------------
const financeServer = require('./public/javascript/FinanceServer');
app.post('/insertReceipt', async(req, res) => {
    const data = req.body
    const checkQuantity = await financeServer.insertReceipt(data);

    res.json(checkQuantity);
});

app.post('/getAllServiceReceipts', async(req, res) => {
    const data = req.body
    const checkQuantity = await financeServer.getAllServiceReceipts(data);

    res.json(checkQuantity);
});

app.post('/getAllProductReceipts', async(req, res) => {
    const data = req.body
    const checkQuantity = await financeServer.getAllProductReceipts(data);

    res.json(checkQuantity);
});

app.post('/getAllReceipts', async(req, res) => {
    const data = req.body
    const allReceipt = await financeServer.getAllReceipts(data);

    res.json(allReceipt);
});