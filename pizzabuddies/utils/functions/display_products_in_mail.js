
export const purchase_items_displayer = (orders) => {

    const collect_neccessary_obj = (obj) => {
        const { _id, menu_title, section_id, price, compare_price, description, quantity, menu_image, value_id, ...other } =
            obj;

        return Object.entries(other);
    };

    const purchase_items_html_structure = orders.purchase.map(item => {

        return `
        <tr>
    <td align="left" class="esdev-adapt-off"
        style="Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;padding-bottom:10px">
        <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
            <tr>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="center" class="es-m-p0r" style="padding:0;Margin:0;width:70px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="center" style="padding:0;Margin:0;font-size:0px">
                                        <img src=${item.menu_image}
                                            alt="" width="70" height="70" class="adapt-img"
                                            style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;object-fit:cover;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="center" style="padding:0;Margin:0;width:265px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="left" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                <strong>${item.menu_title}</strong>
                                            </p>
                                        </td>
                                    </tr>




                                    <tr>
                                        <td align="left" style="padding:0;Margin:0;padding-top:5px">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"
                                            >

                                              ${Boolean(collect_neccessary_obj(item).length) ? collect_neccessary_obj(item).map((each, ind) => (
            `${each.at(0)}: ${each.at(1)}`
        )).join(" <br> ")
                : ``
            }
                                            </p>
                                        </td>
                                    </tr>






                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                            <td align="left" style="padding:0;Margin:0;width:80px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="center" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                x ${item.quantity}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="padding:0;Margin:0;width:20px"></td>
                <td valign="top" class="esdev-mso-td" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="right" class="es-right" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                            <td align="left" style="padding:0;Margin:0;width:85px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                        <td align="right" style="padding:0;Margin:0">
                                            <p
                                                style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">
                                                Rs. ${item.price.toLocaleString("en-US")}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
        
        `
    });




    return purchase_items_html_structure.join(" ");


}



