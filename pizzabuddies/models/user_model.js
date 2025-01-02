import { Schema, connection } from "mongoose"

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Passwords"],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


const Db = connection.useDb("Pizzabuddies")
const Users = Db.models.Users || Db.model('Users', userSchema);
export default Users