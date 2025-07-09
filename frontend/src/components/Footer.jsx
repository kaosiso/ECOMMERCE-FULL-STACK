import React from 'react'

const Footer = () => {
  return (
    <div>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
      <div>
        <h1 className='logo'>Everest</h1>
       <p className="text-sm text-gray-500 leading-relaxed">
            Everest brings you the latest fashion trends. From seasonal
            essentials to exclusive collections, shop your style your way.
          </p>
      </div>
      <div>
        <p className='text-xl font-medium mb-5' >COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
         <li>Home</li>
         <li>About Us</li>
         <li>Delivery</li>
         <li>Privacy Policy</li>
        </ul>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1-222-345-6789</li>
            <li>contact@everest.com</li>

        </ul>
      </div>
    </div>
    <div>
        <hr/>
        <p className='py-5 text-sm text-center'>Copyright 2024@everest.com - All Right Reserved</p>
    </div>
    </div>
  )
}

export default Footer
