import FoodMenu from '@/models/menu_model';
import connect_mongo from '@/utils/functions/connect_mongo';
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


        const { section_id } = req.query;
        const { banner_image } = req.body;

        const bannerImage = await FoodMenu.findById(section_id);

        if (
            (bannerImage.banner_image && !banner_image)
            ||
            ((bannerImage.banner_image !== banner_image) && (bannerImage.banner_image && banner_image))
        ) {
            await deleteImage(bannerImage.banner_image, { req, res });
        };

        // finding in Catalog and updating
        await FoodMenu.findByIdAndUpdate(section_id, req.body);


        // sending success response to client
        return res.status(200).json({ success: true, message: "Section has been updated" });

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}