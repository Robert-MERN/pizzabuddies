import Checkouts_page from '@/components/Checkouts_page'
import Checkouts_navbar from '@/components/utilities/Checkouts_navbar'
import Head from 'next/head'
import axios from 'axios'


export default function Checkouts() {


    return (
        <>
            <Head>
                <title>Pizza Buddies | Checkouts</title>
                <meta name="description" content="Checkouts Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <div className='w-full flex justify-center border-b border-stone-200 bg-stone-950'>
                    <div className='w-full h-[80px] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                        <Checkouts_navbar />
                    </div>
                </div>
                <div className='w-full min-h-[calc(100vh-70px)] 2xl:w-[1650px] xl:w-[1400px] lg:w-[1100px] lg:px-[40px]' >
                    <Checkouts_page axios={axios} />
                </div>
            </div>
        </>
    )
}
