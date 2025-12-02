"use client";

import React from "react";
import { motion } from "framer-motion";

const FooterFirstCard = ({ copy }: any) => {
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  return (
    <motion.section {...fadeIn(0.1)}>
      <div className="grid gap-6 md:grid-cols-3 text-center"></div>
    </motion.section>
  );
};

export default FooterFirstCard;
