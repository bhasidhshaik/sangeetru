import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";

const fadeInLine = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const MessageReveal = ({ dedication }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const lines = dedication.message.split("\n");

  return (
    <div
      ref={ref}
      className="mt-10  border border-white/20 backdrop-blur-md px-6 py-8 rounded-2xl shadow-xl max-w-2xl mx-auto bg-black"
    >
      <h3 className="text-xl font-semibold mb-4 text-center text-white">
        And there’s more—<span className="font-bold">{dedication.sender}</span> wrote something just for you:
      </h3>

      <div className="space-y-2">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            custom={i}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInLine}
            className="text-white text-center text-lg"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default MessageReveal;
