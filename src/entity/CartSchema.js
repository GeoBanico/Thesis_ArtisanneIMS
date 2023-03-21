const EntitySchema = require("typeorm").EntitySchema;
const Cart = require("../model/Cart").Cart;
const Customer = require("../model/Customer").Customer;
const Product = require("../model/Product").Product;
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
        productId: {
            type: "int",
            
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
            type: "datetime"
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
        products: {
            target: "Product",
            type: "many-to-one",
            joinColumn: true,
            joinTable: true,
            cascade: true
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