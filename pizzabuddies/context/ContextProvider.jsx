import React, { useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import imageCompression from 'browser-image-compression';


const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const router = useRouter();

    // Notification logic
    const [snackbar_alert, set_snackbar_alert] = useState({
        open: false,
        message: "",
        severity: "primary"
    });
    const close_snackbar = () => {
        set_snackbar_alert(prev => ({ ...prev, open: false }));
    };

    // Modal Logic
    const default_modals_state = {
        delete_menu_modal: false,
        delete_section_modal: false,
    };
    const [modals_state, set_modals_state] = useState(default_modals_state);

    const toggle_modal = (modal) => {
        set_modals_state(prev => ({ ...default_modals_state, [modal]: !prev[modal] }));
    };




    // Drawer Logic
    const default_drawer_state = {
        sort_drawer: false,
        food_menu_drawer: false,
    }
    const [drawer_state, set_drawer_state] = useState(default_drawer_state);

    const toggle_drawer = (drawer) => {
        set_drawer_state(prev => ({ ...default_drawer_state, [drawer]: !prev[drawer] }));
    };


    // Cart Logic
    const [cart, set_cart] = useState([]);

    const sum_of_cart = () => cart.reduce((prev, next) => prev + (next.price * next.quantity), 0);

    const delete_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)
            updated_cart.splice(index, 1);
            return updated_cart;
        });
    }

    const add_item_to_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];

            const index = updated_cart.findIndex((each) => each._id === item._id);

            if (index !== -1) {
                const new_item = { ...item, quantity: item.quantity + 1 }
                updated_cart.splice(index, 1, new_item);
                set_snackbar_alert({
                    open: true,
                    message: "Item added to you cart",
                    severity: "primary"
                });
                return updated_cart;
            }

            set_snackbar_alert({
                open: true,
                message: "Item added to you cart",
                severity: "primary"
            });
            return [...updated_cart, { ...item, quantity: 1 }];
        });
    }

    const substract_item_from_cart = (item) => {
        set_cart((prev_cart) => {
            const updated_cart = [...prev_cart];
            const index = updated_cart.findIndex((each) => each._id === item._id)

            if (Number(item.quantity - 1) < 1) {
                updated_cart.splice(index, 1);
                return updated_cart;
            }
            const new_item = { ...item, quantity: item.quantity - 1 }
            updated_cart.splice(index, 1, new_item);
            return updated_cart;
        });
    }


    // Resturant Admin Logic
    const default_data = {
        section_title: "",
        banner_image: "",
        menu_title: "",
        menu_image: "",
        price: "",
        compare_price: "",
        description: "",
        options: [],
        errors: {
            section_title: "",
            menu_title: "",
            menu_image: "",
            price: "",
            compare_price: "",
            description: "",
        }
    }
    // Data 
    const [data, set_data] = useState(default_data);
    // Retreiving Section ID
    const [section_id, set_section_id] = useState(null);
    // Retreiving Menu ID
    const [menu_id, set_menu_id] = useState(null);
    // Section Autocomplete Options List
    const [section_list, set_section_list] = useState([])
    // Menu Autocomplete Options List
    const [menu_list, set_menu_list] = useState([])
    // Retreiving Index for managing options state seamlessly
    const [helper_index, set_helper_index] = useState("");
    // resetting all the Admin states
    const reset_states = () => {
        set_data(default_data);
        set_menu_id(null);
        set_section_id(null);
        set_section_list([]);
        set_menu_list([]);
        set_helper_index("");
    }
    // Chnaging Sidbar options
    const [sidebar, set_sidebar] = useState("create-menu");
    const handle_sidebar = (value) => {
        set_sidebar(value);
        reset_states();
    }

    //<----------------------- API Calls and Handlers [Back-end] ----------------------->
    // API loader
    const [API_loading, set_API_loading] = useState(false)


    // Get Menu Catalog
    const get_catalog_api = async (axios, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get("/api/get_catalog");
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }


    // Get Section API 
    const get_section_api = async (axios, section_id, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_section?section_id=${section_id}`);

            const { _id, ...other } = res.data;
            set_state((prev_state) => ({ ...prev_state, ...other }));
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }


    // Get Menu API
    const get_menu_api = async (axios, section_id, menu_id, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_menu?section_id=${section_id}&menu_id=${menu_id}`);
            const { _id, ...other } = res.data;
            set_state((prev_state) => ({ ...prev_state, ...other }));
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Get Menu List API
    const get_menu_list_api = async (axios, section_id, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_menu_list?section_id=${section_id}`);
            if (res.data.length) {
                set_state(res.data);
            }
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Get Section List API
    const get_section_list_api = async (axios, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get("/api/get_section_list");
            if (res.data.length) {
                set_state(res.data);
            }
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Create Catalog API
    const create_catalog_api = async (axios, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post("/api/create_catalog", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            if (reset_states) {
                reset_states();
            };
            return "success";
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Create Menu API
    const create_menu_api = async (axios, section_id, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post(`/api/create_menu?section_id=${section_id}`, data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });
            if (reset_states) {
                reset_states();
            }
            return "success";
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Create Section API
    const create_section_api = async (axios, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post(`/api/create_section`, data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });
            if (reset_states) {
                reset_states();
            };
            return "success";
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Update Section API
    const update_section_api = async (axios, section_id, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/update_section?section_id=${section_id}`, data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });
            if (reset_states) {
                reset_states();
            };
            return "success";
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Update Menu API
    const update_menu_api = async (axios, section_id, menu_id, data, set_is_loading, reset_states) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/update_menu?section_id=${section_id}&menu_id=${menu_id}`, data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            if (reset_states) {
                reset_states();
            }
            return "success";
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Delete Section API 
    const delete_section_api = async (axios, section_id, set_is_loading, reset_states, toggle) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/delete_section?section_id=${section_id}`);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            })
            if (reset_states) {
                reset_states();
            };
            if (toggle) {
                toggle();
            };
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };


    // Delete Menu API
    const delete_menu_api = async (axios, section_id, menu_id, set_is_loading, reset_states, toggle) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.put(`/api/delete_menu?section_id=${section_id}&menu_id=${menu_id}`);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });
            if (reset_states) {
                reset_states();
            };
            if (toggle) {
                toggle();
            };
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };



    // Login API
    const login_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/login", data);
            router.push("/admin");
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }


    // Upload Image API 
    const upload_image_api = async (axios, objectURL, set_is_loading) => {
        set_is_loading(true);
        const formData = new FormData();
        const options = {
            maxSizeMB: 1, // Compress to ~1MB
            maxWidthOrHeight: 1920, // Resize if needed
            useWebWorker: true, // Use Web Worker for better performance
        };

        try {
            if (objectURL) {
                // Compress the file

                const FILE = await fetch(objectURL); // Fetch the binary data
                const file = await FILE.blob();
                const compressedFile = await imageCompression(file, options);
                formData.append('file', compressedFile); // The image file
                formData.append('upload_preset', 'myCloud');

                const res = await axios.post(`https://api.cloudinary.com/v1_1/dceqyrfhu/image/upload`, formData);

                // Revoking Blob URL
                URL.revokeObjectURL(objectURL);

                // Returning the image url
                return res.data.secure_url || ""
            };
            return "";

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: "Failed to upload image.",
                severity: "error",
            })
        } finally {
            set_is_loading(false);
        }
    }



    return (
        <StateContext.Provider
            value={{
                snackbar_alert, set_snackbar_alert, close_snackbar,

                toggle_modal, modals_state,

                toggle_drawer, drawer_state,

                cart, set_cart, sum_of_cart, delete_item_from_cart, add_item_to_cart,
                substract_item_from_cart,

                sidebar, handle_sidebar,

                data, set_data, default_data,

                section_id, set_section_id, menu_id, set_menu_id,

                section_list, set_section_list, menu_list, set_menu_list,

                helper_index, set_helper_index,

                reset_states,

                API_loading, set_API_loading,

                get_catalog_api, get_section_api, get_menu_api, get_menu_list_api, get_section_list_api, create_catalog_api, create_menu_api, create_section_api, update_section_api, update_menu_api, delete_section_api, delete_menu_api,

                login_api,

                upload_image_api,

            }}
        >
            {children}
        </StateContext.Provider>
    )
}

const useStateContext = () => useContext(StateContext);



export default useStateContext