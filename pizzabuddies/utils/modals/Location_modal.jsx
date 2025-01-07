import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import { Autocomplete, TextField } from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import logo from "@/public/images/logo.png";
import Image from "next/image";

const Location_modal = ({ modals_state, toggle_modal, default_order_method,
    order_method,
    set_order_method, }) => {


    useEffect(() => {
        if (!order_method.location && !order_method.branch && !modals_state.location_modal) {
            toggle_modal("location_modal")
        }
    })
    // Location List 
    const location_list = ['Gulshan-e-Maymar Sector Z', 'Gulshan-e-Maymar Sector Y', 'Gulshan-e-Maymar Sector X', 'Gulshan-e-Maymar Sector W', 'Gulshan-e-Maymar Sector V', 'Gulshan-e-Maymar Sector U', 'Gulshan-e-Maymar Sector T', 'Gulshan-e-Maymar Sector S', 'Square Appartment', 'Gulshan-e-Maymar Sector Q', 'Gulshan-e-Maymar Sector R', 'Toyota Highway', 'Wasi Country', 'Global Goth', 'Dhani Bux Goth', 'Custom Society', 'AL MANZAR TOWN', 'Roti Corporation', 'M Poor', 'Abu Zar Ghaffari', 'Business Professional C.H.S', 'ABV Goth', 'Faqeera Goth', 'Cotton Society', 'Lakhani Tower', 'S I T E Area & Industrial', 'Ahsanabad', 'Al Noor Society', 'Heaven City Society', 'Al Habib Society', 'Shahnawaz Society', 'GARDEN CITY BLOCK A,B', 'SPARCO SOCIETY', 'MERUTH SOCIETY', 'Rainbow Sweet Home', 'Rainbow Tower', 'Hadiabad', 'Khayaban-e-shareef', 'Diamond City', 'Ali Garh Society', 'Dream World Resort Only Gate', 'MASHRIQI SOCITY', 'AHSAN DREAM LAND', 'PTV Society', 'Etawa Society'];

    // Branch List
    const branch_list = ["Shop no.25 Lakhani Towers Ahsanabad, Gulshan-e-Maymar"]

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

    const default_errors = {
        branch: "",
        location: "",
    }
    const [errors, set_errors] = useState(default_errors);

    const handle_order_method = (arg) => {
        set_errors(default_errors);
        set_order_method(default_order_method);
        set_order_method(prev => ({ ...prev, order_method: arg }));
    }

    const handle_confirm = () => {
        if (order_method.order_method === "delivery" && !order_method.location) {
            return set_errors({ branch: "", location: "Please select your location." });
        } else if (order_method.order_method === "pickup" && !order_method.branch) {
            return set_errors({ branch: "Please select the branch.", location: "" });
        }

        if (Object.values(errors).every(e => !e)) {
            toggle_modal("location_modal")
        }

    };



    return (
        <>
            <Dialog
                open={modals_state.location_modal}
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

                    {order_method.order_method === "delivery" ?
                        <h1 className='text-[18px] md:text-[20px] font-bold tracking-widest text-center text-stone-900 mt-[30px] md:mt-[50px]'>SELECT YOUR LOCATION</h1>
                        :
                        <h1 className='text-[18px] md:text-[20px] font-bold tracking-widest text-center text-stone-900 mt-[30px] md:mt-[50px]'>PLEASE SELECT BRANCH</h1>
                    }

                    <div className='flex w-full' >
                        <button onClick={() => handle_order_method("delivery")} className={`w-full py-[12px] text-white  font-semibold text-[12px] md:text-[14px] tracking-widest transition-all duration-300 rounded-l-md  active:scale-[.97] flex gap-3 items-center justify-center ${order_method.order_method === "delivery" ? "bg-rose-600" : "bg-stone-400"}`}>
                            DELIVERY
                        </button>
                        <button onClick={() => handle_order_method("pickup")} className={`w-full py-[12px] text-white font-semibold text-[12px] md:text-[14px] tracking-widest transition-all duration-300 rounded-r-md active:scale-[.97]  flex gap-3 items-center justify-center ${order_method.order_method === "pickup" ? "bg-rose-600" : "bg-stone-400"}`}>
                            PICKUP
                        </button>
                    </div>

                    {order_method.order_method === "delivery" ?

                        <Autocomplete
                            id="section-list"
                            className="w-full"
                            defaultValue='Gulshan-e-Maymar Sector Z'
                            value={location_list.find((option) => option === order_method.location) || null}
                            onChange={(event, new_value) => {
                                set_order_method(prev => ({ ...prev, location: new_value || "" })); // Handle cases where new_value is null
                                set_errors(prev => ({ ...prev, location: new_value ? "" : "Please select your location." }));
                            }}
                            getOptionLabel={(option) => option} // Display title in the input
                            options={location_list}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={option} {...optionProps}>{option}</li>
                                )
                            }}
                            renderInput={(params) => <TextField error={Boolean(errors.location)} helperText={errors.location} sx={style_textfield} {...params} label="Select Location" />}
                        />
                        :

                        <Autocomplete
                            id="section-list"
                            className="w-full"
                            value={branch_list.find((option) => option === order_method.branch) || null}
                            onChange={(event, new_value) => {
                                set_order_method(prev => ({ ...prev, branch: new_value || "" })); // Handle cases where new_value is null
                                set_errors(prev => ({ ...prev, branch: new_value ? "" : "Please select the branch." }));
                            }}
                            getOptionLabel={(option) => option} // Display title in the input
                            options={branch_list}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={option} {...optionProps}>{option}</li>
                                )
                            }}
                            renderInput={(params) => <TextField error={Boolean(errors.branch)} helperText={errors.branch} sx={style_textfield} {...params} label="Select Branch" />}
                        />

                    }
                    <button onClick={handle_confirm} className='w-full mt-4 py-[12px] text-white bg-rose-600 font-semibold text-[13px] md:text-[14px] tracking-widest transition-all duration-300 rounded-md hover:opacity-70 active:scale-[.97] px-[50px] flex gap-3 items-center justify-center'>
                        <FmdGoodIcon className='text-[17px]' />  SELECT
                    </button>

                </div>
            </Dialog>
        </>

    )
}

export default Location_modal 