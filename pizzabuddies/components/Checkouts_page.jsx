import React, { use, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Badge from "@mui/material/Badge";
import useStateContext from '@/context/ContextProvider';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Link from 'next/link';


const Checkouts_page = ({ axios }) => {

    const { confirm_order_api, set_API_loading, set_snackbar_alert, order_method } = useStateContext();


    const default_order_details = {
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
        delivery_charges: 200,
        purchase: [],
        total_amount: "",
        total_items: "",
        coupon_code: "",
        special_instructions: "",
        location: "",
        errors: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            phone: "",
        }
    }
    const [order_details, set_order_details] = useState(default_order_details);

    const handleChange = (event) => {
        const { name, value } = event.target;
        set_order_details((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'email':
                if (!value) {
                    error = 'Please enter an email';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'firstName':
                if (!value) {
                    error = 'Please enter your first name';
                }
                break;
            case 'lastName':
                if (!value) {
                    error = 'Please enter your last name';
                }
                break;
            case 'address':
                if (!value && order_method.order_method === "delivery") {
                    error = 'Please enter your address';
                }
                break;
            case 'phone':
                if (!value) {
                    error = 'Please enter your phone';
                } else if (!/^(?:(?:\+92|0092|92|0)?3\d{9})$/.test(value)) {
                    error = 'Please enter a valid phone number';
                }
                if (value.trim().includes("03102223511")) {
                    error = 'Please enter your phone number';
                }
                break;
            case 'purchase':
                if (!value.length) {
                    set_snackbar_alert({
                        open: true,
                        message: "Cart doesn't exist",
                        severity: "error"
                    })
                }
                break;
            default:
                break;
        }
        return error;
    }




    // Retreiving cart and other information from the local storage
    useEffect(() => {
        const info = JSON.parse(localStorage.getItem("info"));
        const cart = JSON.parse(localStorage.getItem("cart"));
        const location = JSON.parse(localStorage.getItem("location"));
        if (info) {
            set_order_details(prev => ({ ...prev, ...info }));
        }
        if (cart) {
            set_order_details(prev => ({ ...prev, purchase: cart }));
        }
        if (location) {
            set_order_details(prev => ({ ...prev, location }));
        }
    }, []);


    // Calculator
    const calc_total_amount = (arr) => {
        return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
    }

    const calc_total_items = (arr) => {
        return arr.reduce((prev, next) => prev + next.quantity, 0);
    }

    const calc_gross_total_amount = (arr) => {
        if (order_method.order_method === "delivery") {
            return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0) + Number(order_details.delivery_charges);
        }
        return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
    }

    const collect_neccessary_obj = (obj) => {
        const { _id, menu_title, section_id, price, compare_price, description, quantity, menu_image, value_id, ...other } = obj;

        return Object.entries(other);
    };



    const handle_submit = (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(order_details).forEach((fieldName) => {
            const error = validateField(fieldName, order_details[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });
        set_order_details((prevState) => ({
            ...prevState,
            errors,
        }));
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { errors, purchase, ...other } = order_details;
            const data_body = {
                ...other,
                ...order_method,
                purchase,
                total_amount: calc_total_amount(purchase),
                total_items: calc_total_items(purchase),
            }

            confirm_order_api(axios, data_body, set_API_loading);
        }
    }




    // Styling MUI Components
    useEffect(() => {
        if (document.querySelector(".MuiCheckbox-root")) {
            document.querySelector(".MuiCheckbox-root").style = "color: #292524";
        }

        if (document.querySelectorAll(".MuiBadge-colorInfo")) {
            document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: rgb(120 113 108)");
        }

    }, []);

    const style_textfield = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgb(214 211 209)', // Default border color
            },
            '&:hover fieldset': {
                borderColor: 'black', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'black', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'black', // Focused label color
        },
    };

    const style_textfield_2 = {
        '& .MuiOutlinedInput-root': {
            cursor: "default",
            '& fieldset': {
                borderColor: 'rgb(68 64 60)', // Default border color
                borderWidth: "2px",
            },
            '&:hover fieldset': {
                borderColor: 'rgb(68 64 60)', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgb(68 64 60)', // Focused border color
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'rgb(68 64 60)', // Focused label color
        },
    };


    return (
        <div className='w-full px-[20px] flex flex-col lg:flex-row mb-[50px] lg:mb-0'>

            {/* Main Content Section */}
            {Boolean(order_details.purchase.length) ?
                <>
                    <form onSubmit={handle_submit} className="flex-[1] md:px-[40px] py-[40px] flex flex-col gap-4 lg:border-r border-stone-200">
                        <h1 className='text-[17px] font-bold'>Contact</h1>

                        <TextField
                            label="Email"
                            variant="outlined"
                            className='w-full'
                            name="email"
                            onChange={handleChange}
                            error={Boolean(order_details.errors.email)}
                            helperText={order_details.errors.email}
                            sx={style_textfield}
                        />

                        <h1 className='text-[17px] font-bold pt-4'>Delivery</h1>

                        <div className='flex flex-col md:flex-row gap-4 md:gap-3'>
                            <TextField
                                label="First name"
                                variant="outlined"
                                className='w-full'
                                name="firstName"
                                onChange={handleChange}
                                error={Boolean(order_details.errors.firstName)}
                                helperText={order_details.errors.firstName}
                                sx={style_textfield}
                            />
                            <TextField
                                label="Last name"
                                variant="outlined"
                                className='w-full'
                                name="lastName"
                                onChange={handleChange}
                                error={Boolean(order_details.errors.lastName)}
                                helperText={order_details.errors.lastName}
                                sx={style_textfield}
                            />
                        </div>

                        {order_method.order_method === "delivery" &&
                            <TextField
                                label="Address"
                                variant="outlined"
                                className='w-full'
                                name="address"
                                onChange={handleChange}
                                error={Boolean(order_details.errors.address)}
                                helperText={order_details.errors.address}
                                sx={style_textfield}
                            />
                        }

                        <TextField
                            label="Phone"
                            variant="outlined"
                            className='w-full'
                            name="phone"
                            placeholder='0310 2223511'
                            onChange={handleChange}
                            error={Boolean(order_details.errors.phone)}
                            helperText={order_details.errors.phone}
                            sx={style_textfield}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment
                                        position="end"
                                        className='text-stone-800 cursor-pointer'
                                    >
                                        <Tooltip
                                            title="In case we need to contact you about your order"
                                            placement="top"
                                            arrow
                                            componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        backgroundColor: 'black',
                                                        color: 'white', // Text color
                                                        fontSize: '12px', // Adjust text size
                                                        padding: '10px', // Optional: adjust padding
                                                        width: '150px',
                                                        textAlign: 'center'
                                                    },
                                                },
                                            }}
                                        >
                                            <HelpOutlineIcon />
                                        </Tooltip>
                                    </InputAdornment>,
                                },
                            }}
                        />

                        <div className='w-full flex items-center text-[14px] md:text-[16px] font-medium text-stone-900'>
                            <Checkbox />
                            <p>Save this information for next time</p>
                        </div>

                        <h1 className='text-[17px] font-bold'>Delivery method</h1>
                        <TextField
                            value={order_method.order_method === "delivery" ? "Delivery Charges" : "Pickup"}
                            variant="outlined"
                            className='w-full cursor-pointer'
                            sx={style_textfield_2}
                            inputProps={{
                                readOnly: true, // Read-only input
                                style: { cursor: "default" }, // Ensure pointer style is applied to the input element
                            }}
                            InputProps={{
                                endAdornment: order_method.order_method === "delivery" ? <InputAdornment position="end" className='text-stone-800'>Rs. 200.00</InputAdornment> : <></>,
                            }}
                        />

                        <h1 className='text-[17px] font-bold pt-4'>Payment</h1>
                        <TextField
                            value={order_method.order_method === "delivery" ? "Cash on Delivery (COD)" : "Pay at Pickup (PAP)"}
                            variant="outlined"
                            className='w-full cursor-pointer'
                            sx={style_textfield_2}
                            inputProps={{
                                readOnly: true, // Read-only input
                                style: { cursor: "default" }, // Ensure pointer style is applied to the input element
                            }}
                        />

                        {/* Complete Order Button */}
                        <button type='submit' className='w-full py-[16px] flex justify-center items-center text-white bg-stone-950 font-semibold text-[14px] md:text-[15px] hover:bg-white hover:text-stone-950 border border-stone-500 transition-all duration-300 rounded mt-6 lg:mb-20 active:scale-[.98]'>
                            COMPLETE ORDER
                        </button>
                    </form>

                    {/* Sticky Sidebar Order Information */}
                    <div className="flex-[1]">
                        <div className="sticky top-0 md:px-[40px] py-[40px] flex flex-col gap-2">
                            {/* Product price */}
                            {order_details.purchase.map((item) => (
                                <div
                                    key={item._id}
                                    className="w-full border-stone-300 flex items-center justify-between my-1"
                                >
                                    <div className="flex gap-5">
                                        <div className='mt-2'>

                                            <Badge
                                                badgeContent={item.quantity}
                                                color="info"
                                                showZero
                                            >
                                                <div className="w-[65px] h-[65px] overflow-hidden border border-stone-300 shadow grid place-items-center rounded-md">
                                                    <img
                                                        alt="product"
                                                        src={item.menu_image}
                                                        className="w-[65px] h-[65px] object-cover"
                                                    />
                                                </div>
                                            </Badge>
                                        </div>

                                        <div className="text-stone-950 text-[14px] font-semibold">
                                            <p>{item.menu_title}</p>
                                            {Boolean(collect_neccessary_obj(item).length) && collect_neccessary_obj(item).map((each, ind) => (
                                                <p key={ind} className="text-gray-600 font-normal">{each.at(0)}: {each.at(1)}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-950">
                                        Rs. {item.price.toLocaleString("en-US")}
                                    </p>
                                </div>
                            ))}


                            {/* Subtotal of Order */}
                            <div className="w-full mt-6 border-stone-300 flex items-center justify-between ">
                                <p className="text-[14px] md:text-[16px] font-medium text-black">
                                    Subtotal {(calc_total_items(order_details.purchase) > 1) && `• ${calc_total_items(order_details.purchase)}  items`}
                                </p>
                                <p className="text-[15px] md:text-[17px] font-medium text-stone-950">
                                    Rs. {calc_total_amount(order_details.purchase).toLocaleString("en-US")}
                                </p>
                            </div>

                            {/* Shipping Cost */}
                            {order_method.order_method === "delivery" &&
                                <div className="w-full border-stone-300 flex items-center justify-between">
                                    <p className="text-[14px] md:text-[16px] font-medium text-black">
                                        Delivery Charges
                                    </p>
                                    <p className="text-[15px] md:text-[17px] font-medium text-stone-950">
                                        Rs. {(order_details.delivery_charges.toLocaleString("en-US"))}
                                    </p>
                                </div>
                            }


                            {/* Total */}
                            <div className="w-full border-stone-300 flex items-center justify-between mt-6">
                                <p className="text-[18px] md:text-[20px] font-bold text-black">TOTAL:</p>
                                <p className="text-[18px] md:text-[20px] font-bold text-stone-950">
                                    <span className='text-[13px] md:text-[14px] text-gray-600 font-normal pr-[6px]'>PKR</span>
                                    Rs. {calc_gross_total_amount(order_details.purchase).toLocaleString("en-US")}
                                </p>
                            </div>

                        </div>
                    </div>
                </>
                :
                <div className="w-full h-[70vh] flex flex-col justify-center items-center">

                    <h1 className='text-[16px] md:text-[18px] text-stone-500 uppercase text-center'>
                        YOU HAVE NOT SELECTED ANY ITEM TO CHECKOUT
                    </h1>

                    <div className='my-[30px] w-full flex justify-center items-center'>
                        <Link href="/" >
                            <button className='w-full py-[12px] text-white bg-rose-600 font-semibold text-[14px] md:text-[15px] transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center'>
                                <ShoppingCartCheckoutIcon className='text-[19px]' />  CONTINUE ORDERING
                            </button>
                        </Link>
                    </div>
                </div>
            }
        </div>
    )
}

export default Checkouts_page