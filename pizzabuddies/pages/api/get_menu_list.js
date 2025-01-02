import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import mongoose from 'mongoose';

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {

    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");

        // extracting section id
        const { section_id } = req.query;

        // finding and mapping Menu list from Catalog
        const food_menu_list = await FoodMenu.aggregate([
            // { $unwind: "$menu_catalog.options" },
            // { $unwind: "$menu_catalog.options.values" },
            { $unwind: "$menu_catalog" },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(section_id)
                },
            },
            {
                $project: {
                    menu_title: "$menu_catalog.menu_title",
                    _id: "$menu_catalog._id",
                    createdAt: 1,
                }
            }]);

        // sending success response to client
        return res.status(200).json(food_menu_list.sort((a, b) => b.createdAt - a.createdAt));

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}