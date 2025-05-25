import React from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import ConnectButton from '../ConnectButton/ConnectButton';

function NavBar() {
    
    const navigate = useNavigate();


  return (
    <nav className=' mt-10  font-bold text-xl flex items-center justify-between self-end'>
            <h1 className='ml-[10vh] shrink'>
                NAME
            </h1>
            <div className='gradient-bg shrink-0 min-w-fit w-1/2 p-2 flex items-center justify-around'>
            <button onClick={()=> navigate("/")}>
                Home
            </button>
            <button onClick={()=> navigate("/about")}>
               About 
            </button>
            <ConnectButton  className='border-2 p-2 border-gray-950 rounded-xl hover:bg-gray-950'/>
            </div>
    </nav>

  )
}

export default NavBar
