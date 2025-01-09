import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import mongoose from 'mongoose';
import { deleteImage } from '@/utils/functions/destroy_cloudinary_image';

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

        const { menu_image } = req.body;

        // Finding Menu
        const MENU = await FoodMenu.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(section_id),
                    "menu_catalog._id": new mongoose.Types.ObjectId(menu_id),
                },
            },
            {
                $unwind: "$menu_catalog", // Flatten the array
            },
            {
                $match: {
                    "menu_catalog._id": new mongoose.Types.ObjectId(menu_id), // Match the specific menu item
                },
            },
            {
                $project: {
                    _id: 0,
                    menu_image: "$menu_catalog.menu_image",
                },
            },
        ]);


        if (MENU.length) {
            const menuImage = MENU[0];

            if (
                (menuImage.menu_image && !menu_image)
                ||
                ((menuImage.menu_image !== menu_image) && (menuImage.menu_image && menu_image))
            ) {
                await deleteImage(menuImage.menu_image, { req, res });
            };

        }


        const updatedSection = await FoodMenu.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(section_id),
                "menu_catalog._id": new mongoose.Types.ObjectId(menu_id)
            },
            { $set: { "menu_catalog.$": req.body } },
            { new: true } // Return the updated document
        );

        // If Menu or Section wasn't found
        if (!updatedSection) {
            return res.status(404).json({ success: false, message: "Menu or Section not found" });
        }

        // sending success response to client
        return res.status(200).json({ success: true, message: "Menu has been updated" });


    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}