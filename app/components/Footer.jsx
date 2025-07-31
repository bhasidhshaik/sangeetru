import React from 'react'
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className=' border-t border-gray-300'>
        <div className='max-w-[1200px] mx-auto md:p-8 p-3 text-center' >
            <div className='flex flex-col justify-between items-center gap-y-2'>
                <h2 className=' text-color font-bold'>SangeeTru.</h2>
                <p className='text-gray-500'>© 2025 All rights reserved</p>
<p className="text-gray-500">
  Special thanks to <Link href="https://harmonicsurvey.com/" target='_blank'  rel="noopener noreferrer" className="underline hover:text-gray-700">Harmonic Survey</Link> for their lyrics — from SangeeTru.
</p>
                <p className='text-gray-500'>Designed and developed by <Link href={'https://shaik-bhasidh.vercel.app/'} target='_blank'   rel="noopener noreferrer" className='underline'>Shaik Bhasidh</Link> </p>

            </div>
        </div>
    </footer>
  )
}

export default Footer