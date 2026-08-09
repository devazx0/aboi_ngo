"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface VideoItem {
  id: string;
  src: string;
  poster: string;
  titleKey: string;
  descKey: string;
  badgeKey: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: "food-children",
    src: "/assets/sharing-food-for-children.mp4",
    poster: "/assets/3-woman-serving-food.jpeg",
    titleKey: "video1Title",
    descKey: "video1Desc",
    badgeKey: "badgeFoodRelief",
  },
  {
    id: "cooking-rice",
    src: "/assets/woman-cooking-rice.mp4",
    poster: "/assets/rice.png",
    titleKey: "video2Title",
    descKey: "video2Desc",
    badgeKey: "badgeCommunityKitchen",
  },
  {
    id: "people-food",
    src: "/assets/people-sitting-to-get-food.mp4",
    poster: "/assets/sharing_rice2.png",
    titleKey: "video3Title",
    descKey: "video3Desc",
    badgeKey: "badgeSolidarityGathering",
  },
];

function VideoCard({
  video,
  title,
  desc,
  badge,
}: {
  video: VideoItem;
  title: string;
  desc: string;
  badge: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const containerNode = containerRef.current;
    const videoNode = videoRef.current;
    if (!containerNode || !videoNode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoNode
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          } else {
            videoNode.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(containerNode);

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (videoNode.paused) {
      videoNode.play();
      setIsPlaying(true);
    } else {
      videoNode.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const videoNode = videoRef.current;
    if (!videoNode) return;

    videoNode.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className="bg-surface rounded-lg border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
      onClick={togglePlay}
    >
      <div className="relative aspect-video bg-black overflow-hidden select-none">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />

        {/* Category Badge Pill */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20">
            {badge}
          </span>
        </div>

        {/* Custom Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-primary-container text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-md"
        >
          <span className="material-symbols-outlined text-[18px] block">
            {isMuted ? "volume_off" : "volume_up"}
          </span>
        </button>

        {/* Play indicator overlay on pause */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-[28px] ml-0.5">
                play_arrow
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-md flex flex-col flex-grow">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function ImpactVideoSection() {
  const t = useTranslations("videos");

  return (
    <section className="py-xl bg-surface-container-lowest border-t border-outline-variant/30 relative">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-xl max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full font-label-md text-label-md bg-secondary-container/20 text-secondary-container mb-sm border border-secondary-container/30">
            <span className="material-symbols-outlined text-[18px]">
              videocam
            </span>
            {t("title")}
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            {t("title")}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              title={t(video.titleKey)}
              desc={t(video.descKey)}
              badge={t(video.badgeKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
