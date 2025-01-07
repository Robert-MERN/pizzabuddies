import React, { useEffect, useRef, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { handle_change_options } from '@/utils/functions/multiple_options_logic';
import IconButton from '@mui/material/IconButton';
import { IoClose } from "react-icons/io5";
import Autocomplete from '@mui/material/Autocomplete';



const Update_section = ({
    axios,
    data,
    set_data,
    default_data,
    get_section_api,
    get_section_list_api,
    create_section_api,
    update_section_api,
    upload_image_api,
    API_loading,
    set_API_loading,
    section_id,
    set_section_id,
    section_list,
    set_section_list,
    reset_states,
    toggle_modal,
}) => {

    const banner_input_ref = useRef(null);
    const banner_input_ref_2 = useRef(null);



    // Section Change function
    const [section, set_section] = useState("update-section");

    const handle_change_section = (set_options, arg) => {
        reset_states();
        set_options(default_data)
        set_section(arg);
    };


    useEffect(() => {
        if (section === "update-section") {
            get_section_list_api(axios, set_section_list, set_API_loading);
        };

        if (section_id) {
            get_section_api(axios, section_id, set_data, set_API_loading)
        }
    }, [section, section_id])



    // Handle Submit
    const validate_form = (field_name, val) => {
        let error = '';
        switch (field_name) {
            case "section_title":
                if (!val) {
                    error = "Please enter section title."
                };
                break;
            default:
                break;
        }

        return error;
    }

    const handle_submit = async (set_options) => {
        set_options(prev_options => {
            const copy_options = [...prev_options.options];
            if (copy_options.length) {
                for (let i = 0; i < copy_options.length; i++) {
                    if (!copy_options.at(i).is_added) {
                        copy_options.splice(i, 1);
                    }
                }
            }
            return { ...prev_options, options: copy_options };
        });

        const errors = {};
        Object.keys(data).forEach((field_name) => {
            const error = validate_form(field_name, data[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });

        set_options((prev_options) => ({
            ...prev_options,
            errors,
        }));

        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { section_title, banner_image, ...other } = data;

            if (section === "create-section") {
                let updated_body;
                if (banner_image) {
                    // Uploading Banner Image
                    const banner_image_url = await upload_image_api(axios, banner_image, set_API_loading, "banner");
                    // Adding Banner Image to Body
                    updated_body = { section_title, banner_image: banner_image_url, menu_catalog: [] };
                } else {
                    updated_body = { section_title, banner_image, menu_catalog: [] };
                }

                // Creating Section
                const response = await create_section_api(axios, updated_body, set_API_loading, reset_states);

                if (response === "success") {
                    banner_input_ref_2.current.value = "";
                }

            } else if (section === "update-section") {
                // Uploading Banner Image
                let updated_body;

                if (banner_image && !banner_image.includes("res.cloudinary.com")) {
                    const banner_image_url = await upload_image_api(axios, banner_image, set_API_loading, "banner");
                    // Adding Banner Image to Body
                    updated_body = { section_title, banner_image: banner_image_url };
                } else {
                    updated_body = { section_title, banner_image };
                }
                // Updating Section
                const response = await update_section_api(axios, section_id, updated_body, set_API_loading, reset_states);

                if (response === "success") {
                    banner_input_ref.current.value = "";
                }
            }

        }
    };



    return (
        <>
            {/* Page Heading */}
            <div className='w-full'>
                <h1 className='text-[15px] md:text-[17px] text-slate-500 mb-3  uppercase' >
                    Create/Update Section
                </h1>
            </div>


            {/* Inputs for Section */}
            <div className='w-full shadow-md px-[15px] pb-[30px] py-[10px] flex flex-col gap-6 rounded-md '>
                <h1 className='text-[18px] md:text-[20px] font-medium text-stone-700 pl-1 mb-3 ' >MANAGE SECTION*</h1>

                <div className='w-full flex flex-col sm:flex-row items-center justify-center sm:gap-0 select-none' >
                    <button
                        onClick={() => handle_change_section(set_data, "update-section")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg sm:rounded-bl-lg border uppercase ${section === "update-section" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Update Section
                    </button>

                    <button
                        onClick={() => handle_change_section(set_data, "create-section")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-b-lg sm:rounded-b-none sm:rounded-tr-lg sm:rounded-br-lg border uppercase ${section === "create-section" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Create New Section
                    </button>
                </div>

                {section === "update-section" ?

                    <>
                        <div className='w-full' >
                            <div className='w-full' >
                                <Autocomplete
                                    id="section-list"
                                    className="w-full"
                                    value={section_list.find((option) => option._id === section_id) || null}
                                    onChange={(event, new_value) => {
                                        set_section_id(new_value?._id || ""); // Handle cases where new_value is null
                                    }}
                                    getOptionLabel={(option) => option.section_title} // Display title in the input
                                    options={section_list}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <li key={option._id} {...optionProps}>{option.section_title}</li>
                                        )
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Select Section" />}
                                />
                            </div>
                        </div>


                        {(section_id) &&
                            <>
                                <div className='w-full'>
                                    <TextField
                                        className='w-full'
                                        placeholder='Enter section title'
                                        id="outlined-basic"
                                        label="Section Title"
                                        variant="outlined"
                                        name="section_title"
                                        value={data.section_title}
                                        onChange={(e) => handle_change_options(e, set_data)}
                                        error={Boolean(data.errors.section_title)}
                                        helperText={data.errors.section_title}
                                    />
                                </div>


                                <form>
                                    <FormControl
                                        className="w-full flex flex-col items-start gap-4"
                                    >
                                        {data.banner_image &&
                                            <div className='w-full flex justify-center items-center gap-2 md:gap-4'>
                                                <img className='w-[250px] h-[250px]  md:w-[400px] md:h-[400px] object-contain' src={data.banner_image} alt='Banner Image' />

                                                <IconButton
                                                    type='reset'
                                                    color='error'
                                                    onClick={e => {
                                                        handle_change_options(
                                                            { target: { name: "banner_image", files: [""] } },
                                                            set_data
                                                        );
                                                        if (banner_input_ref.current) {
                                                            banner_input_ref.current.value = "";
                                                        }

                                                    }}
                                                >
                                                    <IoClose className='text-stone-400 text-[22px] md:text-[34px]' />
                                                </IconButton>
                                            </div>

                                        }
                                        <input
                                            ref={banner_input_ref}
                                            name="banner_image"
                                            id="banner_image_input"
                                            className='hidden'
                                            accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                                            type="file"
                                            onChange={e => handle_change_options(e, set_data)}
                                        />

                                        <label
                                            htmlFor="banner_image_input"
                                            className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                                            Select Banner Image
                                        </label>
                                    </FormControl>
                                </form>

                            </>
                        }
                    </>
                    : section === "create-section" ?
                        <>
                            <div className='w-full'>
                                <TextField
                                    className='w-full'
                                    placeholder='Enter section title'
                                    id="outlined-basic"
                                    label="Section Title"
                                    variant="outlined"
                                    name="section_title"
                                    value={data.section_title}
                                    onChange={(e) => handle_change_options(e, set_data)}
                                    error={Boolean(data.errors.section_title)}
                                    helperText={data.errors.section_title}
                                />
                            </div>


                            <form>
                                <FormControl
                                    className="w-full flex flex-col items-start gap-4"
                                >
                                    {data.banner_image &&
                                        <div className='w-full flex justify-center items-center gap-2 md:gap-4'>
                                            <img className='w-[250px] h-[250px]  md:w-[400px] md:h-[400px] object-contain' src={data.banner_image} alt='Banner Image' />

                                            <IconButton
                                                type='reset'
                                                color='error'
                                                onClick={e => {
                                                    handle_change_options(
                                                        { target: { name: "banner_image", files: [""] } },
                                                        set_data
                                                    );
                                                    if (banner_input_ref_2.current) {
                                                        banner_input_ref_2.current.value = "";
                                                    }

                                                }}
                                            >
                                                <IoClose className='text-stone-400 text-[22px] md:text-[34px]' />
                                            </IconButton>
                                        </div>

                                    }
                                    <input
                                        ref={banner_input_ref_2}
                                        name="banner_image"
                                        id="banner_image_input"
                                        className='hidden'
                                        accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                                        type="file"
                                        onChange={e => handle_change_options(e, set_data)}
                                    />

                                    <label
                                        htmlFor="banner_image_input"
                                        className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                                        Select Banner Image
                                    </label>
                                </FormControl>
                            </form>

                        </>
                        :
                        <></>
                }
                {/* End */}

            </div>








            <div className={`w-full flex mb-[30px] ${section === "update-section" && section_id ? "justify-between" : "justify-end"}`}>
                {(section === "update-section" && section_id) &&

                    <button onClick={() => toggle_modal("delete_section_modal")} className='px-[28px] py-[8px] bg-red-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded '>
                        DELETE
                    </button>
                }
                {((section === "update-section" && section_id) || section === "create-section") &&

                    <button onClick={() => handle_submit(set_data)} className='px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded '>
                        {section === "update-section" ? "UPDATE" : "SAVE"}
                    </button>
                }
            </div>

        </>
    )
}


export default Update_section