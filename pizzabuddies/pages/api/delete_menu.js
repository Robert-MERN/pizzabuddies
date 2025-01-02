import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { deleteImage } from '@/utils/functions/destroy_cloudinary_image';
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


        const { section_id, menu_id } = req.query;

        const menu_image = await FoodMenu.aggregate([
            { $unwind: "$menu_catalog" },
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(section_id),
                    "menu_catalog._id": new mongoose.Types.ObjectId(menu_id),
                    "menu_catalog.menu_image": { $ne: "" }
                }
            },
            {
                $project: {
                    _id: 0,
                    menu_image: "$menu_catalog.menu_image"
                }
            }
        ]);

        if (menu_image.length) {
            // Delete the menu Image
            deleteImage(menu_image[0].menu_image, { req, res });
        }

        const updatedSection = await FoodMenu.findByIdAndUpdate(
            section_id,
            { $pull: { menu_catalog: { _id: menu_id } } },
            { new: true } // Return the updated document
        );

        if (!updatedSection) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // sending success response to client
        return res.status(200).json({ success: menu_image, message: "Menu has been deleted" });
    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}