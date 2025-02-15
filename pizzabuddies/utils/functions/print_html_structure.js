export const print_html_structure = (order) => {

  const {
    _id,
    email,
    special_instructions,
    firstName,
    lastName,
    address,
    phone,
    delivery_charges,
    purchase,
    total_amount,
    total_items,
    location,
    branch,
    order_method,
    createdAt,
  } = order;


  // Calculator
  const calc_total_amount = (arr) => {
    return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
  }


  const calc_gross_total_amount = (obj) => {
    if (obj.order_method === "delivery") {
      return obj.purchase.reduce((prev, next) => prev + (next.price * next.quantity), 0) + Number(obj.delivery_charges);
    }
    return obj.purchase.reduce((prev, next) => prev + (next.price * next.quantity), 0);
  }


  const date_formatter = (date) => {
    // Create a Date object
    const dateObject = new Date(date);

    // Format the date
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return dateObject.toLocaleDateString('en-US', options);
  }

  const collect_neccessary_obj = (obj) => {
    const { _id, menu_title, section_id, price, compare_price, description, quantity, menu_image, value_id, ...other } =
      obj;

    return Object.entries(other);
  };


  const _html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Receipt</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 80mm; /* Standard receipt width */
            min-height: 210mm;
            padding: 30px 10px 0px 10px;
            max-height: fit-content;
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .receipt {
            width: 100%;
        }
        .receipt h1 {
            font-size: 16px;
            text-align: center;
            margin: 0 0 10px 0;
        }
        .receipt p {
            margin: 5px 0;
            text-transform: capitalize;
        }
        .receipt .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
        }
        .receipt .total {
            font-size: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <h1>Order Receipt</h1>

        <p><strong>Order ID:</strong> #${_id}</p>
        <p><strong>Date:</strong> ${date_formatter(createdAt)}</p>

        <br/>

        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Contact:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>

        <br/>

        <p><strong>Delivery Method:</strong> ${order_method === "delivery" ? "Deliver to Address" : "Pickup"}</p>
        <p><strong>Payment Method:</strong> ${order_method === "delivery" ? "Cash on Delivery (COD)" : "Pay at Pickup (PAP)"}</p>
        ${location ? `<p><strong>Customer Location:</strong> ${location}</p>` : ``}
        <p><strong>${order_method === "delivery" ? "Delivery address" : "Pickup Address"}:</strong> ${order_method === "delivery" ? address : branch}</p>
        
        <br/>

        <div class="divider"></div>
        ${Boolean(purchase.length) ? purchase.map(item => {
    return `<p><strong>Item:</strong> ${item.menu_title}</p>
            ${Boolean(collect_neccessary_obj(item).length) ?
        collect_neccessary_obj(item).map((each, ind) => (
          `<p><strong>${each.at(0)}</strong>: ${each.at(1)}</p>`
        )).join("")
        :
        ``
      }
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Price:</strong> Rs. ${item.price}.00</p>

        <div class="divider"></div>`
  }).join(" ") : ""}
      

        ${special_instructions ? `<p><em><strong>Special instructions:</strong> ${special_instructions}</em></p>
        <div class="divider"></div>`: ``}

        <br/>

        <p class="subtotal"><strong>Subtotal:</strong> Rs. ${calc_total_amount(purchase).toLocaleString("en-US")}.00</p>
        ${order_method === "delivery" ?
      `<p class="deliveryCharges"><strong>Delivery Charges:</strong> ${delivery_charges === 0 ? "Free" : `Rs. ${delivery_charges.toLocaleString("en-US")}.00`}</p>`
      :
      ``
    }

        <p class="total"><strong>Total:</strong> Rs. ${calc_gross_total_amount(order).toLocaleString("en-US")}.00</p>
    </div>

    <p style="font-size: 0;">&#x1D564;</p> <!-- ESC/POS cut command -->
</body>
</html>
`


  return _html
}

