"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StackedAvatarProps {
  avatars: { src?: string; fallback?: string }[];
  size?: number; 
  overlapX?: number;
}

const StackedAvatar: React.FC<StackedAvatarProps> = ({ avatars, size = 50, overlapX = 10 }) => {
  return (
    <div className="relative flex items-center">
      {avatars.map((avatar, index) => (
        <div
          key={index}
          className={cn("relative")}
          style={{
            width: size,
            height: size,
            marginLeft: index === 0 ? 0 : `-${overlapX}px`, 
            zIndex: avatars.length + index, 
          }}
        >
          <Avatar
            className="shadow-md border border-[#E8F4C7] rounded-[0.5rem]" 
            style={{ width: size, height: size }}
          >
            {avatar.src ? (
              <AvatarImage src={avatar.src} alt="User Avatar" />
            ) : (
              <AvatarFallback>{avatar.fallback || "U"}</AvatarFallback>
            )}
          </Avatar>
        </div>
      ))}
    </div>
  );
};

export default StackedAvatar;
