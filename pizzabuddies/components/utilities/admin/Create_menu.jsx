import React, { useEffect, useRef, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import {
    handle_change_options,
    edit_option, add_option,
    delete_option_values,
    delete_option,
    save_option
} from '@/utils/functions/multiple_options_logic';
import { IoClose } from "react-icons/io5";
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';



const Create_menu = ({
    axios,
    data,
    set_data,
    helper_index,
    set_helper_index,
    default_data,
    get_section_list_api,
    create_catalog_api,
    create_menu_api,
    upload_image_api,
    API_loading,
    set_API_loading,
    section_id,
    set_section_id,
    section_list,
    set_section_list,
    reset_states,
}) => {

    const image_input_ref = useRef(null);
    const banner_input_ref = useRef(null);



    // Section Change function
    const [section, set_section] = useState("use-existing");

    const handle_change_section = (set_options, arg) => {
        set_section_id("");
        set_options(default_data)
        set_section(arg);
    }



    // Fetching Section list
    useEffect(() => {
        if (section === "use-existing") get_section_list_api(axios, set_section_list, set_API_loading);
    }, [section, section_id]);

    // Handle Submit
    const validate_form = (field_name, val) => {
        let error = '';
        switch (field_name) {
            case "section_title":
                if (!val && section === "create-new") {
                    error = "Please enter section title."
                };
                break;
            case "menu_title":
                if (!val) {
                    error = "Please enter menu title."
                };
                break;
            case "menu_image":
                if (!val) {
                    error = "Please select the menu image.";
                };
                break;
            case "price":
                if (!val) {
                    error = "Please enter menu price."
                };
                break;
            case "compare_price":
                if (val && !data.price) {
                    error = "Compare price can't be added without an actual Price."
                };
                if (val && data.price && (Number(val) < Number(data.price))) {
                    error = "Compare price should be greater than the actual Price."
                };
                break;
            case "description":
                if (!val) {
                    error = "Please enter the Menu description.";
                };
                break;
            default:
                break;
        }

        return error;
    }

    const handle_submit = async (set_options) => {
        // Validate Form Fields
        const errors = {};
        Object.keys(data).forEach((field_name) => {
            const error = validate_form(field_name, data[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });

        // Update Errors in State
        let realtime_data = await new Promise((resolve) => {
            set_options((prev_options) => {
                const updated = { ...prev_options, errors };
                resolve(updated);
                return updated;
            });
        });

        // Remove Unadded Options
        realtime_data = await new Promise((resolve) => {
            set_options((prev_options) => {
                const filtered_options = prev_options.options.filter((option) => option.is_added);
                const updated = { ...prev_options, options: filtered_options };
                resolve(updated);
                return updated;
            });
        });

        // Check if Errors Exist
        if (!Object.values(errors).every((error) => !error)) return;

        // Extract Data for Submission
        const { errors: _, section_title, banner_image, menu_image, ...other } = realtime_data;

        if (section === "create-new") {
            // Handle "Create New" Section
            let banner_image_url = "";
            if (banner_image) {
                banner_image_url = await upload_image_api(axios, banner_image, set_API_loading, "banner");
            }

            let menu_image_url = "";
            if (menu_image) {
                menu_image_url = await upload_image_api(axios, menu_image, set_API_loading);
            }

            const updated_body = {
                ...other,
                section_title,
                banner_image: banner_image_url,
                menu_image: menu_image_url,
            };

            const response = await create_catalog_api(axios, updated_body, set_API_loading, reset_states);

            if (response === "success") {
                banner_input_ref.current.value = "";
                image_input_ref.current.value = "";
            }
        } else if (section === "use-existing") {
            // Handle "Use Existing" Section
            let menu_image_url_2 = "";
            if (menu_image) {
                menu_image_url_2 = await upload_image_api(axios, menu_image, set_API_loading);
            }

            const updated_body = {
                ...other,
                menu_image: menu_image_url_2,
            };

            const response = await create_menu_api(axios, section_id, updated_body, set_API_loading, reset_states);

            if (response === "success") {
                image_input_ref.current.value = "";
            }
        }
    };


    return (
        <>
            {/* Page Heading */}
            <div className='w-full'>
                <h1 className='text-[15px] md:text-[17px] text-slate-500 mb-3  uppercase' >
                    Create Menu
                </h1>
            </div>


            {/* Inputs for Section */}
            <div className='w-full shadow-md px-[15px] pb-[30px] py-[10px] flex flex-col gap-6 rounded-md '>
                <h1 className='text-[18px] md:text-[20px] font-medium text-stone-700 pl-1 mb-3 ' >SECTION*</h1>

                <div className='w-full flex flex-col sm:flex-row items-center justify-center sm:gap-0 select-none' >
                    <button
                        onClick={() => handle_change_section(set_data, "use-existing")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg sm:rounded-bl-lg border uppercase ${section === "use-existing" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Use Existing Section
                    </button>

                    <button
                        onClick={() => handle_change_section(set_data, "create-new")}
                        className={`w-full text-[16px] py-[10px] md:py-[12px] hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded-b-lg sm:rounded-b-none sm:rounded-tr-lg sm:rounded-br-lg border uppercase ${section === "create-new" ? "text-white bg-black border-black" : "text-stone-500 bg-white border-stone-400"}`}>
                        Create New Section
                    </button>
                </div>

                {section === "use-existing" ?

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
                    :
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

                    </>
                }
                {/* End */}

            </div>


            {(Boolean(section === "create-new") || Boolean(section === "use-existing" && Boolean(section_id))) &&
                <>

                    {/* Inputs for Menu */}
                    <div className='w-full mt-[30px] shadow-md px-[15px] pb-[30px] pt-[10px] flex flex-col gap-6 rounded-md'>

                        <h1 className='text-[18px] md:text-[20px] font-medium text-stone-700 pl-1 mb-3' >MENU*</h1>

                        <FormControl
                            className="w-full flex flex-col items-start"
                            error={Boolean(data.errors.menu_image)}
                        >
                            <div className='w-full flex flex-col items-start gap-4'>
                                {data.menu_image &&
                                    <div className='w-full flex justify-center items-center gap-2 md:gap-4'>
                                        <img className='w-[250px] h-[250px]  md:w-[400px] md:h-[400px] object-contain' src={data.menu_image} alt='Menu Image' />

                                        <IconButton
                                            type='reset'
                                            color='error'
                                            onClick={e => {
                                                handle_change_options(
                                                    { target: { name: "menu_image", files: [""] } },
                                                    set_data
                                                );
                                                if (image_input_ref.current) {
                                                    image_input_ref.current.value = "";
                                                }

                                            }}
                                        >
                                            <IoClose className='text-stone-400 text-[22px] md:text-[34px]' />
                                        </IconButton>
                                    </div>
                                }
                                <input
                                    ref={image_input_ref}
                                    name="menu_image"
                                    id="menu_image_input"
                                    className='hidden'
                                    accept='.jpg, .jpeg, .png, .svg, .ico, .webp'
                                    type="file"
                                    onChange={e => handle_change_options(e, set_data)}
                                />

                                <label
                                    htmlFor="menu_image_input"
                                    className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase'>
                                    Select Menu Image
                                </label>
                            </div>
                            {Boolean(data.errors.menu_image) && <FormHelperText>{data.errors.menu_image}</FormHelperText>}
                        </FormControl>

                        <div className="w-full">
                            <TextField
                                className='w-full'
                                placeholder='Enter menu title'
                                id="outlined-basic"
                                label="Menu Title"
                                variant="outlined"
                                name="menu_title"
                                value={data.menu_title}
                                onChange={(e) => handle_change_options(e, set_data)}
                                error={Boolean(data.errors.menu_title)}
                                helperText={data.errors.menu_title}
                            />
                        </div>

                        <div className="w-full">
                            <TextField
                                className='w-full'
                                placeholder='Enter Price'
                                id="outlined-basic"
                                label="Price"
                                variant="outlined"
                                type="number"
                                name="price"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={data.price}
                                onChange={(e) => handle_change_options(e, set_data)}
                                error={Boolean(data.errors.price)}
                                helperText={data.errors.price}
                            />
                        </div>

                        <div className="w-full">
                            <TextField
                                className='w-full'
                                placeholder='Enter Compare Price'
                                id="outlined-basic"
                                label="Compare Price"
                                variant="outlined"
                                type='number'
                                name="compare_price"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                value={data.compare_price}
                                onChange={(e) => handle_change_options(e, set_data)}
                                error={Boolean(data.errors.compare_price)}
                                helperText={data.errors.compare_price}
                            />
                        </div>

                        <div className="w-full">
                            <TextField
                                className='w-full'
                                placeholder='Enter Description'
                                id="outlined-basic"
                                label="Description"
                                variant="outlined"
                                name="description"
                                value={data.description}
                                onChange={(e) => handle_change_options(e, set_data)}
                                error={Boolean(data.errors.description)}
                                helperText={data.errors.description}
                            />
                        </div>
                        {/* End */}
                    </div>

                    {/* Options and Variants */}

                    < div className='w-full mb-[30px] border-y shadow-md flex flex-col gap-4 rounded-md'>


                        {/* Multiple Options */}
                        {Boolean(data.options.length) && data.options.map((option, index) => (
                            <div key={index}>
                                {option.is_added ?
                                    <div className={`w-full px-[20px] pt-[20px] pb-[10px] flex justify-between items-center ${index > 0 ? "border-t-2 border-stone-300" : ""}`}>

                                        <div className='flex flex-col gap-2'>
                                            <h1 className='text-[18px] font-bold pl-2 capitalize'>{option.option_name}</h1>
                                            <div className='flex flex-wrap w-full gap-2' >
                                                {option.values.map((e, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={e.option_value}
                                                        className='capitalize'
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => edit_option(set_data, index, set_helper_index)}
                                            className='px-[14px] py-[4px] border-2 border-stone-300 rounded-md font-bold active:bg-stone-200 hover:bg-stone-100 transition-all'
                                        >
                                            Edit
                                        </button>

                                    </div>
                                    :
                                    <div className={`w-full flex flex-col gap-4 px-[20px] pt-[30px] pb-[10px] ${index > 0 ? "border-t-2 border-stone-300" : ""}`}>
                                        <p className='text-[15px] text-stone-400  leading-[18px]'>After making the option(s), click on the "DONE" button before you save this Menu otherwise the option will not be saved.</p>

                                        <p className='text-[15px] text-stone-400  leading-[18px]'>Even when you're editng option, click on the "DONE" button after you make changes, otherwise hitting "SAVE" button directly will remove that option.</p>

                                        <div className='w-full flex items-center gap-2 lg:justify-end mb-3' >
                                            <p className='text-[15px] text-stone-500 font-semibold  leading-[18px]'>Options Selectable</p>
                                            <Switch
                                                checked={option.options_selectable}
                                                onChange={(e) => handle_change_options(
                                                    {
                                                        target: {
                                                            value: e.target.checked,
                                                            name: "options_selectable"
                                                        }
                                                    },
                                                    set_data,
                                                    index
                                                )}
                                            />
                                        </div>

                                        <div className="w-full flex gap-2 mb-4">
                                            <TextField
                                                className='w-full'
                                                placeholder='Enter Option Name'
                                                id="outlined-basic"
                                                label="Option Name"
                                                variant="outlined"
                                                name="option_name"
                                                value={option.option_name}
                                                onChange={(e) => handle_change_options(e, set_data, index)}
                                                error={Boolean(option.option_error)}
                                                helperText={option.option_error}
                                            />
                                        </div>


                                        {/* Array of Options */}
                                        {option.values.map((each, index_2) => (

                                            <div key={index_2} className='w-full' >
                                                <div className="w-full flex gap-2 items-center">
                                                    <div className='w-full flex gap-2' >

                                                        <TextField
                                                            className='w-full'
                                                            placeholder='Enter Option Value'
                                                            id="outlined-basic"
                                                            label="Option Value"
                                                            variant="outlined"
                                                            name="option_value"
                                                            size="small"
                                                            value={each.option_value}
                                                            onChange={(e) => handle_change_options(e, set_data, index, index_2)}
                                                            error={Boolean(each.values_error)}
                                                            helperText={each.values_error}
                                                        />
                                                        <TextField
                                                            className='w-fit'
                                                            type="number"
                                                            placeholder='00'
                                                            id="outlined-basic"
                                                            label="Price"
                                                            variant="outlined"
                                                            name="option_price"
                                                            size="small"
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true,
                                                                },
                                                            }}
                                                            value={each.option_price}
                                                            onChange={(e) => handle_change_options(e, set_data, index, index_2)}
                                                        />
                                                        <TextField
                                                            className='w-fit'
                                                            type="number"
                                                            placeholder='00'
                                                            id="outlined-basic"
                                                            label="Compare Price"
                                                            variant="outlined"
                                                            name="option_compare_price"
                                                            size="small"
                                                            slotProps={{
                                                                inputLabel: {
                                                                    shrink: true,
                                                                },
                                                            }}
                                                            value={each.option_compare_price}
                                                            onChange={(e) => handle_change_options(e, set_data, index, index_2)}
                                                        />
                                                    </div>
                                                    {Boolean(each.option_value) &&

                                                        <IconButton
                                                            onClick={() => delete_option_values(set_data, index, index_2)}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>

                                                    }
                                                </div>
                                            </div>
                                        ))}

                                        <div className='flex items-center justify-between mt-4'>

                                            <button
                                                onClick={() => delete_option(set_data, index, set_helper_index)}
                                                className='w-fit px-[16px] py-[6px] bg-red-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded'
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={() => save_option(set_data, index, set_helper_index)}
                                                className='w-fit px-[18px] py-[6px] bg-white border border-stone-300 text-black active:opacity-50 transition-all text-nowrap rounded hover:bg-stone-500 hover:text-white'
                                            >
                                                Done
                                            </button>
                                        </div>

                                    </div>
                                }
                            </div>
                        ))}

                        {/* Add Multiple Options Button */}
                        <div className={`w-full p-[20px]  ${Boolean(data.options.length) ? "border-t-2 border-stone-300" : ""}`}>
                            <button
                                onClick={() => add_option(set_data, ((helper_index !== "") ? helper_index : -1), set_helper_index)}
                                className='w-full text-blue-500 hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-start font-bold flex items-center gap-2'
                            >
                                {Boolean(data.options.length) ?
                                    <>
                                        <AddIcon />
                                        Add another option
                                    </>
                                    :
                                    <>
                                        <AddIcon />
                                        Add options
                                    </>
                                }
                            </button>
                        </div>

                    </div>



                    <div onClick={() => handle_submit(set_data, data)} className="w-full flex justify-end mb-[30px]">
                        <button className='w-full lg:w-fit lg:px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded '>
                            SAVE
                        </button>
                    </div>
                </>
            }
        </>
    )
}

export default Create_menu