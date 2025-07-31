import React from 'react'
import Link from 'next/link'

const NavLink = ({link,text}) => {
  return (
    <li>
        <Link className='text-color font-medium transition-colors text-[.9rem]' href={link}>{text}</Link>

    </li>
  )
}

export default NavLink