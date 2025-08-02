"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheck, FaCopy, FaRegCopy } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import FullPageLoader from "../components/loaders/FullPageLoader";

const MyDedications = () => {
  const [dedications, setDedications] = useState([]);
  const [loading, setLoading] = useState(true);
const [copiedId, setCopiedId] = useState(null);

const handleCopy = async (link, id) => {
  const fullText = `Hey, I made this lyrics dedication just for you 💌\n\nCheck it out here: ${link}`;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(fullText);
    } else {
      // Fallback method
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 4000);
  } catch (err) {
    console.error("Copy failed:", err);
    alert("Unable to copy link. Please try manually.");
  }
};



  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("No userId found in localStorage");
      setLoading(false);
      return;
    }

    const fetchDedications = async () => {
      try {
        const res = await fetch(`/api/history?id=${userId}`);
        const data = await res.json();
        setDedications(data.dedications || []);
      } catch (err) {
        console.error("Failed to fetch dedications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDedications();
  }, []);

  if (loading) return (
  <FullPageLoader
  subTextPrefix="Loading your"
  mainText="Fetching your dedications"
  wordsList={["dedications", "history", "songs", "details", "information"]}
  />
);

  if (dedications.length === 0) {
    return (
      <div>

      <p className="text-center mt-10 text-gray-600">No dedications found for your account.</p>
      <div className="p-4" >
 <Link href={'/submit'}>
        <button type="button" className="cursor-pointer gap-x-2 text-white bg-[#051923] hover:bg-[#051923]/95 font-medium rounded-lg text-sm px-5 md:py-3 py-4 text-center justify-center inline-flex items-center me-2 mb-2 border border-[#051923] w-full md:w-fit  ">
Send your first dedication
<span className=" flex items-center">

<LuPenLine />
</span>
</button>
        </Link>
      </div>
      </div>
    )
      
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Your Dedications</h1>
      <ul className="space-y-4">
        {dedications.map((d) => (
          <li key={d._id || d.id} className="border p-2 rounded-full shadow-sm bg-white">
            <div className="flex items-center justify-around">
                <div className="sNo">
                    <span>
                        {dedications.indexOf(d) + 1}.
                    </span>
                </div>
                <div className="link-name">
                    <div className="text-sm font-medium">
                       <span className="text-slate-500"> To ,</span> <span className=" text-slate-700">{d.recipient}</span>
                    </div>
                    <div>
                        <Link href={`/dedication/${d._id}`} className="text-[#051923] underline hover:underline">
                            {d._id}
                        </Link>
                    </div>
                </div>
                <div className="copyBtn">
 <button
  onClick={() => {
    handleCopy(`${window.location.origin}/dedication/${d._id}`, d._id);
  }}
  className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer relative"
>
  {copiedId === d._id ? (
    <span className="flex items-center gap-1 font-medium text-[#00171f]">
      Copied <FaCopy size={18} />
    </span>
  ) : (
    <span className="flex items-center font-medium  gap-1 text-[#00171f]">
      Copy <FaRegCopy size={18} className="cursor-pointer" />
    </span>


  )}
</button>

                </div>
            </div>
            
            {/* <p className="font-semibold">{d.songTitle} by {d.artist}</p>
            <p className="text-sm text-gray-600 mt-1">To: {d.toName}</p>
            <p className="text-sm text-gray-600">From: {d.fromName}</p>
            <p className="mt-2 italic text-gray-700">"{d.lyrics}"</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDedications;
