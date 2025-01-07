import React, { useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Backdrop, CircularProgress, Slide } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import Food_menu_drawer from '@/components/utilities/drawers/Food_menu_drawer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from "@/styles/home.module.css"
import Delete_section_modal from '@/utils/modals/Delete_section_modal';
import axios from 'axios';
import Delete_menu_modal from '@/utils/modals/Delete_menu_modal';
import { useRouter } from 'next/router';




const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const Layout = ({ children }) => {
    const router = useRouter();
    const ignore_except = ["/", "/food-item"];

    const {
        snackbar_alert,
        close_snackbar,
        drawer_state,
        toggle_drawer,
        modals_state,
        toggle_modal,
        sidebar,
        handle_sidebar,
        set_data,
        delete_section_api,
        delete_menu_api,
        section_id,
        menu_id,
        reset_states,
        API_loading,
        set_API_loading,
        cart
    } = useStateContext();

    // lock scroll when drawer opens
    useEffect(() => {
        if (Object.values(drawer_state).some(e => e === true)) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");// Cleanup on unmount
        };
    }, [drawer_state]);


    const total_values_of_cart = (_cart, field) => {
        if (field === "price") {
            return _cart.reduce((prev, next) => prev + (next.quantity * next.price), 0)
        }
        return _cart.reduce((prev, next) => prev + next[field], 0);
    }
    return (
        <div>
            {/* Loader Component */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={API_loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Notification Component */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                key={TransitionDown ? TransitionDown.name : ''}
                open={snackbar_alert.open}
                autoHideDuration={10000}
                onClose={close_snackbar}>
                <Alert onClose={close_snackbar} severity={snackbar_alert.severity} sx={{ width: '100%' }}>
                    {snackbar_alert.message}
                </Alert>
            </Snackbar>

            {/* Modals Component */}
            <Delete_section_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                section_id={section_id}
                delete_section_api={delete_section_api}
                set_API_loading={set_API_loading}
                reset_states={reset_states}
            />

            <Delete_menu_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                section_id={section_id}
                menu_id={menu_id}
                delete_menu_api={delete_menu_api}
                set_API_loading={set_API_loading}
                reset_states={reset_states}
            />

            {/* Drawers Component */}
            <Food_menu_drawer
                drawer_state={drawer_state}
                toggle_drawer={toggle_drawer}
                sidebar={sidebar}
                handle_sidebar={handle_sidebar}
                set_data={set_data}
            />
            {children}
            {router.pathname !== "/admin" &&
                <a
                    target='_blank'
                    href="https://wa.me/923102223511"
                    className={`p-[12px] md:p-[14px] lg:p-[16px] fixed bottom-[25px] md:bottom-[35px] right-[20px] md:right-[30px] bg-[#25D366] rounded-full ${styles.whatsapp_shaky} z-[9999]`}
                >

                    <WhatsAppIcon className='text-white text-[28px] md:text-[32px] lg:text-[36px]' />

                </a>
            }

            <div className={` fixed right-0 left-0 z-[9999] w-[100vw]  flex justify-center ${((cart.length && ignore_except.some(e => e === router.pathname)) && router.pathname.includes("")) ? "bottom-0" : "bottom-[-200px]"} transition-all duration-500`}>
                <div className=' 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px] w-full' >

                    <div style={{ boxShadow: "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em" }} className='w-full p-[12px] md:p-[14px] lg:p-[16px] bg-white rounded-t-3xl h-[120px] px-[20px] flex items-center'>


                        <div onClick={() => router.push("/cart")} className='bg-rose-600 w-full rounded-xl flex items-center justify-between text-white px-[20px] py-[8px] active:scale-[.98] transition-all duration-200 select-none cursor-pointer' >

                            <button className='text-center text-[11px]  md:text-[13px] font-bold rounded-full border border-white min-w-[30px] h-[30px] flex justify-center items-center p-[6px] transition-all duration-200' >
                                {Boolean(total_values_of_cart(cart, "quantity") > 99) ? "99+" : total_values_of_cart(cart, "quantity")}
                            </button>


                            <div className='text-center'>
                                <p className='font-bold text-[13px] md:text-[16px]'>View you cart</p>
                                <p className='text-[11px] md:text-[15px]'>Pizza Buddies - Maymar</p>
                            </div>
                            <div>
                                <p className='font-bold text-right text-[13px] md:text-[16px] max-w-[90px] text-nowrap text-ellipsis overflow-hidden'>Rs. {total_values_of_cart(cart, "price").toLocaleString("en-US")}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default Layout