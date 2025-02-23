import React, { useEffect, useRef, useState } from 'react';
import styles from "@/styles/home.module.css";
import { Link as ScrollLink, Element } from 'react-scroll'; // Import Link and Element from react-scroll
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { Skeleton } from '@mui/material';
import { checkShopStatus } from '@/utils/functions/shop_time';
import useStateContext from '@/context/ContextProvider';

const Resturant_page = ({ catalog, is_loading }) => {

    const router = useRouter();

    const { modals_state, openModal, set_browse_menu } = useStateContext();

    const [active_section, set_active_section] = useState("");

    useEffect(() => {
        if (catalog.length && catalog[0]._id) {
            set_active_section(catalog[0]._id);
        }
    }, [catalog.length]);

    const navRef = useRef(null);

    const handleNavScroll = (id) => {
        set_active_section(id); // Update the active section
        // Find the active nav item
        const activeNavItem = document.querySelector(`[data-section="${id}"]`);
        if (activeNavItem && navRef.current) {
            // Scroll the active nav item into view (center)
            const navWidth = navRef.current.offsetWidth;
            const itemLeft = activeNavItem.offsetLeft;
            const itemWidth = activeNavItem.offsetWidth;
            navRef.current.scrollTo({
                left: itemLeft - navWidth / 2 + itemWidth / 2,
                behavior: 'smooth',
            });
        }
    };

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

    const navigate_to_food_item = (section_id, menu_id) => {
        set_browse_menu("default");
        if (checkShopStatus().isClosed && !modals_state.shop_closed_modal) {
            openModal("shop_closed_modal");
        } else {
            router.push(`/food-item?section_id=${section_id}&menu_id=${menu_id}`)
        };
    }

    return (
        <div className='w-full pt-[15px] md:pt-[30px] pb-[60px]'>
            {/* Navigation Bar */}
            {(Boolean(catalog.length) && !is_loading) ?
                <nav
                    className={`w-full h-fit overflow-x-scroll overflow-y-hidden flex items-center px-[20px] gap-2 md:gap-4 border border-stone-200 shadow rounded-md ${styles.horizontal_scroll_bar} sticky top-0 bg-white z-10`}
                    ref={navRef}
                >
                    {catalog.map((section, index) => (
                        <ScrollLink
                            key={index}
                            to={section._id}
                            smooth={true}
                            spy={true}
                            offset={-100} // Adjust to account for sticky header
                            duration={200}
                            onSetActive={(id) => handleNavScroll(id)}
                            data-section={section._id}
                            className={`h-[50px] md:h-[60px] flex items-center px-4 uppercase text-nowrap font-medium border-y-4 border-t-transparent active:bg-stone-100 ${active_section === section._id ? "border-b-stone-900 text-stone-700 " : "border-b-transparent text-gray-400 "
                                } text-[13px] md:text-[16px] transition-all duration-200 cursor-pointer`}
                        >
                            {section.section_title}
                        </ScrollLink>
                    ))}
                </nav>
                :
                <Skeleton variant='rounded' animation="wave" className='h-[50px] md:h-[60px] w-full bg-stone-100' />
            }


            {/* Sections */}
            {(Boolean(catalog.length) && !is_loading) ?
                catalog.map((section, index) => (
                    <Element
                        key={index}
                        name={section.section_title}
                        id={section._id}
                        className='w-full px-[20px] mt-[40px] mb-[100px] flex flex-col items-center'
                    >
                        {/* Section Title */}
                        <h1 className='w-full mb-[20px] lg:mb-[30px] text-center uppercase text-[22px] md:text-[24px] lg:text-[26px] font-semibold text-stone-700'>
                            {section.section_title}
                        </h1>

                        {/* Banner Image */}
                        {section.banner_image &&
                            <img
                                className='w-full object-contain mb-[20px] rounded-xl'
                                src={section.banner_image}
                                alt="Section Banner"
                            />
                        }

                        {/* Menu Catalog */}
                        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 relative'>
                            {section.menu_catalog.map((menu) => (
                                <div
                                    key={menu._id}
                                    className='pl-[20px] h-[150px] md:h-[180px] lg:h-[200px] xl:h-[220px] cursor-pointer border border-stone-200 flex items-start gap-6 lg:gap-12 rounded-xl shadow-md w-full overflow-hidden bg-white hover:opacity-75 active:opacity-55 transition-all duration-300 relative'
                                    onClick={() => navigate_to_food_item(section._id, menu._id)}
                                >
                                    {/* Menu Info */}
                                    <div className='w-full py-[20px] flex flex-col gap-6 lg:gap-8'>
                                        <div className='flex flex-col lg:gap-2'>
                                            <p className='line-clamp-1 text-ellipsis overflow-hidden text-[15px] md:text-[16px] lg:text-[18px] font-medium text-stone-800'>
                                                {menu.menu_title}
                                            </p>
                                            <p className='line-clamp-1 md:line-clamp-2 text-ellipsis overflow-hidden text-[14px] text-stone-500'>
                                                {menu.description}
                                            </p>
                                        </div>
                                        {/* Price */}
                                        <p className=" line-clamp-2 text-ellipsis overflow-hidden font-semibold text-[13px] md:text-[15px]">
                                            <span className="text-rose-600">
                                                {decide_text_FROM(menu.options) && "from"} {`Rs. ${Number(menu.price).toLocaleString("en-US")} `}
                                            </span>
                                            {Boolean(menu.compare_price) && (
                                                <>
                                                    <span className="line-through px-2">
                                                        Rs. {Number(menu.compare_price).toLocaleString("en-US")}
                                                    </span>
                                                    {Boolean(calculate_discount({ price: menu.price, compare_price: menu.compare_price })) && (
                                                        <span className="text-rose-600 font-medium">
                                                            {(calculate_discount({ price: menu.price, compare_price: menu.compare_price })).toLocaleString("en-US")}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    {/* Menu Image */}
                                    <img
                                        src={menu.menu_image}
                                        alt="Menu Image"
                                        className='w-[130px] h-full md:w-[180px] lg:w-[200px] xl:w-[220px] object-cover shrink-0'
                                    />
                                    <button className='p-[6px] bg-white border border-stone-200 shadow-md rounded-[100%] absolute bottom-[4px] lg:bottom-[10px] right-[6px] lg:right-[10px] hover:scale-[1.1] transition-all duration-300 active:bg-stone-300 hover:rotate-90'>
                                        <AddIcon className='text-stone-500 text-[24px] lg:text-[28px] font-bold' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Element>
                ))
                :
                [...Array(1)].map((_, index) => (
                    <div key={index} className='w-full px-[20px] mt-[40px] mb-[100px] flex flex-col items-center'>

                        <div className='w-full flex justify-center' >
                            <Skeleton
                                variant='rounded'
                                animation="wave"
                                className='w-[160px] h-[26px] xl:h-[30px] bg-stone-100'
                            />
                        </div>
                        <Skeleton
                            variant='rounded'
                            animation="wave"
                            className='w-full h-[120px] md:h-[150px] xl:h-[200px] bg-stone-100 mt-[20px] lg:mt-[30px] mb-[20px]'
                        />


                        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 relative'>

                            {[...Array(4)].map((_, index) => (

                                <div
                                    key={index}
                                    className='pl-[20px] h-[150px] md:h-[180px] lg:h-[200px] xl:h-[220px]  cursor-pointer border border-stone-200 flex items-start gap-6 lg:gap-12 rounded-xl shadow-md w-full overflow-hidden bg-white hover:opacity-75 active:opacity-55 transition-all duration-300 relative'
                                >
                                    {/* Menu Info */}
                                    <div className='w-full py-[20px] flex flex-col gap-2 lg:gap-8'>
                                        <div className='flex flex-col lg:gap-2'>
                                            <Skeleton
                                                variant='text'
                                                className='w-[70px] xl:w-[100px] bg-stone-200'
                                                animation="wave"
                                            />
                                            <Skeleton
                                                variant='text'
                                                className='w-[180px] md:w-[200px] xl:w-[300px] bg-stone-200'
                                                animation="wave"
                                            />
                                        </div>
                                        {/* Price */}
                                        <div className='flex gap-2 sm:gap-4 font-semibold text-[13px] md:text-[14px] flex-wrap'>
                                            <Skeleton
                                                variant='text'
                                                className='w-[100px] md:w-[120px] xl:w-[200px] bg-stone-200'
                                                animation="wave"
                                            />
                                        </div>
                                    </div>
                                    {/* Menu Image */}
                                    <Skeleton
                                        variant='rounded'
                                        className='h-full w-[260px] md:w-[300px] lg:w-[340px] bg-stone-100'
                                        animation="wave"
                                    />
                                </div>

                            ))}

                        </div>

                    </div>
                ))
            }
        </div>
    );
};

export default Resturant_page;
