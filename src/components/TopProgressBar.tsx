import React, { useEffect, useState } from 'react';

type Listener = (activeCount: number) => void;

let activeOperations = 0;
const listeners = new Set<Listener>();

function emitProgress() {
  listeners.forEach((listener) => listener(activeOperations));
}

export function startGlobalProgress(): void {
  activeOperations += 1;
  emitProgress();
}

export function doneGlobalProgress(): void {
  activeOperations = Math.max(0, activeOperations - 1);
  emitProgress();
}

export function pulseGlobalProgress(durationMs = 320): void {
  startGlobalProgress();
  setTimeout(() => {
    doneGlobalProgress();
  }, durationMs);
}

export const TopProgressBar: React.FC = () => {
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener: Listener = (nextCount) => setCount(nextCount);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    let trickleTimer: ReturnType<typeof setInterval> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (count > 0) {
      setVisible(true);
      setProgress((prev) => (prev > 12 && prev < 85 ? prev : 24));
      trickleTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const step = prev < 50 ? 12 : prev < 75 ? 6 : 2;
          return Math.min(90, prev + step);
        });
      }, 140);
    } else if (visible) {
      setProgress(100);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 240);
    }

    return () => {
      if (trickleTimer) clearInterval(trickleTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [count, visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#12366e] via-[#c59b27] to-[#1a56b0] shadow-[0_0_8px_rgba(197,155,39,0.55)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1
        }}
      />
    </div>
  );
};
