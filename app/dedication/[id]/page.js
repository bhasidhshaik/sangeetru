'use client';
import InfoAlert from '@/app/components/InfoAlert';
import FullPageLoader from '@/app/components/loaders/FullPageLoader';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { LuPenLine } from 'react-icons/lu';

const page = () => {
  const params = useParams();
  const { id } = params;
  const [dedication, setDedication] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const intervalRef = useRef(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [songLoading, setSongLoading] = useState(false);
  const [cannotPlaySong, setCannotPlaySong] = useState(false)
const [playerKey, setPlayerKey] = useState(0); // for forcing re-render

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch('/api/dedications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      console.log(data);
      
      setDedication(data.dedication);
    };

    if (id) fetchPost();
  }, [id]);

  const messageRef = useRef(null);
const [visibleWordIndex, setVisibleWordIndex] = useState(-1);
const [messageWords, setMessageWords] = useState([]);

useEffect(() => {
  // Split message into words once
  setMessageWords(dedication?.message.split(' '));
}, [dedication?.message]);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        revealWords();
      }
    },
    { threshold: 0.3 }
  );

  if (messageRef.current) {
    observer.observe(messageRef.current);
  }

  return () => observer.disconnect();
}, [messageWords]);

const revealWords = () => {
  let index = 0;
  const interval = setInterval(() => {
    setVisibleWordIndex((prev) => {
      if (prev >= messageWords.length - 1) {
        clearInterval(interval);
        return prev;
      }
      return prev + 1;
    });
    index++;
  }, 80); // Speed of reveal per word
};


  const startScrolling = (lines) => {
    clearInterval(intervalRef.current);
    setHasFinished(false);

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentLineIndex((prev) => {
          if (prev < lines.length - 1) {
            return prev + 1;
          } else {
            clearInterval(intervalRef.current);
            setHasFinished(true);
            return prev;
          }
        });
      }
    }, 2500);
  };

  const playerRef = useRef(null);


const handlePause = () => {
  playerRef.current?.pauseVideo();
  setIsPaused(true);
};

const handleResume = () => {
  playerRef.current?.playVideo();
  setIsPaused(false);
};


  useEffect(() => {
    if (dedication?.selectedLyrics) {
      const lines = dedication.selectedLyrics.split('\n');
      setCurrentLineIndex(0);
      startScrolling(lines);
    }
    return () => clearInterval(intervalRef.current);
  }, [dedication, isPaused]);

  useEffect(() => {
    const scrollToLine = () => {
      const container = containerRef.current;
      if (container) {
        const activeLine = container.children[currentLineIndex];
        if (activeLine) {
          const containerHeight = container.clientHeight;
          const lineOffset = activeLine.offsetTop - container.offsetTop;
          const lineHeight = activeLine.clientHeight;
          const scrollTop = lineOffset - containerHeight / 2 + lineHeight / 2;
          container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }
    };

    scrollToLine();
  }, [currentLineIndex]);

  if (notFound) return <div className="text-center text-red-500">Post not found</div>;
  if (!dedication) return (<div>
    <FullPageLoader 
  mainText="Please wait..." 
  subTextPrefix="Finding your" 
  wordsList={['melody', 'dedication', 'emotion', 'track']} 
/> 

  </div>);

const handlePlayToggle = async () => {
  const videoId = dedication?.youtubeUrl?.split('v=')[1];
  if (!videoId) return;

  if (showPlayer && playerRef.current) {
    playerRef.current.pauseVideo();
    setShowPlayer(false);
    return;
  }

  // Show the player first
  setSongLoading(true)
  setShowPlayer(true);

  // Wait a tick to ensure the DOM has rendered <div id="youtube-player">
  setTimeout(async () => {
    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
        } else {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          window.onYouTubeIframeAPIReady = () => {
            resolve(window.YT);
          };
        }
      });
    };

    const YT = await loadYouTubeAPI();

    playerRef.current = new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId,
      playerVars: {
        autoplay: 1,
        start: dedication.startTime || 13,
        controls: 0,
      },

      events: {
        onReady: (event) => {
          event.target.setVolume(25);
          event.target.playVideo(); // this happens within user interaction
          setSongLoading(false);
          setCannotPlaySong(false);

        },
         onError: (event) => {
          setCannotPlaySong(true);
          setSongLoading(false);
      setShowPlayer(false);
    }
      },
    });
  }, 0); // ensure DOM has rendered
};




  const lines = dedication.selectedLyrics?.split('\n');

  const handleStartOver = () => {
    setCurrentLineIndex(0);
    setIsPaused(false);
    setHasFinished(false);
    startScrolling(lines);
  };

 
  
  return (
    <div className=" p-4 md:py-8 flex flex-col items-center max-w-[1200px] mx-auto">
      <h3 className="text-2xl font-medium">
        Hey, <span className="tangerine-font text-3xl">{dedication.recipient}</span>
      </h3>

      <div className="mt-4 text-center">
        <p className=' text-base md:text-lg font-medium text-slate-500'>
          <span className=" text-base font-semibold md:text-xl">{dedication.sender}</span> just sent you a special song filled with meaning.
          <br />
          Take a moment to feel the lyrics—they’re meant just for you :)
        </p>
      </div>

      <div className="relative mt-2 w-full max-w-xl h-80 overflow-hidden rounded-2xl border-2 border-gray-300 shadow-lg">
        {/* Top fade */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Lyrics box */}
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-6 py-10 text-center leading-loose text-gray-800 scrollbar-hide"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i === currentLineIndex ? 'text-black font-bold scale-105' : 'text-gray-500 font-medium'
              }`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
      {
          (isPaused && !hasFinished) ? (
 <button
          onClick={() => setIsPaused(false)}
          className="px-4 py-2 bg-green-100 border cursor-pointer border-green-400 rounded-full hover:bg-green-200"
        >
          ▶ Resume
        </button>
          ) : (
  <button
          onClick={() => setIsPaused(true)}
          className="px-4 py-2 bg-red-100 border cursor-pointer border-red-400 rounded-full hover:bg-red-200"
        >
          ⏸ Pause
        </button>
          )
        }

        {hasFinished && (
          <button
            onClick={handleStartOver}
            className="px-4 py-2 bg-blue-100 border border-blue-400 rounded-full hover:bg-blue-200"
          >
            🔁 Start Over
          </button>
        )}

       {(!songLoading && !cannotPlaySong) && (
<button
  onClick={handlePlayToggle}
  className="px-4 py-2 cursor-pointer bg-yellow-100 border border-yellow-400 rounded-full hover:bg-yellow-200"
>
  {showPlayer ? '⏹ Stop Song' : '▶️ Play Song'}
</button>
       )} 

 {songLoading && (

<button
  onClick={handlePlayToggle}
  className="px-4 py-2 cursor-pointer bg-yellow-100 border border-yellow-400 rounded-full hover:bg-yellow-200"
>
  {'Loading Song...'}
</button>

 )} 



      </div>
      {songLoading && (
        <InfoAlert
type='warning'
paragraph={' Song may not match with lyrics'}
/>
      )}

    {cannotPlaySong && (
 <div className='py-4'>
        <InfoAlert
        type='warning'
        paragraph={`Due to YouTube's restrictions, some songs may not play on mobile devices. However, you can still enjoy the song on desktop/laptop. Or click on song title to open in YouTube.`}
        />
      </div>
    )} 


<div className="mt-6 p-4 bg-gray-800 backdrop-blur flex flex-col md:flex-row gap-1.5 items-center rounded-xl font-color shadow-md">
  <h4 className="text-base font-normal text-slate-200 text-center">
    {dedication.sender} picked these lyrics for you from {' '}
  </h4>
  <a
    href={
      dedication.youtubeUrl
        ? dedication.youtubeUrl
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(
            dedication.fullSongName.replace(/ *lyrics */i, '')
          )}`
    }
    target="_blank"
    rel="noopener noreferrer"
    className=" text-white font-medium hover:text-slate-100 underline transition"
  >
    {dedication.fullSongName.replace(/ *lyrics */i, '')}
  </a>
</div>



{showPlayer && (
  <div className="mt-4">
    <div id="youtube-player" className="w-0 h-0" />
  </div>
)}







<div
  ref={messageRef}
  className="mt-4 px-6 py-2 "
>
  <h3 className="text-md font-normal mb-2 text-center text-slate-600">
    Also, here's a message from {dedication.sender}:
  </h3>

  <p className="text-color tangerine-font p-4 text-3xl text-center flex flex-wrap justify-center gap-1 rounded-2xl border border-slate-400 bg-slate-100 backdrop-blur-md shadow-lg max-w-xl mx-auto">
    {messageWords?.map((word, index) => (
      <span
        key={index}
        className={`transition-opacity duration-300 ease-in ${
          index <= visibleWordIndex ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {word}
      </span>
    ))}
  </p>
</div>

<div className=' flex flex-col items-center mt-8 gap-y-4'>
<p className="text-color text-center">
  Every line holds a feeling that {dedication.sender} wanted to share with you <br/> now it's your turn to share a song with someone special.
</p>
 <Link href={'/submit'}>
        <button type="button" className="cursor-pointer gap-x-2 text-white bg-[#051923] hover:bg-[#051923]/95 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 border border-[#051923]  ">
Send lyrics
<span className=" flex items-center">

<LuPenLine />
</span>
</button>
        </Link>

</div>




    </div>
  );
};

export default page;
