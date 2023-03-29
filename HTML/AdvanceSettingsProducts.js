//------------------------------------
//---------------- SERVICE -----------
//------------------------------------

var productCategoryState = { state:'add', toEdit:''}
var productState = { state:'add', toEdit:''}

async function refreshProductList() {
    const dataStream = await fillProduct();
    var selectBox = document.getElementById("allProductList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    await dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });

    refreshMainProductCategory()
}

async function fillProduct() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllProduct', options);
    const dataStream = await response.json();

    console.log(await dataStream);
    return await dataStream;
}

async function keyPressProductSearch(){
    var name = document.getElementById("txtsearchProduct").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllProduct', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allProductList");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
    else{
        console.log(name);
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificProduct', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allProductList");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
}

async function clearProductInputs(){
    document.getElementById("allProductList").value = '';
    document.getElementById("productName").value = '';
    document.getElementById("productPrice").value = '';
    document.getElementById("productDescription").value = '';
    document.getElementById("productCategoryList").value = '';
    document.getElementById("productQuantity").value='';

    disableProductComponents()
}

async function enableProductComponents(){
    document.getElementById("allProductList").value = '';

    document.getElementById("productName").disabled = false;
    document.getElementById("productPrice").disabled = false;
    document.getElementById("productDescription").disabled = false;
    document.getElementById("productCategoryList").disabled = false;
    document.getElementById("addProductCategoryToDatabase").disabled = false;
    document.getElementById("productQuantity").disabled=false;

    document.getElementById("allProductList").disabled = true;
    document.getElementById("saveProductClick").style.display = 'block';
}

async function disableProductComponents(){
    document.getElementById("allProductList").value = '';

    document.getElementById("productName").disabled = true;
    document.getElementById("productPrice").disabled = true;
    document.getElementById("productDescription").disabled = true;
    document.getElementById("productCategoryList").disabled = true;
    document.getElementById("addProductCategoryToDatabase").disabled = true;
    document.getElementById("productQuantity").disabled=true;

    document.getElementById("allProductList").disabled = false;
    document.getElementById("saveProductClick").style.display = 'none';
}

async function getInfoFromClickedProductList(){
    var name = document.getElementById("allProductList").value;
    var data = {name};

    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/searchAProduct', options);
    const dataStream = await response.json();

    document.getElementById("productName").value = await dataStream[0].name;
    document.getElementById("productPrice").value = await dataStream[0].price;
    document.getElementById("productDescription").value = await dataStream[0].description;
    document.getElementById("productCategoryList").value = await dataStream[0].categories.name;
    document.getElementById("productQuantity").value = await dataStream[0].storeQuantity
}

function hasMissingValues(data){
    
    Object.entries(data).forEach(([key, value]) => {
        if(value == '') {
            return true;
        }
    });

    return false;
}

function missingData(data){
    var missingVariable = "";
    Object.entries(data).forEach(([key, value]) => {
            if (key != 'isDeleted' && value == '') {
                missingVariable += `- ${key}\n`
            }
    });

    return missingVariable;
}

//Save Product
document.getElementById("saveProductClick").onclick = async function() {
    var name = document.getElementById("productName").value;
    var price = document.getElementById("productPrice").value;
    var description = document.getElementById("productDescription").value;
    var categories = document.getElementById("productCategoryList").value;
    var quantity = document.getElementById("productQuantity").value;
    var isDeleted = false;

    var dataTest = {name, price, description, categories, quantity, isDeleted};
    var hasMissingData = missingData(dataTest);
    if(hasMissingData != '') return alert(`EMPTY FIELDS! \nThere are empty fields in this category/ies: \n${hasMissingData}`);

    if(!isWholeNumber(price)){
        alert(`Invalid Price (${price}): \nKindly select a whole number greater than 1 for the Price.`);
        return;
    }

    if(!isWholeNumber(quantity)){
        alert(`Invalid Quantity (${quantity}): \nKindly select a whole number greather than 1 for the Quantity.`);
        return;
    }

    if(productState.state=='add') {
        var data = {name, price, description, categories, quantity, isDeleted};
        
        if(hasMissingValues(data)) {
            alert('Empty Fields: \nKindly fill all the needed informations.')
            return;
        }

        const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        };

        const response = await fetch('/addProduct', options);
        const dataStream = await response.json();

        if(await dataStream.message == 'duplicate'){
            alert('This Product already exists');
            return;
        }
        
    }
    else if(productState.state == 'edit') {
        var oldName = productState.toEdit;
        var data = {name, price, description, categories, quantity, isDeleted, oldName};

        if(hasMissingValues(data)) {
            alert('Empty Fields: \nKindly fill all the needed informations.')
            return;
        }

        const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        };

        const response = await fetch('/editProduct', options);
        const dataStream = await response.json();
    }

    closeProduct();
    refreshProductList();
}

async function addProduct(){
    productState.state = 'add';
    productState.toEdit = '';
    await refreshMainProductCategory()
    clearProductInputs()
    enableProductComponents()

    document.getElementById("addProductClick").style.display = 'none';
    document.getElementById("editProductClick").style.display = 'none';
    document.getElementById("deleteProductClick").style.display = 'none';
    document.getElementById("closeProductClick").style.display = 'block';
}

async function editProduct() {
    var name = document.getElementById("allProductList").value;
    if(name == '') alert('Please select a Product')
    else {
        productState.state = 'edit';
        productState.toEdit = name;
        await refreshMainProductCategory()
        enableProductComponents()

        document.getElementById("productCategory").style.color = 'blue';
        document.getElementById("addProductClick").style.display = 'none';
        document.getElementById("editProductClick").style.display = 'none';
        document.getElementById("deleteProductClick").style.display = 'none';
        document.getElementById("closeProductClick").style.display = 'block';

        document.getElementById("productCategory").value = name;
    }
}

async function deleteProduct(){
    var name = document.getElementById("allProductList").value;
    if(name == '') return alert('Please select a Product')
    if (!confirm(`Are you sure to delete the Product (${name})?`)) return

    var data = {name};
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/deleteProduct', options);
    const dataStream = await response.json();
    
    closeProduct();
    refreshProductList();
}

async function closeProduct(){
    document.getElementById("productCategory").style.color = 'black';
    document.getElementById("addProductClick").style.display = 'block';
    document.getElementById("editProductClick").style.display = 'block';
    document.getElementById("deleteProductClick").style.display = 'block';
    document.getElementById("closeProductClick").style.display = 'none';
    document.getElementById("productCategoryHidden").style.display = 'none';
    clearProductInputs();
}

//---------------------------------------------
//---------------- SERVICE CATEGORY -----------
//---------------------------------------------
//Textbox per key stroke
async function keyPressProductCategorySearch(){
    var name = document.getElementById("txtsearchProductCategory").value;
    
    if(name == ''){
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            };
        
        const response = await fetch('/searchAllProductCategory', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allProductCategory");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
    else{
        var data = { name };
        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
        
        const response = await fetch('/searchSpecificProductCategory', options);
        const dataStream = await response.json();

        var selectBox = document.getElementById("allProductCategory");
        while(selectBox.options.length > 0){ selectBox.remove(0); }

        dataStream.forEach(obj => {
            Object.entries(obj).forEach(([key, value]) => {
                if(key == 'name') {
                    var option = document.createElement("option");
                    option.text = value;
                    option.value = value;
                    selectBox.add(option);
                }
            });
        });
    }
}

//Refresh Select Product Category

async function fillProductCategory() {
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        };

    const response = await fetch('/searchAllProductCategory', options);
    const dataStream = await response.json();
    return dataStream;
}

async function refreshMainProductCategory(){
    const dataStream = await fillProductCategory();
    var selectBox = document.getElementById("productCategoryList");
    while(selectBox.options.length > 0){ selectBox.remove(0); }
    
    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });

    document.getElementById("allProductCategory").value = '';
    document.getElementById("productCategory").value = '';
    productCategoryState.state = 'add';
    productCategoryState.toEdit = '';

    document.getElementById("productCategory").style.color = 'black'
    document.getElementById("addProductCategory").style.display = 'none'
    document.getElementById("editProductCategory").style.display = 'block'
    document.getElementById("deleteProductCategory").style.display = 'block'
}

// document.getElementById("addProductCategoryToDatabase").onclick = function (){refreshProductCategory()};
async function refreshProductCategory(){
    console.log('clicked')
    const dataStream = await fillProductCategory();
    var selectBox = document.getElementById("allProductCategory");
    while(selectBox.options.length > 0){ selectBox.remove(0); }

    dataStream.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if(key == 'name') {
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                selectBox.add(option);
            }
        });
    });

    var toggle = document.getElementById("productCategoryHidden");
    if(toggle.style.display == "none") toggle.style.display = "block";
    else toggle.style.display = "none";
}

//Add Product Category
document.getElementById("addProductCategory").onclick = function() {refreshMainProductCategory()};

async function addProductTypeToDatabase() {
        var name = document.getElementById("productCategory").value;
        var isDeleted = false;

        if(name == '') {
            alert('Empty Fields: \nKindly fill all the needed informations.')
            return;
        }

    if(productCategoryState.state == 'add'){
        var data = {name, isDeleted};

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data)
            };
    
        const response = await fetch('/addProductCategory', options);
        const dataStream = await response.json();
        if(await dataStream.message == 'duplicate'){
            document.getElementById("productCategory").value = ""; 
            return alert('Duplicate Product Category: \nThis Product Category already exists. Kindly enter a new Product Category');
        }

    }
    else if(productCategoryState.state == 'edit'){
        var oldName = productCategoryState.toEdit;
        var data = {name, oldName, isDeleted};

        const options =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
            body: JSON.stringify(data, productCategoryState.toEdit)
            };

        const response = await fetch('/editProductCategory', options);
        const dataStream = await response.json();
        if(await dataStream.message == 'duplicate'){
            document.getElementById("productCategory").value = ""; 
            return alert('Duplicate Product Category: \nThis Product Category already exists. Kindly enter a new Product Category');
        }
    }

    refreshProductCategory();
    refreshMainProductCategory();
}

//Edit Product Category
document.getElementById("editProductCategory").onclick = function() {editProductType()};
async function editProductType() {
    var name = document.getElementById("allProductCategory").value;
    if(name == '') alert('No selected product category: \nPlease select a Product Category')
    else {
        productCategoryState.state = 'edit';
        productCategoryState.toEdit = name;
        document.getElementById("productCategory").style.color = 'blue'
        document.getElementById("addProductCategory").style.display = 'block'
        document.getElementById("editProductCategory").style.display = 'none'
        document.getElementById("deleteProductCategory").style.display = 'block'
        
        document.getElementById("productCategory").value = name;
    }
}

//delete Product Category
document.getElementById("deleteProductCategory").onclick = function() {deleteProductType()};
async function deleteProductType() {
    var name = document.getElementById("allProductCategory").value;
    if(name == '') return alert('Please select a Product Category')

    if (!confirm(`Are you sure to delete the Product Category ${name}?`)) return 

    var data = {name};
    const options =  {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, //application/x-www-form-urlencoded
        body: JSON.stringify(data)
        };

    const response = await fetch('/deleteProductCategory', options);
    const dataStream = await response.json();
    
    alert(`Product Category (${name}) Deleted`);

    refreshProductCategory();
    refreshMainProductCategory();
}

function isWholeNumber(num) {
    return Number.isInteger(parseInt(num)) && num > 0;
}