import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import logo from "@/public/images/logo.png";
import Image from "next/image";
import { checkShopStatus } from '../functions/shop_time';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useRouter } from 'next/router';


const Shop_closed_modal = ({
    modals_state,
    toggle_modal,
    openModal,
    closeModal,
    browse_menu,
    set_browse_menu,

}) => {

    const router = useRouter();

    const [timeLeft, setTimeLeft] = useState("");



    useEffect(() => {
        if (!router.isReady) return;
        if (checkShopStatus().isClosed && !modals_state.shop_closed_modal && browse_menu === "default") {
            openModal("shop_closed_modal");
        } else if (modals_state.shop_closed_modal && browse_menu === "browse") {
            closeModal("shop_closed_modal");
        };

        const interval = setInterval(() => setTimeLeft(checkShopStatus().timeLeft), 1000);
        return () => clearInterval(interval);
    }, [browse_menu, router.isReady]);

    const browse_menu_btn = () => {
        set_browse_menu("browse");
        if (router.pathname !== "/") {
            router.push("/");
        }
    }

    return (
        <>
            <Dialog
                open={modals_state.shop_closed_modal}
                PaperProps={{
                    sx: {
                        overflow: "visible", // Ensure the dialog does not clip overflow
                    },
                }}
            >
                <div className='w-[90vw] md:w-[500px] p-[30px] flex flex-col items-center gap-6 md:gap-8 relative'>

                    <div style={{ zIndex: 1300 }} className='w-full absolute top-[-60px] z-[1300] flex justify-center' >
                        <div className='flex justify-center items-center w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-stone-950 shadow-xl'>
                            <Image alt="logo" src={logo} className="object_contain w-[80px] md:w-[100px]" />
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold text-red-600 mt-[30px] md:mt-[50px] text-center">
                        The Shop is Closed Right Now
                    </h1>

                    <p className="text-gray-600 md:mt-2 flex md:items-center justify-center gap-2">
                        <AccessAlarmIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-500" />
                        <span>Open from <b>6:30 PM</b> to <b>1:30 AM</b> (every day)</span>
                    </p>

                    <p className="text-gray-500 md:mt-2">
                        We'll be back in <b>{timeLeft}</b>. Come back later to order!
                    </p>

                    <div className='flex flex-col items-center w-full justify-between md:mt-4 gap-4'>
                        <button onClick={browse_menu_btn} className='w-full py-[12px] text-white bg-rose-600 font-bold text-[13px] md:text-[15px]  transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center justify-center whitespace-nowrap'>
                            Browse Menu
                        </button>
                        <a
                            target="_blank"
                            href="mailto:info@pizzabuddies.com?subject=Need%20a%20Help%20From%20Support&body=I%27d%20like%20to%20inform%20you..."
                            className='w-full py-[12px] text-white bg-stone-500 font-bold text-[13px] md:text-[15px]  transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center justify-center whitespace-nowrap'>
                            Contact Support
                        </a>
                    </div>


                </div>
            </Dialog>
        </>

    )
}

export default Shop_closed_modal 