'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faVolumeHigh, faVolumeXmark, faXmark, faMusic } from '@fortawesome/free-solid-svg-icons';

const PLAYLIST_ID = 'PLTRU2u_bXJop_-ypehMMWgKUv1J-edMWI';
const DISMISS_KEY = 'cg-yt-player-dismissed';

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  getVideoData: () => { title?: string };
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: { Player: new (target: HTMLElement, options: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function YoutubePlaylistPlayer() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [dismissed, setDismissed] = useState(true);
  const [title, setTitle] = useState('');
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try { setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === '1'); } catch { setDismissed(false); }
  }, []);

  // Mounts outside React's tree: the YouTube API replaces this element with its own
  // <iframe>, and React must never know about or re-diff that child (see insertBefore
  // crashes if a React-rendered node is handed directly to YT.Player).
  useEffect(() => {
    if (dismissed || !mountRef.current) return;
    const mount = document.createElement('div');
    mountRef.current.appendChild(mount);
    const create = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT!.Player(mount, {
        height: '1',
        width: '1',
        playerVars: { listType: 'playlist', list: PLAYLIST_ID, autoplay: 1, mute: 1, playsinline: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (event: { target: YTPlayer }) => { event.target.mute(); event.target.playVideo(); setReady(true); setTitle(event.target.getVideoData().title ?? ''); },
          onStateChange: (event: { target: YTPlayer; data: number }) => { setTitle(event.target.getVideoData().title ?? ''); }
        }
      });
    };
    if (window.YT?.Player) create();
    else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previous?.(); create(); };
      if (!document.getElementById('cg-yt-iframe-api')) {
        const script = document.createElement('script');
        script.id = 'cg-yt-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }
    return () => { playerRef.current?.destroy(); playerRef.current = null; mount.remove(); };
  }, [dismissed]);

  const togglePlay = () => { if (!playerRef.current) return; playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo(); setPlaying(!playing); };
  const toggleMute = () => { if (!playerRef.current) return; muted ? playerRef.current.unMute() : playerRef.current.mute(); setMuted(!muted); };
  const dismiss = () => { setDismissed(true); try { window.sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* storage unavailable */ } };

  return (
    <>
      <div ref={mountRef} className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden" />
      <AnimatePresence>
        {!dismissed && ready && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-5 z-[140] hidden max-w-[280px] items-center md:flex gap-3 rounded-full border border-white/10 bg-[#07130d]/95 py-2 pl-2 pr-3 text-white shadow-[0_18px_50px_rgba(0,0,0,.5)] backdrop-blur"
          >
            <button onClick={togglePlay} aria-label={playing ? 'Pausar música' : 'Tocar música'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gaucho-gold text-black transition-transform hover:scale-105">
              <FontAwesomeIcon icon={playing ? faPause : faPlay} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-gaucho-gold"><FontAwesomeIcon icon={faMusic} className="text-[9px]" />Tocando agora</p>
              <p className="truncate text-xs font-bold text-white/90">{title || 'Playlist Coração Gaúcho'}</p>
            </div>
            <button onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Silenciar'} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gaucho-gold hover:text-gaucho-gold">
              <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} className="text-xs" />
            </button>
            <button onClick={dismiss} aria-label="Fechar player" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
