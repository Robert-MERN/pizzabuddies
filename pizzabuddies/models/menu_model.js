import { Schema, connection } from "mongoose"

const foodMenuSchema = new Schema(
    {
        section_title: {
            type: String,
            required: [true, "Please enter the Section title"]
        },
        banner_image: String,
        menu_catalog: [
            {
                menu_title: String,
                menu_image: String,
                price: {
                    type: Number,
                    default: 0,
                },
                compare_price: {
                    type: Number,
                    default: 0,
                },
                description: String,
                options: [
                    {
                        option_name: String,
                        values: [
                            {
                                option_value: String,
                                option_price: {
                                    type: Number,
                                    default: 0,
                                },
                                option_compare_price: {
                                    type: Number,
                                    default: 0,
                                },
                                values_error: String,
                            },
                        ],
                        options_selectable: {
                            type: Boolean,
                            default: false,
                        },
                        options_optional: {
                            type: Boolean,
                            default: false,
                        },
                        is_added: {
                            type: Boolean,
                            default: false,
                        },
                        option_error: String,
                    }
                ]

            }
        ]
    }, { timestamps: true });


const Db = connection.useDb("Pizzabuddies")
const FoodMenu = Db.models.FoodMenu || Db.model('FoodMenu', foodMenuSchema);
export default FoodMenu