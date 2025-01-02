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

        const { section_id } = req.query;

        // finding in Catalog
        const food_menu = await FoodMenu.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(section_id) },
            },

            {
                $project: {
                    _id: 1,
                    section_title: 1,
                    banner_image: 1,
                },
            },
        ]);

        // sending success response to client
        return res.status(200).json(food_menu[0]);

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}