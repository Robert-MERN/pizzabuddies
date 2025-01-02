import Admin_page from "@/components/Admin_page";
import Navbar from "@/components/utilities/Navbar";
import Head from 'next/head';
import jwt from "jsonwebtoken";
import { get_cookie } from "@/utils/functions/cookie";
import axios from "axios";


const collection = () => {
    return (
        <>
            <Head>
                <title>Pizza Buddies | Admin</title>
                <meta name="description" content="Admin Page" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <Navbar admin={true} />
            <div className='w-screen flex flex-col items-center'>
                <div className='w-full min-h-[calc(100vh-70px)] xl:w-[1300px] lg:w-[1100px] lg:px-[40px]' >
                    <Admin_page axios={axios} />
                </div>
            </div>
        </>
    )
}

export default collection


export const getServerSideProps = async ({ req, res }) => {


    // validating user from cookie
    const user_account_token = get_cookie("user_account_token", { req });

    if (user_account_token) {
        const user = jwt.verify(user_account_token, process.env.JWT_KEY);
        return { props: { user } }
    }


    return {
        redirect: {
            destination: "/login",
            permanent: true,
        },
    }
}