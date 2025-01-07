import React, { useState, useEffect } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from "next/link";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Radio from '@mui/material/Radio';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import CircleIcon from '@mui/icons-material/Circle';
import Chip from "@mui/material/Chip";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Skeleton } from '@mui/material';


const Food_item_page = ({ item, section_id, is_loading }) => {

    const { add_item_to_cart } = useStateContext();

    const router = useRouter();

    const decide_text_FROM = (options) => {
        if (options && options.length) {
            return options.some(op => Boolean(op.values.some(e => Boolean(e.option_price))));
        }
        return false
    };

    const calculate_discount = (item) => {
        const { price, compare_price } = item;

        if (!compare_price || compare_price <= price) {
            return false; // No discount if compare_price is not valid or less than/equal to price
        }

        const discount = ((compare_price - price) / compare_price) * 100;
        return Math.round(discount) + "% off"; // Round to the nearest whole number
    };


    const [local, set_local] = useState([{ price: 0, compare_price: 0, option_value: "", value_id: "", option_name: "", option_id: "", success: false, }]);

    const total_price = (arr) => {
        const total = arr.reduce((prev, next) => prev + next.price, 0);
        return total;
    }

    const total_compare_price = (arr) => {
        const total = arr.reduce((prev, next) => prev + next.compare_price, 0);
        return total
    }

    const handle_change = (set_options, obj) => {
        set_options(prev_options => {

            const data_copy = [...prev_options].filter(e => !Object.values(e).every(i => !Boolean(i)));
            const index = data_copy.findIndex(e => e.option_id === obj.option_id);
            if (index !== -1) {
                data_copy.splice(index, 1, obj);
                return data_copy;
            }
            return [...data_copy, obj];
        });
    }

    const validate_options = (options) => {
        if (options && options.length) {
            const _options = options.filter(e => Boolean(e.options_selectable));

            if (_options.length === local.length && local.every(e => Boolean(e.success))) {
                return true;
            }
            return false;
        }
        return true;
    };

    const required_chip = (id, options) => {
        return options.some(e => ((e.option_id === id) && Boolean(e.success)));
    };

    const convert_local_arr_of_options_to_obj = (arr) => {
        return Object.fromEntries(arr.map(e => [e.option_name.toLowerCase(), e.option_value]));
    }

    const child_add_to_cart = () => {
        var object;
        const { options, ...other } = item;
        if (item.options.some(e => Boolean(e.options_selectable))) {
            if (validate_options(item.options)) {
                object = {
                    ...other,
                    ...convert_local_arr_of_options_to_obj(local),
                    compare_price: total_compare_price(local),
                    price: total_price(local),
                    quantity: 1,
                    value_id: local.map(e => e.value_id),
                };
                return add_item_to_cart(object);
            }
            return;
        } else {
            object = {
                ...other,
                quantity: 1,
            }
        }
        return add_item_to_cart(object);

    };


    return (
        <div className='w-full px-[20px] pt-[15px] md:pt-[30px] pb-[80px] tracking-wider'>
            {/* Breadcrumbs */}
            <Breadcrumbs
                className='text-gray-400 text-[13px] md:text-[15px]'
                separator={<NavigateNextIcon fontSize="small" />}
            >
                <Link
                    className='hover:underline active:text-gray-600'
                    underline="hover"
                    key="1"
                    color="inherit"
                    href="/"
                >
                    Home
                </Link>
                <p>
                    {item?.menu_title || "Food Item"}
                </p>
            </Breadcrumbs>


            {(item && !is_loading) ?
                <>

                    <div className='w-full flex flex-[2.5] flex-col lg:flex-row mt-8 mb-16 gap-6' >

                        {/* Product Image Gallery */}
                        <div className='flex flex-[1] lg:flex-[1.6]' >
                            <div className='w-full flex justify-center items-start lg:pr-[80px] rounded-md overflow-hidden' >
                                <img
                                    src={item.menu_image}
                                    alt="Menu Image"
                                    className='w-full object-contain rounded-md'
                                />
                            </div>
                        </div>

                        {/*Product Order Section  */}
                        <div className='flex flex-[1] flex-col' >

                            <div className='w-full text-stone-950'>
                                {/* Menu Title */}
                                <p className='text-[15px] xl:text-[18px] font-bold overflow-hidden text-ellipsis line-clamp-1'>
                                    {item.menu_title}
                                </p>
                                {/* Menu Price */}
                                <p className='text-[15px] xl:text-[18px] text-rose-600 font-bold flex items-center   gap-2 lg:gap-4 overflow-hidden text-ellipsis line-clamp-1'>

                                    {/* Actual Price */}
                                    {(decide_text_FROM(item.options)) && "from"} Rs. {Number(total_price(local) || item.price).toLocaleString("en-US")}

                                    {/* Compare Price */}
                                    {Boolean(total_compare_price(local) || item.compare_price) &&
                                        <span className='text-[13px] xl:text-[15px] text-stone-500 font-medium line-through'>
                                            Rs. {Number(total_compare_price(local) || item.compare_price).toLocaleString("en-US")}
                                        </span>
                                    }

                                    {/* Discount Percentage */}
                                    {calculate_discount(total_price(local) ?
                                        {
                                            price: total_price(local),
                                            compare_price: total_compare_price(local)
                                        }
                                        :
                                        item)
                                        &&
                                        <span className='font-medium'>
                                            {calculate_discount(total_price(local) ?
                                                {
                                                    price: total_price(local),
                                                    compare_price: total_compare_price(local)
                                                }
                                                :
                                                item)}
                                        </span>
                                    }
                                </p>
                            </div>

                            {/* Description */}
                            <div className='py-[14px] xl:py-[16px] text-stone-700' >
                                <p className='text-[14px] xl:text-[17px] font-medium capitalize'>{item.description}</p>
                            </div>


                            {/* Options */}
                            {item.options && item.options.map((option) => (

                                <div key={option._id}
                                    className={`py-[10px] border border-stone-300 text-stone-700 rounded-md my-2
                                         transition-all duration-300 ${option.options_selectable ?
                                            `${required_chip(option._id, local) ? "bg-stone-50" : "bg-red-50"}`
                                            :
                                            "bg-stone-50"}`
                                    }
                                >


                                    {/* Option Label */}
                                    <div className='w-full flex items-center justify-between pl-[25px] pr-[15px] my-2'>

                                        <p className='text-[15px] xl:text-[17px] font-bold capitalize overflow-hidden text-ellipsis line-clamp-1'>{option.option_name}
                                        </p>
                                        {option.options_selectable &&
                                            <>
                                                {required_chip(option._id, local) ?
                                                    <Chip label="Completed" variant='outlined' className='bg-white' />
                                                    :
                                                    <Chip label="Required" className='bg-rose-600 text-white' />
                                                }
                                            </>
                                        }
                                    </div>


                                    {/* Option Value */}
                                    {option.values.map((value) => (
                                        <div key={value._id}>

                                            {// If options are in selectable mode
                                                option.options_selectable ?
                                                    <button
                                                        className='w-full flex items-center active:bg-stone-100 py-[2px] rounded px-[15px] select-none justify-between transition-all duration-300 my-2'
                                                        onClick={() => handle_change(set_local, {
                                                            price: value.option_price,
                                                            compare_price: value.option_compare_price,
                                                            option_value: value.option_value,
                                                            value_id: value._id,
                                                            option_name: option.option_name,
                                                            option_id: option._id,
                                                            section_id: section_id,
                                                            success: true,
                                                        })}
                                                    >
                                                        {/* Option Value */}
                                                        <div className='flex items-center lg:gap-1' >
                                                            <Radio
                                                                checked={local.some(e => e.value_id.includes(value._id))}
                                                                size="small"
                                                                sx={{ color: "black", '&.Mui-checked': { color: "black", }, }}
                                                            />
                                                            <p className='text-[15px] xl:text-[17px] font-medium capitalize my-2'>
                                                                {value.option_value}
                                                            </p>
                                                        </div>

                                                        {/* Option Value Price */}
                                                        {Boolean(value.option_price) &&
                                                            <div className='flex flex-col items-center leading-[16px]'>
                                                                {/* Option Price */}
                                                                <p className='text-rose-600 text-[14px]  md:text-[15px] font-bold'>
                                                                    Rs. {Number(value.option_price).toLocaleString("en-US")}
                                                                </p>
                                                                {/* Option Compare Price */}
                                                                {Boolean(value.option_compare_price) &&
                                                                    <p className='text-[13px] md:text-[14px] text-stone-500 line-through'>
                                                                        Rs. {Number(value.option_compare_price).toLocaleString("en-US")}
                                                                    </p>
                                                                }
                                                            </div>
                                                        }
                                                    </button>

                                                    :

                                                    // If Options are in view mode
                                                    <div className='flex items-center gap-4 active:bg-stone-100 py-[2px] rounded px-[25px]  select-none duration-300 my-2'>
                                                        {/* Option Value */}
                                                        <CircleIcon className='text-[11px]' />
                                                        <p className='text-[15px] xl:text-[17px] font-medium capitalize my-2 overflow-hidden text-ellipsis line-clamp-1'>
                                                            {value.option_value}
                                                        </p>
                                                    </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            ))}





                            <div className='w-full mt-6 xl:mt-12'>
                                {/* Checkout Button */}
                                <button
                                    disabled={!validate_options(item.options)}
                                    onClick={() => child_add_to_cart()}
                                    className={`w-full py-[12px] flex justify-center items-center text-white font-black text-[13px] xl:text-[15px]  tracking-widest transition-all active:scale-[.97] duration-300 rounded-md ${validate_options(item.options) ? "bg-rose-600 hover:opacity-80" : "bg-stone-300"}`}
                                >
                                    ADD TO CART
                                </button>
                            </div>



                        </div>

                    </div>

                </>

                :
                <div className='w-full flex flex-[2.5] flex-col lg:flex-row mt-8 mb-16 gap-6' >
                    <div className='flex flex-[1] lg:flex-[1.6]' >
                        <div className='w-full flex justify-center items-start lg:pr-[80px] rounded-md overflow-hidden' >
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                className='w-full h-[35vh] md:h-[50vh] xl:h-[75vh] bg-stone-100'
                            />
                        </div>
                    </div>

                    <div className='flex flex-[1] flex-col'>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            className='w-[100px] md:w-[200px] bg-stone-100'
                        />

                        <Skeleton
                            variant="text"
                            animation="wave"
                            className='w-[180px] md:w-[280px] md:mt-1 bg-stone-100'
                        />

                        <Skeleton
                            variant="text"
                            animation="wave"
                            className='w-[250px] md:w-[400px] mt-4 md:mt-8 bg-stone-100'
                        />

                        <div className='py-[10px] border border-stone-200 text-stone-700 rounded-md my-2 transition-all duration-300 mt-8 px-[20px]' >


                            <div className='w-full flex justify-between items-center md:mt-2 mb-2 md:mb-4' >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[90px] md:w-[120px] h-[40px] bg-stone-100'
                                />
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[90px] md:w-[120px] h-[40px] bg-stone-100'
                                />
                            </div>


                            <div className='w-full flex justify-between items-center md:my-2' >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                            </div>

                            <div className='w-full flex justify-between items-center md:my-2' >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                            </div>

                            <div className='w-full flex justify-between items-center md:my-2' >
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                                <Skeleton
                                    variant="text"
                                    animation="wave"
                                    className='w-[70px] md:w-[100px] bg-stone-100'
                                />
                            </div>



                        </div>
                        <Skeleton
                            variant='rounded'
                            animation="wave"
                            className='w-full mt-10 md:mt-14 h-[45px] bg-stone-100'
                        />
                    </div>

                </div>
            }
        </div>
    )
}

export default Food_item_page