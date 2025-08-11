import React, { useState } from 'react'
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi"
import SideMenu from './SideMenu'
import logo from "../../assets/logo.png"

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className="flex gap-5 bg-white border border-b-2 border-[#F1F5F9] backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <button className='block lg:hidden text-black' onClick={() => {
                setOpenSideMenu(!openSideMenu)
            }}>
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>

            <img
                src={logo}
                alt="Task Manager Logo"
                className="h-8 sm:h-8 md:h-8 w-auto object-contain"
            />


            {openSideMenu && (
                <div className="fixed top-[61px] -ml-4 bg-white ">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    )
}

export default Navbar
