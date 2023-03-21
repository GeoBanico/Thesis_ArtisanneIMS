const config = {
    user: "banico",
    password: "Destiny@1222",
    server: "banico-server.database.windows.net",
    database: "Artisanne",
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
  };

  module.exports = config;

// import {createConnection} from "typeorm"
// const main = async() => {
//     try {
//         await createConnection({
//             user: "banico",
//             password: "Destiny@1222",
//             server: "banico-server.database.windows.net",
//             database: "Artisanne",
//             authentication: {
//                 type: 'default'
//             },
//             options: {
//                 encrypt: true
//             }
//         })
//         console.log('DB Connected')
//     } catch (error) {
//         console.log('DB not connected')
//     }
    
// }