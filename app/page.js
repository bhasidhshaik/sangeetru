import { tangerine } from "./layout";
import { LuPenLine } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";

import Link from "next/link";
import HeroCard from "./components/HeroCard";
export default function Home() {
  const sections = [
    {
      id:0,
      title: "Express Through Lyrics",
      text: "Music speaks when words fall short. Choose a song that captures your emotions and dedicate its lyrics to someone special in a meaningful way.",
    },
    {
      id:1,
      title: "Create a Unique Link",
      text: "Transform your dedication into a beautifully synced lyrics experience. Our platform generates a special link for your message.",
    },
    {
      id:2,
      title: "Share the Feeling",
      text: "Send your unique link to friends, family, or loved ones, and let them experience the lyrics in a way that feels personal and unforgettable.",
    },
  ];
  
  return (
    <>
    <div className="flex flex-col items-center min-h-screen md:py-12 py-6 px-4">
      <div className=" flex flex-col items-center gap-y-8">
        <div className=" flex flex-col md:gap-y-6 gap-y-2 items-center">
          <div>
            <h3 className= {` ${tangerine.className} text-center text-color tangerine-font md:text-6xl text-3xl font-tangerine`}>Dedicate a Song with Lyrics in Seconds. </h3>
          </div>
          <div>
            <h2 className=" text-center font-semibold text-[#595959] gap-x-[3px] md:text-lg text-sm">
           <span> Create a personalized music message and share it with your loved ones. </span><span className=" inline-block"><IoMdHeartEmpty /></span>
            </h2>
          </div>
        </div>
        <div className=" flex gap-x-4 gap-y-2 md:gap-y-0 flex-col md:flex-row w-full md:justify-center">
        <Link href={'/submit'}>
        <button type="button" className="cursor-pointer gap-x-2 text-white bg-[#051923] hover:bg-[#051923]/95 font-medium rounded-lg text-sm px-5 md:py-3 py-4 text-center justify-center inline-flex items-center me-2 mb-2 border border-[#051923] w-full md:w-fit  ">
Create Your Music Dedication
<span className=" flex items-center">

<LuPenLine />
</span>
</button>
        </Link>
        <Link href={'/history'}>
<button type="button" className=" cursor-pointer gap-x-2 text-color bg-[#fff] hover:bg-gray-100 font-medium rounded-lg text-sm px-5 md:py-3 py-4 text-center flex items-center justify-center me-2 mb-2 border border-[#051923] w-full  md:w-fit ">
Browse your dedications
<span className="flex items-center">
<IoIosSearch />

</span>
</button>
        </Link>
        </div>
      </div>
      <div className=" flex gap-x-4 gap-y-4 md:my-24 my-10 flex-wrap justify-center items-center ">
        {sections.map((card)=>{
          return <HeroCard key={card.id} title={card.title} text={card.text} />
        })}
      </div>
     

    </div>
    </>
  );
}
