import { Schema, connection } from "mongoose"

const ordersSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Please enter your email"]
        },
        special_instructions: {
            type: String,
        },
        firstName: {
            type: String,
            required: [true, "Please type your first name"]
        },
        lastName: {
            type: String,
            required: [true, "Please enter your Last Name"]
        },
        address: {
            type: String,
            required: [true, "Please type your complete address"]
        },
        city: {
            type: String,
            required: [true, "Please enter your City name"]
        },
        phone: {
            type: String,
            required: [true, "Please type your Phone no."]
        },
        postalCode: {
            type: String,
        },
        delivery_charges: {
            type: Number,
            default: 200,
        },
        coupon_code: {
            type: String,
        },
        purchase: {
            type: Array,
        },
        total_amount: {
            type: Number,
            required: [true, "Purchase items are missing"]
        },
        total_items: {
            type: Number,
            required: [true, "Total items value is missing"]
        },
        location: {
            type: String,
        }
    },
    { timestamps: true }
)








const Db = connection.useDb("Pizzabuddies")
const Orders = Db.models.Orders || Db.model('Orders', ordersSchema);
export default Orders