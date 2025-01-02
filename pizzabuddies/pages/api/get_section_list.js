import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';

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


        // finding and mapping Section list from Catalog
        const food_section_list = await FoodMenu.aggregate([{
            $project: {
                section_title: 1,
                _id: 1,
                createdAt: 1,
            }
        }]);

        // sending success response to client
        return res.status(200).json(food_section_list.sort((a, b) => b.createdAt - a.createdAt));

    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

}