"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";
import { duration, easing, stagger } from "@nutritale/shared";

/** Fades and rises a block in with the shared `enter` token. Only opacity and transform animate. */
export function RiseIn({ index = 0, children }: { index?: number; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: duration.enter / 1000,
          delay: (index * stagger.default) / 1000,
          ease: [...easing.standard],
        }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
