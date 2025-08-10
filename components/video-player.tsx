"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setShowAd(true)
      setAdCountdown(5)
      video.pause()
      
      const countdown = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            setShowAd(false)
            video.play()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    video.addEventListener('play', handlePlay)
    return () => video.removeEventListener('play', handlePlay)
  }, [])

  const skipAd = () => {
    setShowAd(false)
    videoRef.current?.play()
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
        
        {showAd && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-2xl max-h-96 bg-gray-800 rounded-lg overflow-hidden">
                <ins className="adsbygoogle"
                     style={{display: 'block', width: '100%', height: '100%'}}
                     data-ad-client="ca-pub-8067460650189485"
                     data-ad-slot="1234567890"
                     data-ad-format="auto"></ins>
              </div>
              
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap">
                  Ad ends in {adCountdown}s
                </span>
                {adCountdown <= 0 && (
                  <button
                    onClick={skipAd}
                    className="bg-white text-black px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 min-w-0"
                  >
                    <X className="h-3 w-3 flex-shrink-0" />
                    <span className="hidden sm:inline">Skip</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile-friendly controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 sm:p-4 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          <span className="truncate">Video Player</span>
          <div className="flex items-center gap-2">
            <span className="bg-black/50 px-2 py-1 rounded">HD</span>
          </div>
        </div>
      </div>
    </div>
  )
}