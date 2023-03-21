const EntitySchema = require("typeorm").EntitySchema;
const DeliveryStatus = require("../model/DeliveryStatus").DeliveryStatus;

module.exports = new EntitySchema({
    name: "DeliveryStatus",
    target: DeliveryStatus,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        type: {
            type: "nvarchar"
        },
        isDeleted: {
            type: "bit"
        }
    }
});