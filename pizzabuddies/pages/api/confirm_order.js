import Orders from '@/models/order_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import send_print_job from '@/utils/functions/print_order_receipt';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';

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

        const orders = new Orders(req.body);

        await orders.save();

        const response = await send_confirm_mail(res, orders);

        // const print_response = send_print_job(res, req.body);

        // if (print_response.message === "receipt_printed_successfully") {
        //     console.log("Printed successfully");
        // } else if (print_response.message === "receipt_printing_failed") {
        //     console.log("Printing failed");
        // }

        if (response.message === "mail-sent") {
            // sending success response to client
            return res.status(200).json(orders);
        }

        await Orders.findByIdAndDelete(orders._id);
        return res.status(500).json({ success: false, message: "Order couldn't be created!", print_response });

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}