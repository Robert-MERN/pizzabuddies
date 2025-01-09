import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import Badge from "@mui/material/Badge";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import useStateContext from "@/context/ContextProvider";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Link from "next/link";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import styles from "@/styles/home.module.css";


const Food_navbar = ({ admin }) => {
    const { toggle_drawer, cart } = useStateContext();

    useEffect(() => {
        document.querySelectorAll(".MuiBadge-colorInfo").forEach((each) => each.style = "background-color: #e11d48")
    }, []);


    return (
        <div className="pr-[30px] pl-[15px] w-full h-[70px] flex justify-between items-center bg-stone-950 shadow-[0_1px_3px_#0000001a]">
            {admin &&
                <div className="w-full flex lg:hidden items-center gap-6 transition-all">
                    <button onClick={() => toggle_drawer("food_menu_drawer")}>
                        <RxHamburgerMenu className="text-[26px] text-stone-200 active:text-stone-100 cursor-pointer" />
                    </button>
                </div>
            }



            <div className={`flex lg:hidden w-full ${admin ? "justify-center" : "justify-start"}`}>
                <Link href="/">
                    <Image alt="logo" priority src={logo} className="w-[90px] object-contain" />
                </Link>
            </div>


            {/* Logo and Optoins Div */}
            <div className="hidden lg:flex items-center h-full w-full gap-16">
                {/* Logo Div */}
                <div className="hidden lg:block w-[90px] lg:w-[120px]">
                    <Link href="/" >
                        <Image alt="logo" priority src={logo} className="w-[100px] object-contain" />
                    </Link>
                </div>

                {/* Options Div */}
                <div className="flex h-full items-center">
                    <ul className="flex gap-10 items-center justify-center text-center">
                        <li>
                            <a className={`font-medium text-[17px] text-stone-200 active:text-stone-600 flex items-center gap-2 border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100 text-nowrap`} href="mailto:pizzabuddies@gmail.com">
                                <EmailIcon className="text-[19px]" />
                                pizzabuddies@gmail.com
                            </a>

                        </li>
                        <li>
                            <a className={`font-medium text-[17px] text-stone-200 active:text-stone-600 flex items-center gap-2 border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100 text-nowrap ${styles.shaky}`} href="tel:+923152825015">
                                <PhoneIcon className="text-[18px]" />
                                0315 2825 015
                            </a>
                        </li>

                    </ul>
                </div>
            </div>

            {/* Search Div */}
            <div className="w-full h-full flex justify-end items-center gap-5">


                {admin ?
                    <Link href={"/"}>
                        <button className="active:text-stone-400 text-stone-200 transition-all">
                            <OpenInBrowserIcon className="text-[28px]" />
                        </button>
                    </Link>
                    :
                    <>
                        <div className="lg:hidden">
                            <a className={`font-semibold text-[15px] text-stone-200 active:text-stone-600 flex items-center gap-2 border-[1px] border-transparent hover:border-b-stone-400 transition-all duration-100 text-nowrap ${styles.shaky}`} href="tel:+923152825015">
                                <PhoneIcon className="text-[15px]" />
                                0315 2825 015
                            </a>
                        </div>
                        <Link href={"/cart"}>
                            <button className="active:text-stone-400 text-white transition-all">
                                <Badge badgeContent={cart.reduce((prev, next) => prev + next.quantity, 0)} color="info" className="">
                                    <FiShoppingCart className="text-[24px]" />
                                </Badge>
                            </button>
                        </Link>
                    </>
                }
            </div>
        </div>
    );
};

export default Food_navbar;
