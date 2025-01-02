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

        const { section_id } = req.query;

        const updatedMenu = await FoodMenu.findByIdAndUpdate(
            section_id,
            { $push: { menu_catalog: req.body } },
            { new: true } // Return the updated document
        );

        if (!updatedMenu) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // sending success response to client
        return res.status(200).json({ success: true, message: "Menu has been saved" });
    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}