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
    const router_pathname = useRouter().pathname;

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
            {router_pathname !== "/admin" &&
                <a
                    target='_blank'
                    href="https://wa.me/923102223511"
                    className={`p-[12px] md:p-[14px] lg:p-[16px] fixed bottom-[25px] md:bottom-[35px] right-[20px] md:right-[30px] bg-[#25D366] rounded-full ${styles.whatsapp_shaky} z-[9999]`}
                >

                    <WhatsAppIcon className='text-white text-[28px] md:text-[32px] lg:text-[36px]' />

                </a>
            }
        </div>
    )
}

export default Layout