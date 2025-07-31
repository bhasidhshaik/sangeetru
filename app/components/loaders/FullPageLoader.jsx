import React from 'react';
import './loader.css';

const FullPageLoader = ({
  mainText = 'Please wait...',
  subTextPrefix = 'Creating your',
  wordsList = ['feelings', 'connection', 'lyrics', 'dedication', 'emotion']
}) => {
  return (
    <div className='flex justify-center items-center h-[100vh] fixed top-0 left-0 right-0 bottom-0 bg-gray-900/90 z-50'>

    <div>
      <p className='txt'>{mainText}</p>
      <div className="card">
        <div className="loader">
          <p>{subTextPrefix}</p>
          <div className="words">
            {wordsList.map((word, index) => (
              <span key={index} className="word">{word}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
            </div>
  );
};

export default FullPageLoader;

{/* <FullPageLoader 
  mainText="Searching for songs..." 
  subTextPrefix="Finding the right" 
  wordsList={['melody', 'vibe', 'rhythm', 'track']} 
/> */}
