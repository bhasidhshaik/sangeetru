import React from 'react';
import {
  AiOutlineInfoCircle,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
} from 'react-icons/ai';

const alertVariants = {
  info: {
    icon: <AiOutlineInfoCircle className="text-blue-600 text-xl" />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
  success: {
    icon: <AiOutlineCheckCircle className="text-green-600 text-xl" />,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  },
  warning: {
    icon: <AiOutlineWarning className="text-yellow-600 text-xl" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
  },
  error: {
    icon: <AiOutlineCloseCircle className="text-red-600 text-xl" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
};

const InfoAlert = ({ heading, paragraph, type = 'info' }) => {
  const variant = alertVariants[type] || alertVariants.info;

  return (
    <div
      className={`w-full max-w-xl mx-auto flex items-start gap-3 rounded-xl border ${variant.bg} ${variant.border} ${variant.text} p-4 shadow-sm`}
    >
      <div className="mt-1">{variant.icon}</div>
      <div>
        {heading && <h4 className="text-base font-semibold mb-1">{heading}</h4>}
        <p
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      </div>
    </div>
  );
};

export default InfoAlert;
{/* <InfoAlert
  type="success"
  heading="Upload Successful!"
  paragraph={`Your file has been uploaded. <a href="https://example.com" target="_blank" class="underline text-green-700 hover:text-green-900">View here</a>`}
/>

<InfoAlert
  type="error"
  paragraph={`An error occurred. Please <a href="/retry" class="underline text-red-700 hover:text-red-900">try again</a>.`}
/> */}
