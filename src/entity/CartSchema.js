const EntitySchema = require("typeorm").EntitySchema;
const Cart = require("../model/Cart").Cart;
const Customer = require("../model/Customer").Customer;
const CartProduct = require("../model/CartProduct").CartProduct;
const DeliveryStatus = require("../model/DeliveryStatus").DeliveryStatus;

module.exports = new EntitySchema({
    name: "Cart",
    target: Cart,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        customerId: {
            type: "int"
        },
        cartProductId: {
            type: "int",
            nullable: true
        },
        deliveryStatusId: {
            type: "int",
        },
        orderNumber: {
            type: "nvarchar"
        },
        dateOrdered: {
            type: "datetime"
        },
        dateDelivered: {
            type: "datetime",
            nullable: true
        },
        isDeleted: {
            type: "bit"
        }
    },
    relations: {
        customers: {
            target: "Customer",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        },
        cartProducts: {
            target: "CartProduct",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true,
            nullable: true
        },
        deliveryStatuses: {
            target: "DeliveryStatus",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
        }
    }
});