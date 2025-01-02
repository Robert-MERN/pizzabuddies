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

        // Collecting Food menu and putting it into a Schema pattern (Data Base)
        const { section_title, banner_image, ...other } = req.body;
        const food_menu = { section_title, banner_image, menu_catalog: [other] }

        // saving new menu
        const FOOD_MENU = new FoodMenu(food_menu);
        await FOOD_MENU.save();


        // sending success response to client
        return res.status(200).json({ success: true, message: "Menu has been saved in new section" });

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}