// const testPassword = require('./testPassword')

// test('Test Password Encryption', async () => {
//     const test = ["password1", "destiny123", "qwerty0987"];
    
//     for (let i = 0; i < test.length; i++) {
//         var pass = await testPassword(test[i]);
//         expect(pass).not.toBe(test[i]);
//     }   

//     return
// })

// const testUserType = require('./testUserType')

// test('Exisiting Employee with Owner UserType base on CustomerId', async () => {
//     const customerId = 3; //Currently Owner
    
//     var userType = await testUserType(customerId);
//     expect(userType).toBe("Owner");

//     return
// })

// test('Non-existing user', async () => {
//     const customerId = 1; //Currently Owner
    
//     var userType = await testUserType(customerId);
//     expect(userType).not.toBe("Owner");

//     return
// })

const testProductQuantity = require('./testProductQuantity')

test('Product Quantity Check with User Order Quantity greater than Store Quantity', async () => {
    const name = "Sunblock SPF 35";
    const userQuantity = 5; //Currently Owner
    expect(await testProductQuantity(name)).toBeGreaterThan(userQuantity);

    return
})

test('Product Quantity Check with User Order Quantity equal or less than Store Quantity', async () => {
    const name = "Sunblock SPF 35";
    const userQuantity = 10; //Currently Owner
    expect(await testProductQuantity(name)).toBeLessThanOrEqual(userQuantity);

    return
})


