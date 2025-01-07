import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import { IoClose } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import Checkbox from '@mui/material/Checkbox';
import { MdVerifiedUser } from "react-icons/md";
import useStateContext from '@/context/ContextProvider';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useRouter } from 'next/router';


const Cart_page = () => {

    const router = useRouter();
    const {
        cart,
        sum_of_cart,
        delete_item_from_cart,
        add_item_to_cart,
        substract_item_from_cart
    } = useStateContext()

    const [form, set_form] = useState({
        special_instructions: "",
        coupon_code: "",
    });

    useEffect(() => {
        if (cart.length) document.querySelector(".MuiCheckbox-root").style = "color: #292524"
    }, [cart.length]);



    const neccessary_obj = (obj) => {
        const { _id, menu_title, section_id, price, compare_price, description, quantity, menu_image, value_id, ...other } = obj;

        return Object.entries(other);
    };

    const handle_input_change = (e) => {
        const { value, name } = e.target;
        set_form(prev => ({ ...prev, [name]: value }))
    }


    const navigate_to_checkout = () => {
        localStorage.setItem("info", JSON.stringify(form));
        router.push({
            pathname: "/checkouts",
        });
    }


    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] mb-[150px] tracking-wider'>

            {/* Breadcrumbs */}
            <Breadcrumbs className='text-gray-400 text-[13px] md:text-[15px]' separator={<NavigateNextIcon fontSize="small" />} >
                <Link
                    className='hover:underline active:text-gray-600'
                    underline="hover"
                    color="inherit"
                    href="/"
                >
                    Home
                </Link>
                <p>
                    Your Cart
                </p>
            </Breadcrumbs>

            <h1 className='text-[19px] md:text-[24px] mt-2'>YOUR CART</h1>

            {Boolean(cart.length) ?

                <>
                    <div className='w-full flex flex-col xl:flex-row gap-6 mt-[15px] md:mt-[25px]' >

                        {/* Product Information Section */}
                        <div className='flex flex-col flex-[3]' >

                            {/* Headings */}
                            <div className='bg-[#F7F7F7] w-full h-[40px] md:h-[50px] px-[20px] flex items-center justify-between text-[15px] md:text-[17px] font-semibold text-stone-700 rounded-md tracking-wider' >
                                <div className='flex w-full items-center'>
                                    <p>ITEM</p>
                                </div>
                                <div className='flex w-full justify-end items-center gap-16' >
                                    <p>PRICE</p>
                                    <p className='hidden md:block' >QUANTITY</p>
                                    <p className='hidden md:block'>TOTAL</p>
                                    <button className='opacity-0 hidden md:block' >
                                        <IoClose className='text-stone-700 scale-[1.3]' />
                                    </button>
                                </div>
                            </div>

                            {/* Cart Product(s)  */}
                            {cart.map((item, index) => (

                                <div key={index} className='w-full flex px-[20px] items-center justify-between border border-stone-200 py-[10px] md:py-[25px] mt-[10px] min-h-[150px] sm:min-h-[170px] rounded-md'>

                                    {/* Product info */}
                                    <div className='flex w-full h-full gap-4' >
                                        <div className='w-[80px] sm:w-[120px] h-full object-contain rounded-md overflow-hidden'>
                                            <img src={item.menu_image} alt="product" className='w-[80px] sm:w-[120px] h-full object-cover rounded-md' />
                                        </div>
                                        <div className='flex flex-col gap-1 text-[12px] sm:text-[14px] md:text-[17px]' >
                                            <p className='capitalize text-wrap overflow-hidden text-ellipsis line-clamp-1'>{item.menu_title}</p>

                                            {Boolean(neccessary_obj(item).length) && neccessary_obj(item).map((each, ind) => (
                                                <p key={ind} className='capitalize text-ellipsis text-nowrap max-w-[140px] md:max-w-[200px] xl:max-w-[400px]  overflow-hidden text-stone-500 text-[11px] sm:text-[14px] xl:text-[16px]'>
                                                    {each.at(0)}:   {each.at(1)}
                                                </p>
                                            ))}

                                            {/* Qunatity Selector for Mobile media (Responsive) */}
                                            <div className='flex sm:hidden gap-2 sm:gap-4 text-[17px] text-stone-800 font-medium mt-2 select-none'>
                                                {/* Quantity Selector button */}
                                                <div className='px-[5px] sm:px-[6px] py-[6px] sm:py-[8px] md:py-[10px] flex gap-3 sm:gap-5 md:gap-6 items-center border border-stone-500 text-stone-700 rounded-md'>
                                                    <button
                                                        onClick={() => substract_item_from_cart(item)} className='active:opacity-60'
                                                    >
                                                        <FaMinus className='text-[11px] sm:text-[12px] md:text-[14px]' />
                                                    </button>
                                                    <p className='text-[12px] sm:text-[15px] md:text-[16px] overflow-hidden text-ellipsis line-clamp-1' >
                                                        {item.quantity}
                                                    </p>
                                                    <button
                                                        onClick={() => add_item_to_cart(item)}
                                                        className='active:opacity-60'
                                                    >
                                                        <IoMdAdd className='text-[13px] sm:text-[15px] md:text-[17px]' />
                                                    </button>
                                                </div>
                                                {/* Remove from the cart button */}
                                                <button
                                                    onClick={() => delete_item_from_cart(item)}
                                                    className='active:opacity-60'
                                                >
                                                    <IoClose className='text-stone-700 sm:scale-[1.3]' />
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Price & Quantity */}
                                    <div className='flex flex-col md:flex-row w-full h-full justify-start md:justify-end items-end md:items-center gap-4 md:gap-6 lg:gap-8 text-[12px] sm:text-[15px] xl:text-[17px] text-stone-800 font-medium select-none text-nowrap'>
                                        {/* Price */}
                                        <p className='overflow-hidden text-ellipsis max-w-[75px] md:max-w-[120px] text-center text-nowrap' >Rs. {Number(item.price).toLocaleString("en-US")}</p>
                                        {/* Quanity Selector button */}
                                        <div className='px-[6px] py-[10px] sm:flex hidden  gap-6 items-center border border-stone-500 text-stone-700 rounded-md'>
                                            <button
                                                onClick={() => substract_item_from_cart(item)}
                                                className='active:opacity-60'
                                            >
                                                <FaMinus className='text-[14px]' />
                                            </button>
                                            <p className='overflow-hidden text-ellipsis line-clamp-1'>{item.quantity}</p>
                                            <button
                                                onClick={() => add_item_to_cart(item)}
                                                className='active:opacity-60'
                                            >
                                                <IoMdAdd className='text-[17px]' />
                                            </button>
                                        </div>
                                        {/* Total price */}
                                        <p className='hidden md:block overflow-hidden text-center text-ellipsis w-[120px] text-nowrap' >Rs. {Number(item.price * item.quantity).toLocaleString("en-US")}</p>
                                        {/* Remove from the Cart button*/}
                                        <button
                                            onClick={() => delete_item_from_cart(item)}
                                            className='hidden sm:block active:opacity-60'
                                        >
                                            <IoClose className='text-stone-700 scale-[1.3]' />
                                        </button>
                                    </div>

                                </div>
                            ))}


                            {/* Special Insdtructions from Customers */}
                            <div className='w-full mt-[20px] flex flex-col gap-2'>
                                <p className='text-[15px] md:text-[17px] font-semibold text-stone-700'>
                                    Special instructions
                                </p>
                                <textarea
                                    placeholder="Special instruction for seller..."
                                    type='text'
                                    className='w-full lg:w-[600px] h-[100px] border-2 border-stone-200 px-[15px] py-[10px] outline-none text-[17px] text-stone-800 rounded-md'
                                    name="special_instructions"
                                    value={form.special_instructions}
                                    onChange={handle_input_change}
                                />
                                <p className='text-[15px] md:text-[17px] text-stone-400 flex items-center gap-2 mt-2'>
                                    <MdVerifiedUser className='text-stone-700 text-[22px] md:text-[24px]' />
                                    Secure shopping gurantee
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='flex flex-col md:flex-row xl:flex-col flex-[1] md:gap-6 xl:gap-0' >

                            <div className='w-full flex flex-col' >
                                <div className='w-full border-b-[3px] h-[40px] md:h-[50px] border-stone-800 flex items-center text-stone-900' >
                                    <p className='text-[18px] md:text-[20px]' >ORDER SUMMARY</p>
                                </div>
                                {/* Subtotal of Order */}
                                <div className='w-full border-b py-[10px] border-stone-300 flex items-center justify-between mt-[10px]' >
                                    <p className='text-[16px] md:text-[18px] font-medium'>Subtotal</p>
                                    <p className='text-[17px] md:text-[20px] font-bold overflow-hidden text-ellipsis w-[250px] text-nowrap text-right'>Rs. {sum_of_cart().toLocaleString("en-US")}</p>
                                </div>

                                {/* Coupon Code */}
                                <div className='w-full py-[15px] md:py-[25px] text-[15px] md:text-[17px] flex flex-col gap-2 border-b border-stone-300'>
                                    <h1 className='font-medium'>Coupon Code</h1>
                                    <input
                                        type="text"
                                        name='coupon_code'
                                        placeholder='Enter Coupon Code'
                                        className='outline-none border border-stone-400 px-[12px] py-[10px]  rounded-md'
                                        value={form.coupon_code}
                                        onChange={handle_input_change}
                                    />
                                    <p className='text-stone-400 leading-[1.3] text-[16px]' >
                                        Coupon code will be applied on the checkout page
                                    </p>
                                </div>

                                {/* Total */}
                                <div className='w-full border-b border-stone-300 flex items-center justify-between py-[15px] md:py-[20px]' >
                                    <p className='text-[16px] md:text-[19px] font-semibold tracking-wider'>TOTAL:</p>
                                    <p className='text-[19px] md:text-[22px] font-black overflow-hidden text-ellipsis w-[250px] text-nowrap text-right'>Rs. {sum_of_cart().toLocaleString("en-US")}</p>
                                </div>
                            </div>


                            <div className='w-full flex flex-col md:pt-8 xl:pt-0'>
                                {/* Terms & Conditionsss */}
                                <div className='w-full py-[12px] flex items-center text-[14px] md:text-[15px]'>
                                    <Checkbox size='small' />
                                    <p>I agree with</p>
                                    <p className='cursor-pointer select-none ml-1 border-b border-b-stone-600  leading-[1.2]'>Terms & Conditions</p>
                                </div>

                                {/* Checkout Button */}

                                <button onClick={() => navigate_to_checkout()} className='w-full py-[12px] text-white bg-rose-600 font-semibold text-[14px] md:text-[15px] tracking-widest transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97]'>
                                    CONFIRM PAYMENT & ADDRESS
                                </button>



                                {/* Continue Shopping Button */}
                                <Link href="/" >
                                    <button className='w-full py-[12px] flex justify-center items-center hover:text-white hover:bg-stone-950 font-black text-[14px] md:text-[15px] bg-white text-stone-950 border border-stone-500 tracking-widest transition-all duration-300 mt-[12px] rounded-md active:scale-[.97] gap-2'>
                                        <ShoppingCartCheckoutIcon className='text-[19px]' />
                                        CONTINUE ORDERING
                                    </button>
                                </Link>
                            </div>


                        </div>
                    </div>
                </>
                :
                <div className="w-full h-[70vh] flex flex-col justify-center items-center">

                    <h1 className='text-[16px] md:text-[18px] text-stone-500 tracking-wider uppercase text-center'>
                        YOUR CART IS EMPTY
                    </h1>

                    <div className='my-[30px] w-full flex justify-center items-center'>
                        <Link href="/" >
                            <button className='w-full py-[12px] text-white bg-rose-600 font-semibold text-[14px] md:text-[15px] tracking-widest transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center'>
                                <ShoppingCartCheckoutIcon className='text-[19px]' />  CONTINUE ORDERING
                            </button>
                        </Link>
                    </div>
                </div>

            }

        </div>
    )
}

export default Cart_page