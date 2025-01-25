import nodemailer from "nodemailer";
import { mail_html_structure } from "./mail_html_structure";



export default async function send_confirm_mail(res, orders) {


    try {

        const transport = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
                user: 'info@pizzabuddies.shop',
                pass: 'pizzabuddies@123'
            },
        });
        const mailOptions = {
            from: `Pizza Buddies <info@pizzabuddies.shop>`,
            to: "info@pizzabuddies.shop",
            subject: `ORDER CONFIRMED #${orders._id}`,
            html: mail_html_structure(orders)
        };

        await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: orders.email });

        return { success: true, message: "mail-sent" };
    } catch (err) {
        return res.status(501).json({ status: false, message: err.message });
    }

}

