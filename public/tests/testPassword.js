const bcrypt = require('bcrypt');

async function testPassword(pass){
    const salt = await bcrypt.genSalt();
    const encryptedPass = await bcrypt.hash(pass, salt);

    return encryptedPass;
}

module.exports = testPassword;