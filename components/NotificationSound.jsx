import { forwardRef, useImperativeHandle, useRef } from 'react';

const NotificationSound = forwardRef((props, ref) => {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch (e) {
      }
    },
    unlock: () => {
      const audio = audioRef.current;
      if (!audio) return;
      const prevMuted = audio.muted;
      audio.muted = true;
      audio.play()
        .then(() => {
          audio.pause();
          audio.muted = prevMuted;
        })
        .catch(() => {
          audio.muted = prevMuted;
        });
    }
  }));

  return <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />;
});

export default NotificationSound;