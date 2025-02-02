import Navbar from '@/components/utilities/Navbar';
import Head from 'next/head';
import Home_page from '@/components/Home_page';
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import axios from 'axios';



export default function Home() {

    
    const [is_loading, set_is_loading] = useState(false);
    const { get_catalog_api, catalog, set_catalog } = useStateContext();
    useEffect(() => {
        if (!catalog.length) {
            get_catalog_api(axios, set_catalog, set_is_loading);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Pizza Buddies | Home</title>
                <meta name="description" content="Home Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Navbar />
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]'>
                    <Home_page
                        catalog={catalog}
                        is_loading={is_loading}
                    />
                </div>
            </div>
        </>
    )
}
