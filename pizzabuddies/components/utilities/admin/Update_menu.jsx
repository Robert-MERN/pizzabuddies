import React, { useEffect, useRef } from 'react'
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




const Update_menu = ({
    axios,
    data,
    set_data,
    helper_index,
    set_helper_index,
    get_section_list_api,
    get_menu_list_api,
    get_menu_api,
    update_menu_api,
    upload_image_api,
    API_loading,
    set_API_loading,
    section_id,
    set_section_id,
    menu_id,
    set_menu_id,
    section_list,
    set_section_list,
    menu_list,
    set_menu_list,
    reset_states,
    toggle_modal,
}) => {

    const image_input_ref = useRef(null);




    useEffect(() => {
        get_section_list_api(axios, set_section_list, set_API_loading);

        if (section_id) {
            get_menu_list_api(axios, section_id, set_menu_list, set_API_loading);
        };

        if (menu_id) {
            get_menu_api(axios, section_id, menu_id, set_data, set_API_loading);
        }

    }, [section_id, menu_id]);


    // Handle Submit
    const validate_form = (field_name, val) => {
        let error = '';
        switch (field_name) {
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
        // Step 1: Compute Errors
        const errors = {};
        Object.keys(data).forEach((field_name) => {
            const error = validate_form(field_name, data[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });

        // Step 2: Update State with Errors
        const updatedOptions = await new Promise((resolve) => {
            set_options((prev_options) => {
                const updated = { ...prev_options, errors };
                resolve(updated); // Capture the updated state
                return updated;
            });
        });

        // Step 3: Filter Options and Update State
        const cleanedOptions = await new Promise((resolve) => {
            set_options((prev_options) => {
                const copy_options = [...prev_options.options];
                if (copy_options.length) {
                    for (let i = 0; i < copy_options.length; i++) {
                        if (!copy_options.at(i).is_added) {
                            copy_options.splice(i, 1);
                        }
                    }
                }
                const updated = { ...prev_options, options: copy_options };
                resolve(updated); // Capture the updated state
                return updated;
            });
        });

        // Step 4: Validation and Submission
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid
            const { errors, section_title, banner_image, menu_image, ...other } = cleanedOptions;

            let updated_body;
            if (menu_image && !menu_image.includes("res.cloudinary.com")) {
                // Uploading Menu Image
                const menu_image_url = await upload_image_api(axios, menu_image, set_API_loading);
                updated_body = { menu_image: menu_image_url, ...other };
            } else {
                updated_body = { menu_image, ...other };
            }

            // Updating Menu
            const response = await update_menu_api(axios, section_id, menu_id, updated_body, set_API_loading, reset_states);

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
                    Update Menu
                </h1>
            </div>

            {/* Inputs for Section */}
            <div className='w-full shadow-md px-[15px] pb-[30px] py-[10px] flex flex-col gap-6 rounded-md '>


                <h1 className='text-[18px] md:text-[20px] font-medium text-stone-700 pl-1 mt-3 ' >SELECT SECTION*</h1>



                {/* Section Selection */}

                <div className='w-full' >
                    <Autocomplete
                        id="section-list"
                        className="w-full"
                        value={section_list.find((option) => option._id === section_id) || null}
                        onChange={(event, new_value) => {
                            set_section_id(new_value?._id || ""); // Handle cases where new_value is null
                            set_menu_id("");
                        }}
                        getOptionLabel={(option) => option.section_title} // Display title in the input
                        options={section_list}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li key={option._id} {...optionProps}>{option.section_title}</li> // Render options correctly
                            )
                        }}
                        renderInput={(params) => <TextField {...params} label="Select Section" />}
                    />
                </div>


                {/* Menu Selection */}
                {(section_id) &&
                    <>
                        <h1 className='text-[18px] md:text-[20px] font-medium text-stone-700 pl-1 mt-3 ' >SELECT MENU*</h1>

                        <div className='w-full' >
                            <Autocomplete
                                id="menu-list"
                                className="w-full"
                                value={menu_list.find((option) => option._id === menu_id) || null}
                                onChange={(event, new_value) => {
                                    set_menu_id(new_value?._id || ""); // Handle cases where new_value is null
                                }}
                                getOptionLabel={(option) => option.menu_title} // Display title in the input
                                options={menu_list}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={option._id} {...optionProps}>{option.menu_title}</li>
                                    )
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Menu" />}
                            />
                        </div>
                    </>
                }
                {/* End */}

            </div>


            {(menu_id) &&
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
                                    className='w-full py-[10px] bg-indigo-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-center cursor-pointer select-none uppercase text-[14px]'>
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
                                            className='px-[14px] py-[4px] border-2 border-stone-300 rounded-md font-semibold active:bg-stone-200 hover:bg-stone-100 transition-all text-[13px]'
                                        >
                                            Edit
                                        </button>

                                    </div>
                                    :
                                    <div className={`w-full flex flex-col gap-4 px-[20px] pt-[30px] pb-[10px] ${index > 0 ? "border-t-2 border-stone-300" : ""}`}>
                                        <p className='text-[15px] text-stone-400  leading-[18px]'>After making the option(s), click on the "DONE" button before you save this Menu otherwise the option will not be saved.</p>

                                        <p className='text-[15px] text-stone-400  leading-[18px]'>Even when you're editng option, click on the "DONE" button after you make changes, otherwise hitting "SAVE" button directly will remove that option.</p>

                                        {/* Switch options */}
                                        <div className={`w-full mb-3`}>

                                            <div className={`w-full flex items-center gap-2 lg:justify-end`} >
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

                                            {option.options_selectable &&
                                                <div className='w-full flex items-center gap-2 lg:justify-end' >
                                                    <p className='text-[15px] text-stone-500 font-semibold  leading-[18px]'>Make Optional</p>
                                                    <Switch
                                                        checked={option.options_optional}
                                                        onChange={(e) => handle_change_options(
                                                            {
                                                                target: {
                                                                    value: e.target.checked,
                                                                    name: "options_optional"
                                                                }
                                                            },
                                                            set_data,
                                                            index
                                                        )}
                                                    />
                                                </div>
                                            }
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
                                                className='w-fit px-[16px] py-[6px] bg-red-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[13px]'
                                            >
                                                Delete
                                            </button>

                                            <button
                                                onClick={() => save_option(set_data, index, set_helper_index)}
                                                className='w-fit px-[18px] py-[6px] bg-white border border-stone-300 text-black active:opacity-50 transition-all text-nowrap rounded hover:bg-stone-500 hover:text-white text-[13px]'
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



                    <div className="w-full flex justify-between mb-[30px]">
                        <button onClick={() => toggle_modal("delete_menu_modal")} className='px-[28px] py-[8px] bg-red-500 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[14px]'>
                            DELETE
                        </button>

                        <button onClick={() => handle_submit(set_data)} className='px-[28px] py-[8px] bg-emerald-600 text-white hover:opacity-75 active:opacity-50 transition-all text-nowrap rounded text-[14px]'>
                            UPDATE
                        </button>
                    </div>
                </>}
        </>
    )
}

export default Update_menu