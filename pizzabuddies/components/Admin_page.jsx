import React, { useEffect, useState } from 'react'
import useStateContext from '@/context/ContextProvider';
import Create_menu from './utilities/admin/Create_menu';
import Update_menu from './utilities/admin/Update_menu';
import Update_section from './utilities/admin/Update_section';


const Admin_page = ({ axios }) => {

    const {
        set_snackbar_alert,
        sidebar,
        handle_sidebar,
        data, set_data,
        default_data,
        API_loading,
        set_API_loading,
        get_section_api,
        get_menu_api,
        get_menu_list_api,
        get_section_list_api,
        create_catalog_api,
        create_menu_api,
        create_section_api,
        update_section_api,
        update_menu_api,
        upload_image_api,
        section_id,
        set_section_id,
        section_list,
        set_section_list,
        menu_list,
        set_menu_list,
        menu_id,
        set_menu_id,
        helper_index,
        set_helper_index,
        reset_states,
        toggle_modal,
    } = useStateContext();


    return (
        <div className='w-full px-[20px] pt-[20px] md:py-[40px] tracking-wider flex justify-center gap-12'>

            <div className='flex-[2] relative hidden lg:block' >
                <div className='flex flex-col shadow-md rounded-md tracking-widest text-stone-700 overflow-hidden text-[15px] transition-all sticky top-0'>
                    <button
                        onClick={() => handle_sidebar("create-menu")}
                        className={`py-[16px] border-y px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "create-menu" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        CREATE MENU</button
                    >
                    <button
                        onClick={() => handle_sidebar("update-menu")}
                        className={`py-[16px] border-b px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "update-menu" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        UPDATE MENU
                    </button>
                    <button
                        onClick={() => handle_sidebar("update-section")}
                        className={`py-[16px] border-b px-[20px] border-b-stone-300 active:opacity-60 transition-all duration-300 ${sidebar === "update-section" ? "bg-black text-white" : "bg white text-stone-900"}`}
                    >
                        CREATE/UPDATE SECTION
                    </button>
                </div>
            </div>

            <div className='w-full flex-[4] flex flex-col items-center gap-6' >
                {sidebar === "create-menu" ?

                    <Create_menu
                        axios={axios}
                        data={data}
                        set_data={set_data}
                        helper_index={helper_index}
                        set_helper_index={set_helper_index}
                        set_snackbar_alert={set_snackbar_alert}
                        default_data={default_data}
                        get_section_list_api={get_section_list_api}
                        create_catalog_api={create_catalog_api}
                        create_menu_api={create_menu_api}
                        upload_image_api={upload_image_api}
                        section_id={section_id}
                        set_section_id={set_section_id}
                        section_list={section_list}
                        set_section_list={set_section_list}
                        reset_states={reset_states}
                        API_loading={API_loading}
                        set_API_loading={set_API_loading}
                    />
                    : sidebar === "update-menu" ?
                        <Update_menu
                            axios={axios}
                            data={data}
                            set_data={set_data}
                            helper_index={helper_index}
                            set_helper_index={set_helper_index}
                            set_snackbar_alert={set_snackbar_alert}
                            default_data={default_data}
                            get_section_list_api={get_section_list_api}
                            get_menu_list_api={get_menu_list_api}
                            get_menu_api={get_menu_api}
                            update_menu_api={update_menu_api}
                            upload_image_api={upload_image_api}
                            section_id={section_id}
                            set_section_id={set_section_id}
                            menu_id={menu_id}
                            set_menu_id={set_menu_id}
                            section_list={section_list}
                            set_section_list={set_section_list}
                            menu_list={menu_list}
                            set_menu_list={set_menu_list}
                            reset_states={reset_states}
                            toggle_modal={toggle_modal}
                            API_loading={API_loading}
                            set_API_loading={set_API_loading}
                        />
                        : sidebar === "update-section" ?
                            <Update_section
                                axios={axios}
                                data={data}
                                set_data={set_data}
                                helper_index={helper_index}
                                set_helper_index={set_helper_index}
                                set_snackbar_alert={set_snackbar_alert}
                                default_data={default_data}
                                get_section_api={get_section_api}
                                get_section_list_api={get_section_list_api}
                                create_section_api={create_section_api}
                                update_section_api={update_section_api}
                                upload_image_api={upload_image_api}
                                section_id={section_id}
                                set_section_id={set_section_id}
                                section_list={section_list}
                                set_section_list={set_section_list}
                                reset_states={reset_states}
                                toggle_modal={toggle_modal}
                                API_loading={API_loading}
                                set_API_loading={set_API_loading}
                            />
                            :
                            <></>
                }
            </div>


        </div >
    )
}

export default Admin_page