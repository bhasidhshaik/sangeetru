import React from 'react'

const HeroCard = ({title , text}) => {
  return (
    <div className=' p-6 flex flex-col gap-y-2 border max-w-[400px] rounded-xl border-[#051923]/30 hover:border-[#051923] cursor-default transition-all duration-700'>
        <h4 className=' text-base font-semibold text-color'>{title}</h4>
        <p className=' text-sm font-normal leading-[22px] text-gray-700'>{text}</p>
    </div>



  )
}

export default HeroCard