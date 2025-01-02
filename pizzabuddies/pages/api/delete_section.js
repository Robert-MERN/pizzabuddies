import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { deleteImage, deleteImages } from '@/utils/functions/destroy_cloudinary_image';


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

        const bannerImage = await FoodMenu.findById(section_id).select("banner_image");
        if (bannerImage.banner_image) {
            await deleteImage(bannerImage.banner_image, { req, res })
        }

        const menuImages = await FoodMenu.aggregate([
            { $unwind: "$menu_catalog" },
            { $match: { $and: [{ "menu_catalog.menu_image": { $ne: "" } }, { "menu_catalog.menu_image": { $ne: null } }] } },
            {
                $project: {
                    menu_image: "$menu_catalog.menu_image",
                    _id: 0
                }
            }
        ]);

        if (menuImages.length) {
            await deleteImages(menuImages, { req, res });
        }

        // finding in Catalog and deleting
        await FoodMenu.findByIdAndDelete(section_id);

        // sending success response to client
        return res.status(200).json({ success: true, message: "Section has been deleted" });

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}