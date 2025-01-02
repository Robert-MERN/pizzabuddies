import React from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';



const Delete_menu_modal = ({
    axios,
    modals_state,
    toggle_modal,
    section_id,
    menu_id,
    delete_menu_api,
    set_API_loading,
    reset_states,
}) => {

    const handle_delete_menu = () => {
        delete_menu_api(
            axios,
            section_id,
            menu_id,
            set_API_loading,
            reset_states,
            () => toggle_modal("delete_menu_modal")
        );
    };

    return (
        <Dialog
            open={modals_state.delete_menu_modal}
            onClose={() => toggle_modal("delete_menu_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[10px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-semibold text-stone-950 tracking-wider'>
                        Delete Menu
                    </p>
                    <IconButton onClick={() => toggle_modal("delete_menu_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-semibold border-b border-stone-300 p-[20px]' >
                    Are you sure do you want to delete this Menu?
                </p>
                <div className='w-full flex justify-end gap-3 p-[20px] tracking-wider' >
                    <button onClick={() => toggle_modal("delete_menu_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[8px] md:py-[10px] rounded text-stone-700 text-[12px] font-semibold md:text-[15px] transition-all' >Cancel</button>
                    <button onClick={handle_delete_menu} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[14px] py-[8px] md:py-[10px] rounded text-white text-[12px] font-semibold md:text-[15px] transition-all' >Delete</button>
                </div>

            </div>
        </Dialog>
    )
}

export default Delete_menu_modal