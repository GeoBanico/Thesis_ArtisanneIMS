const EntitySchema = require("typeorm").EntitySchema;
const ReceiptDesc = require("../model/ReceiptDesc").ReceiptDesc;
const Receipt = require("../model/Receipt").Receipt;

module.exports = new EntitySchema({
    name: "ReceiptDesc",
    target: ReceiptDesc,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        receiptId: {
            type: "int",
        },
        type: {
            type: "nvarchar"
        }
    },
    relations: {
        receipts: {
            target: "Receipt",
            type: "one-to-many",
            joinColumn: true,
            joinTable: true,
            cascade: true,
            nullable: true
        },
    }
});