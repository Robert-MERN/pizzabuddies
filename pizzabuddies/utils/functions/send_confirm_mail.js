import nodemailer from "nodemailer";
import { mail_html_structure } from "./mail_html_structure";
import { print_html_structure } from "./print_html_structure";
import { generatePdfBuffer } from "./print_order_receipt";



export default async function send_confirm_mail(res, orders) {


    try {

        // Generate PDF from the print HTML structure
        const pdfBuffer = await generatePdfBuffer(print_html_structure(orders));

        
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
        
        const mailOptions_order_receipt = {
            from: `Pizza Buddies <info@pizzabuddies.shop>`,
            to: "info@pizzabuddies.shop",
            subject: `ORDER CONFIRMED #${orders._id}`,
            html: mail_html_structure(orders),
            attachments: [
                {
                    filename: `Order_Receipt_${orders._id}.pdf`, // Name of the PDF file
                    content: pdfBuffer, // PDF buffer
                    contentType: 'application/pdf', // MIME type for PDF
                },
            ],
        };

        await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: orders.email });
        // Order Receipt
        await transport.sendMail(mailOptions_order_receipt);


        return { success: true, message: "mail-sent" };
    } catch (err) {
        return res.status(501).json({ status: false, message: err.message });
    }

}

