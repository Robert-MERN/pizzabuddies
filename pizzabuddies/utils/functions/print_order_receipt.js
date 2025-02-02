import axios from "axios";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer"; // Use Puppeteer for HTML to PDF conversion
import cloudinary from 'cloudinary';
import { print_html_structure } from "./print_html_structure";


// Cloudinary Config
cloudinary.v2.config({
    cloud_name: 'dceqyrfhu',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Print Node Config
const PRINTNODE_API_KEY = process.env.PRINTNODE_API_KEY;
const PRINTER_ID = 74040508; // Retrieve this from the PrintNode dashboard

/**
 * Convert HTML to PDF and return the Base64-encoded content
 * @param {string} htmlContent - The HTML content to convert
 * @returns {Promise<string>} Base64-encoded PDF
 */
// PDF Converter Function
export const generatePdfBuffer = async (htmlContent) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these flags
    });
    const page = await browser.newPage();

    // Manually define mobile device metrics (e.g., iPhone X)
    const mobileMetrics = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375, // iPhone X width
            height: 812, // iPhone X height
            deviceScaleFactor: 3, // Retina display
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    };

    // Emulate the mobile device
    await page.setUserAgent(mobileMetrics.userAgent);
    await page.setViewport(mobileMetrics.viewport);

    // Load HTML into the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Calculate the height of the body content, including margins and padding
    const height = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;

        // Get the full height of the body, including margins and padding
        const bodyHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );

        // Get computed styles to include margins and padding
        const styles = window.getComputedStyle(body);
        const marginTop = parseFloat(styles.marginTop);
        const marginBottom = parseFloat(styles.marginBottom);
        const paddingTop = parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);

        // Add margins and padding to the body height
        return bodyHeight + marginTop + marginBottom + paddingTop + paddingBottom;
    });

    // Generate PDF with dynamic height
    const pdfBuffer = await page.pdf({
        width: '227px', // Fixed width (as per your requirement)
        height: `${height}px`, // Dynamic height based on the content
        printBackground: true,
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
    });

    await browser.close();

    // Ensure the 'output' folder exists
    const outputDir = path.resolve(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true }); // Create directory if it doesn't exist
    }

    // Save PDF locally for verification
    const outputPath = path.resolve(outputDir, "OrderReceipt.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);

    // Return the PDF
    return pdfBuffer;
};


// Upload PDF to Cloudinary Function
const uploadPDFToCloudinary = async (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
            { resource_type: 'raw', format: 'pdf' },
            (error, result) => {
                if (error) {
                    console.error('Error in uploadPDFToCloudinary:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(pdfBuffer);
    });
}

/**
 * Send a print job to PrintNode
 * @param {Object} res - Response object (if needed for further processing)
 * @param {Object} orders - Order details to include in the printed receipt
 * @returns {Object} Result of the print job submission
 */
const sendPrintJob = async (res, orders) => {
    let pdf_secure_url;
    try {
        // Generate PDF content in Base64 format
        const pdfBufferContent = await generatePdfBuffer(print_html_structure(orders));
        pdf_secure_url = await uploadPDFToCloudinary(pdfBufferContent);

        console.log("url", pdf_secure_url);


        // Send print job to PrintNode
        const response = await axios.post(
            "https://api.printnode.com/printjobs",
            {
                printer: PRINTER_ID,
                title: "Order Receipt",
                contentType: "pdf_uri",
                content: pdf_secure_url,
            },
            {
                auth: {
                    username: PRINTNODE_API_KEY,
                    password: "",
                },
            }
        );
        console.log("Print job submitted successfully:", response.data);

        const publicId = pdf_secure_url
            .split('/upload/')[1] // Get everything after "upload/"
            .replace(/^v\d+\//, '') // Remove version identifiers like "v1735781118/"
            .split('.')[0] // Remove the file extension
            .replace(/%20/g, ' '); // Decode any URL-encoded spaces

        // Call the Cloudinary API to delete the image
        await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });

        // Return success response
        return {
            success: true,
            message: "receipt_printed_successfully",
        };
    } catch (err) {
        console.error("Error submitting print job:", err.response?.data?.message || err.message);

        const publicId = pdf_secure_url
            .split('/upload/')[1] // Get everything after "upload/"
            .replace(/^v\d+\//, '') // Remove version identifiers like "v1735781118/"
            .split('.')[0] // Remove the file extension
            .replace(/%20/g, ' '); // Decode any URL-encoded spaces

        // Call the Cloudinary API to delete the image
        await cloudinary.v2.uploader.destroy(publicId, { resource_type: "raw" });

        // Return failure response
        return {
            success: false,
            message: "receipt_printing_failed",
        };
    }
};


export default sendPrintJob;
