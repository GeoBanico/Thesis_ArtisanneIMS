const EntitySchema = require("typeorm").EntitySchema;
const Cart = require("../model/Cart").Cart;
const CartProduct = require("../model/CartProduct").CartProduct;
const DeliveryStatus = require("../model/DeliveryStatus").DeliveryStatus;

module.exports = new EntitySchema({
    name: "CartProduct",
    target: CartProduct,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        boughtquantity: {
            type: "int",
            nullable: true,
        },
        productId: {
            type: "int",
        },
        cartId: {
            type: "int",
        }
    },
    relations: {
        carts: {
            target: "Cart",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        products: {
            target: "Product",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});