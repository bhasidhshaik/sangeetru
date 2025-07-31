"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import FullPageLoader from "../components/loaders/FullPageLoader";
import { useRouter } from 'next/navigation';
import SuccessModal from "../components/SuccessModal";
import InfoAlert from "../components/InfoAlert";


const Submit = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    sender: "",
    recipient: "",
    message: "",
    song: "",
    fullSongName: "",
    lyrics: "",
  });
  const [songLyrics, setSongLyrics] = useState("");
  const [selectedSong, setSelectedSong] = useState("");
  const [selectedLyrics, setSelectedLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [songQuery, setSongQuery] = useState("");
  const [showLyricsContainer, setShowLyricsContainer] = useState(true);
  const lyricsBoxRef = useRef(null);
  const [selectSongLoad, setSelectSongLoad] = useState(false)
  const [userId, setUserId] = useState("");
  const [fullPageLoading, setFullPageLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({});
  const [lyricsFetching, setLyricsFetching] = useState(false)
  const [songYoutubeUrl, setSongYoutubeUrl ] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dedicationId, setDedicationId] = useState("")

const isFormValid =
  form.sender.trim() &&
  form.recipient.trim() &&
  form.song.trim() &&
  selectedLyrics.trim();

 useEffect(() => {
  let id = localStorage.getItem("userId");

  if (!id) {
    if (crypto?.randomUUID) {
      id = crypto.randomUUID();
    } else {
      // Fallback for environments that don't support crypto.randomUUID
      id =
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 15);
    }

    localStorage.setItem("userId", id);
  }

  setUserId(id);
}, []);
function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

async function getStartTimeFromLyric(youtubeUrl, selectedLyric) {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) return null;

  const res = await fetch(`/api/youtube/captions?videoId=${videoId}`);
  const data = await res.json();
  // console.log("Fetched captions data:", data);
  

  if (!data?.captions) return null;

  // Trim and pick the first non-empty line
  const firstLine = selectedLyric
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) return null;

  const match = data.captions.find((caption) =>
    caption.text?.toLowerCase().includes(firstLine.toLowerCase())
  );

  return match?.start || null;
}



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSongChange = (e) => {
    const value = e.target.value;
    setForm((prevForm) => ({ ...prevForm, song: value }));
    setShowLyricsContainer(true)
    setSongQuery(value);
  };

  const fetchLyrics = async (url) => {
    try {
setLyricsFetching(true)
      const response = await fetch(`/api/lyrics?q=${url}`);
      const data = await response.json();
      setSongLyrics(data);
      setSongYoutubeUrl(data.youtubeUrl)
      setSongQuery("");
      setLyricsFetching(false)
    } catch (e) {
      console.log(e);
    }finally{
      setLyricsFetching(false)
    }
  };

  useEffect(() => {
    if (!songQuery) {
      setSearchResults([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lyrics/search?q=${songQuery}`);
        const data = await res.json();
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [songQuery]);

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const errors = {};
    if (!form.sender.trim()) errors.sender = "Oops! What should we call you? ";
    if (!form.recipient.trim()) errors.recipient = "Who are you dedicating this to?";
    if (!form.song.trim()) errors.song = "Pick a song to make this special!";
    if (!selectedLyrics.trim()) errors.lyrics = "Choose a part of the song to send.";
  
    setFormErrors(errors);
  
    if (Object.keys(errors).length > 0) return;
    setFullPageLoading(true)
    const submissionData = {
      ...form,
      selectedSongTitle: songLyrics?.title || "",
      selectedLyrics,
      userId, // This will be consistent for the same user
      youtubeUrl: songYoutubeUrl || "",
     youtubeStartTime :  await getStartTimeFromLyric(songYoutubeUrl || " " , selectedLyrics),
    };
  
  // console.log(submissionData);
    
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submissionData),
  });
    if (!res.ok) {
      console.error("Failed to submit dedication");
      return;
    }
  
    const data = await res.json();
    // console.log("Dedication saved:", data);
    
    // Reset form after submission
    setForm({
      sender: "",
      recipient: "",
      message: "",
      song: "",
      fullSongName: "",
      lyrics: "",
    });
    setSelectedSong("");
    setSelectedLyrics("");
    setSongLyrics("");
    setSearchResults([]);
    setShowLyricsContainer(true);
    setFormErrors({});
    
    setFullPageLoading(false);
    if(data?.id){
      setDedicationId(data.id);
      setShowSuccessModal(true);

    }

  }

  return (
    <div className=" py-4 max-w-xl mx-auto md:py-16 md:px-4 px-4">
      <div className="mb-4">
        <InfoAlert
        type="info"
        heading={'Guess what?'}
paragraph={"They’ll hear the exact song you picked — and can enjoy the full song on YouTube too!"}
        />
      </div>
      <form onSubmit={handleSubmit} className="w-full mx-auto text-color">
        <div className="mb-5">
          <label htmlFor="sender" className="block mb-2 text-sm font-medium text-gray-900">
            Sender
          </label>
          <input
            type="text"
            id="sender"
            autoComplete="off"
            name="sender"
            value={form.sender}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter your name"
            
          />
          {formErrors.sender && <p className="text-red-500 text-sm mt-1">{formErrors.sender}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="recipient" className="block mb-2 text-sm font-medium text-gray-900">
            Recipient
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            autoComplete="off"
            value={form.recipient}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter recipient's name"
            
          />
          {formErrors.recipient && <p className="text-red-500 text-sm mt-1">{formErrors.recipient}</p>}
        </div>

        <div className="mb-5">
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
            Message
          </label>
          <textarea
            id="message"
            autoComplete="off"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Enter your message (Optional)"
          />
        </div>

        <div className="mb-5 relative">
          <label htmlFor="song" className="block mb-2 text-sm font-medium text-gray-900">
            Song
          </label>
          <input
            type="text"
            autoComplete="off"
            id="song"
            name="song"
            value={form.song}
            onChange={handleSongChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Search for a song"
            
          />
          {formErrors.song && <p className="text-red-500 text-sm mt-1">{formErrors.song}</p>}
          {(!loading && !searchResults) && (
            <div className=" absolute right-4 bottom-4">

              <IoSearchOutline width={60} height={60} />
            </div>
          ) }
        {loading && (
  <div className=" absolute right-8 top-[34px] ">  
<div role="status">
    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#051923]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>

  </div>
)}
{/* {searchResults.length === 0 && (  
<div className="absolute top-12 left-0 right-0 bg-white shadow-lg rounded-lg p-4">
  <p className="text-gray-500 text-sm">Search for a song to get started!</p>
</div>  
)} */}
         <div className="mt-3">
  {loading ? null : searchResults.length > 0 ? (
    <ul>
      {searchResults.map((song, index) => (
        <li key={index} className="text-blue-500 ">
          <button
            className="flex w-full cursor-pointer items-center gap-2 border-b-2 md:w-[600px] border-gray-300 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
            onClick={(e) => {
             e.preventDefault();
                    setSelectSongLoad(true);
                    setSelectedSong(song.url);
                    fetchLyrics(song.url);
                    setForm((prevForm) => ({
                      ...prevForm,
                      fullSongName: song.title,
                    }));

                    setSelectSongLoad(false);
            }}
          >
            <img src={song.image} alt="" className="w-20 h-14 object-contain " />
            <h3 className=" text-black font-medium text-sm md:text-base">{song.title}</h3>
          </button>
        </li>
      ))}
    </ul>
  ) : (
    (form.song && !selectedSong )&& (
      <p className="text-sm text-gray-500 mt-2">We didn’t find any matches. Double-check your search or try something else.</p>
    )
  )}
</div>


          {selectSongLoad&& (
  <div className="  absolute w-full h-[100vh] bg-amber-400 ">  
<div role="status">
    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#051923]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>

  </div>
)}
        </div>

        {(songLyrics && showLyricsContainer) && (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-normal text-gray-900">Select a lyrics snippet (scroll to view more)</h2>
            <div
              ref={lyricsBoxRef}
              className="mb-2 border-2 border-zinc-800 h-96 p-6 flex justify-center overflow-y-scroll scrollbar-hide rounded-3xl w-fit"
            >
             <div
  className="whitespace-pre-line text-lg font-medium"
  dangerouslySetInnerHTML={{ __html: songLyrics.lyrics }}
/>

            </div>
            <div className="w-full mb-5 flex justify-center">
              <button
                type="button"
               onClick={() => {
  if (!lyricsBoxRef.current) return;

  const container = lyricsBoxRef.current;
  const lines = container.innerText.split("\n");

  // Create an offscreen container to render each line
  const tempWrapper = document.createElement("div");
  tempWrapper.style.position = "absolute";
  tempWrapper.style.visibility = "hidden";
  tempWrapper.style.width = container.clientWidth + "px";
  tempWrapper.style.font = window.getComputedStyle(container).font;
  tempWrapper.style.lineHeight = window.getComputedStyle(container).lineHeight;
  tempWrapper.style.whiteSpace = "pre-wrap";
  tempWrapper.style.padding = window.getComputedStyle(container).padding;
  document.body.appendChild(tempWrapper);

  const visibleTop = container.scrollTop;
  const visibleBottom = visibleTop + container.clientHeight;

  const visibleLines = [];

  for (const line of lines) {
    const lineDiv = document.createElement("div");
    lineDiv.innerText = line || " ";
    tempWrapper.appendChild(lineDiv);

    const top = lineDiv.offsetTop;
    const bottom = top + lineDiv.offsetHeight;

    if (bottom > visibleTop && top < visibleBottom) {
      visibleLines.push(line);
    }
  }

  document.body.removeChild(tempWrapper);

  const selected = visibleLines.join("\n");
  setSelectedLyrics(selected);
  setForm((prevForm) => ({
    ...prevForm,
    lyrics: selected,
  }));
  setShowLyricsContainer(false);
}}

                className="w-[70%] cursor-pointer text-white bg-[#094bdf] hover:bg-[#094bdf]/95 font-medium rounded-4xl text-lg px-5 py-3 text-center transition-all duration-300"
              >
                Choose lyrics
              </button>
            </div>

          
          </div>
        )}
<div>
{(selectedLyrics && !showLyricsContainer) && (
              <div className="mt-3 text-center text-gray-700 text-sm whitespace-pre-line">
                <p><strong>Selected Snippet:</strong></p>
                <p>{selectedLyrics}</p>
                {formErrors.lyrics && <p className="text-red-500 text-sm mt-1">{formErrors.lyrics}</p>}
              </div>
            )}
</div>
        <div className="w-full mb-5">
        <button
  type="submit"
  disabled={!isFormValid}
  className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300
    ${isFormValid ? 'cursor-pointer bg-[#051923] hover:bg-[#051923]/95' : 'cursor-not-allowed bg-gray-400'}`}
>
  Send
</button>

        </div>
      </form>
      {fullPageLoading && (
        <div className="">

      <FullPageLoader />
</div>
        )}


        {showSuccessModal && (
  <SuccessModal
    dedicationId={dedicationId}
    onClose={() => setShowSuccessModal(false)}
  />
)}

    </div>
  );
};

export default Submit;
