// import FoodMenu from "@/models/menu_model";
// import connect_mongo from "@/utils/functions/connect_mongo";
// import axios from "axios";

// const OLD_CLOUDINARY_URL = "https://res.cloudinary.com/dceqyrfhu/image/upload/"; // Old Cloudinary base URL
// const NEW_FOLDER = "Pizza Buddies";
// // const CLOUDINARY_API_KEY = "YOUR_API_KEY";
// // const CLOUDINARY_API_SECRET = "YOUR_API_SECRET";
// const CLOUDINARY_CLOUD_NAME = "dsr8jxsq6";

// async function uploadToNewCloudinary(url, preset) {
//     try {
//         const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
//             file: url,
//             upload_preset: preset,
//             folder: NEW_FOLDER,
//         });
//         return response.data.secure_url;
//     } catch (error) {
//         console.error("Cloudinary Upload Error:", error.response?.data || error.message);
//         return null;
//     }
// }

// export default async function handler(req, res) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ message: "Method Not Allowed" });
//     };

//     console.log("Connecting with DB");
//     await connect_mongo();
//     console.log("Successfuly connected with DB");

//     try {
//         const foodMenus = await FoodMenu.find({});
//         let updatedCount = 0;

//         for (const menu of foodMenus) {
//             let updated = false;

//             // Update banner_image
//             if (menu.banner_image?.startsWith(OLD_CLOUDINARY_URL)) {
//                 const newUrl = await uploadToNewCloudinary(menu.banner_image, "bannerUpload");
//                 if (newUrl) {
//                     menu.banner_image = newUrl;
//                     updated = true;
//                 }
//             }

//             // Update menu_catalog images
//             for (const item of menu.menu_catalog) {
//                 if (item.menu_image?.startsWith(OLD_CLOUDINARY_URL)) {
//                     const newUrl = await uploadToNewCloudinary(item.menu_image, "myCloud");
//                     if (newUrl) {
//                         item.menu_image = newUrl;
//                         updated = true;
//                     }
//                 }
//             }

//             if (updated) {
//                 await menu.save();
//                 updatedCount++;
//             }
//         }

//         res.status(200).json({ message: "Migration completed", updatedCount });
//     } catch (error) {
//         console.error("Migration Error:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// }
