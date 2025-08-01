"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCopy, FiX } from "react-icons/fi";
import { FaShareAlt, FaEye, FaCheck } from "react-icons/fa";
import Link from "next/link";

const SuccessModal = ({ dedicationId, onClose , recipient}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentLink = `${window.location.origin}/dedication/${dedicationId}`;
      setLink(currentLink);
      setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    }
  }, [dedicationId]);

const handleCopy = async () => {
  const fullText =  `Hey ${recipient}, I made this lyrics dedication just for you 💌\n\nCheck it out here: ${link}`;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(fullText);
    } else {
      // Fallback method for mobile browsers
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

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed:", err);
    alert("Unable to copy link. Please try manually.");
  }
};


const handleShare = async () => {
  try {
    const fullText =  `Hey ${recipient}, I made this lyrics dedication just for you 💌\n\nCheck it out here: ${link}`;


    if (navigator.share) {
      await navigator.share({
        text: fullText, // 👈 Combine everything here
      });
    }  else {
      await navigator.clipboard.writeText(fullText);
      alert("Sharing not supported. The dedication link has been copied to your clipboard.");
    }
  } catch (error) {
    console.error("Sharing failed", error);
  }
};


  return (
    <div className="fixed inset-0 bg-[#000000f7]  flex justify-center items-center z-50">
      <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-[90%] text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          <FiX />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
          🎉 Dedication Created!
        </h2>
        <p className="text-gray-700 mb-4 text-sm sm:text-base">
          Here's your unique link. Share it with your recipient!
        </p>

        <div className="bg-gray-100 border rounded-md p-2 mb-4 flex items-center justify-between relative group">
          <input
            readOnly
            className="bg-transparent text-sm w-full truncate px-1"
            value={link}
          />
          <button
            onClick={handleCopy}
            className="ml-2 text-blue-600 hover:text-blue-800 relative cursor-pointer"
            title={copied ? "Copied!" : "Copy"}
          >
            {copied ? <FaCheck size={18} /> : <FiCopy size={18} />}
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>

        {canShare && (
          <button
            onClick={handleShare}
            className="w-full mb-2 cursor-pointer gap-x-2 text-white bg-[#051923] hover:bg-[#051923]/95 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center me-2 border border-[#051923]"
          >
            <FaShareAlt className="inline mr-2" />
            Share via Apps
          </button>
        )}

        <button
          onClick={() => router.push(`/dedication/${dedicationId}`)}
          className="w-full cursor-pointer font-medium text-sm mb-3 bg-transparent text-[#051923] py-2 border border-[#051923] rounded-lg hover:bg-gray-200 transition"
        >
          <FaEye className="inline mr-2" />
          View Dedication
        </button>

        <p className="text-xs text-gray-500">
          You can also find this link in your{" "}
          <Link href="/history" className="text-blue-600 hover:underline">
          <span className="font-semibold">History</span> page.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
