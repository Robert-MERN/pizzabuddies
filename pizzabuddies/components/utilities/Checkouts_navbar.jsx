import React from 'react'
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";
import Link from 'next/link';



const Checkouts_navbar = () => {
    return (
        <div className='w-full h-full flex justify-center items-center px-[20px]'>
            <div className='w-full flex justify-between items-center md:px-[40px]'>

                <Link href="/" >
                    <div>
                        <Image
                            alt="logo"
                            src={logo}
                            className='w-[100px] object-contain'
                        />
                    </div>
                </Link>

                <Link href="/cart" >
                    <div>
                        <button className="active:text-stone-100 text-stone-200 transition-all">
                            <FiShoppingCart className="text-[24px]" />
                        </button>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Checkouts_navbar