import Navbar from '@/components/utilities/Navbar'
import Head from 'next/head'
import Food_item_page from '@/components/Food_item_page'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useStateContext from '@/context/ContextProvider'
import axios from 'axios'

const food_item = () => {

    const router = useRouter();

    const { get_menu_api } = useStateContext();

    const { section_id, menu_id } = router.query;

    const [is_loading, set_is_loading] = useState(false);

    const [item, set_item] = useState(null);

    useEffect(() => {
        if (section_id && menu_id) {
            get_menu_api(axios, section_id, menu_id, set_item, set_is_loading);
        }
    }, [router.query, section_id, menu_id]);



    return (
        <>
            <Head>
                <title>Pizza Buddies | Food</title>
                <meta name="description" content="Food Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Food_item_page
                        item={item}
                        section_id={section_id}
                        is_loading={is_loading}
                    />
                </div>
            </div>
        </>
    )
}

export default food_item
