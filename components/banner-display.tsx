"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBanners } from "@/lib/actions";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/prisma";

interface BannerDisplayProps {
  page: string;
  position: "top" | "middle" | "bottom";
}

export function BannerDisplay({ page, position }: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem("dismissedBanners");
    if (dismissed) {
      setDismissedBanners(JSON.parse(dismissed));
    }
  }, [page, position]);

  const fetchBanners = async () => {
    try {
      const positionMap = {
        top: "TOP" as const,
        middle: "SIDEBAR" as const,
        bottom: "BOTTOM" as const,
      };

      const data = await getBanners(page, positionMap[position]);
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissBanner = (bannerId: string) => {
    const newDismissed = [...dismissedBanners, bannerId];
    setDismissedBanners(newDismissed);
    localStorage.setItem("dismissedBanners", JSON.stringify(newDismissed));
  };

  const activeBanners = banners.filter(
    (banner) => !dismissedBanners.includes(banner.id)
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <Card>
          <div className="aspect-[4/1] bg-muted rounded"></div>
        </Card>
      </div>
    );
  }

  if (activeBanners.length === 0) return null;

  return (
    <div className="space-y-4">
      {activeBanners.map((banner) => (
        <Card key={banner.id} className="relative overflow-hidden group">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
            onClick={() => dismissBanner(banner.id)}
          >
            <X className="h-4 w-4" />
          </Button>

          {banner.linkUrl ? (
            <Link href={banner.linkUrl} className="block">
              <BannerContent banner={banner} />
            </Link>
          ) : (
            <BannerContent banner={banner} />
          )}
        </Card>
      ))}
    </div>
  );
}

function BannerContent({ banner }: { banner: Banner }) {
  if (banner.imageUrl) {
    return (
      <div className="relative aspect-[4/1]">
        <Image
          src={banner.imageUrl || "/placeholder.svg"}
          alt={banner.title || "Banner"}
          fill
          className="object-cover"
        />
        {(banner.title || banner.content) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-4">
              {banner.title && (
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
              )}
              {banner.content && (
                <p className="text-sm opacity-90">{banner.content}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-[4/1] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
      <div className="text-center p-4">
        {banner.title && (
          <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
        )}
        {banner.content && (
          <p className="text-sm opacity-90">{banner.content}</p>
        )}
        <p className="text-xs mt-2 opacity-75">Click to learn more</p>
      </div>
    </div>
  );
}
