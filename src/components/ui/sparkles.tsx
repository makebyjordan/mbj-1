// Inspired by https://ui.aceternity.com/components/sparkles
"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SparklesCoreProps = {
  id?: string;
  className?: string;
  background?: string;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  speed?: number;
};

export const SparklesCore = (props: SparklesCoreProps) => {
  const {
    id,
    className,
    background,
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 1200,
    particleColor = "#FFFFFF",
    speed = 20,
  } = props;
  const [sparkles, setSparkles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      vy: number;
    }[]
  >([]);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = document.getElementById(id || "tsparticles") as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let containerWidth: number, containerHeight: number;
    let particles: { id: number; x: number; y: number; size: number; color: string; vy: number; }[] = [];
    
    const init = () => {
      canvas.width = containerWidth = canvas.offsetWidth;
      canvas.height = containerHeight = canvas.offsetHeight;
      
      const numParticles = Math.floor(containerWidth * containerHeight / (1000000 / particleDensity));
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * (maxSize - minSize) + minSize;
        particles.push({
          id: i,
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          size: size,
          color: particleColor,
          vy: Math.random() * 0.5 - 0.25,
        });
      }
      setSparkles(particles);
    };

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      particles.forEach((particle) => {
        particle.y += particle.vy * (speed / 20);
        if (particle.y < 0 || particle.y > containerHeight) {
            particle.x = Math.random() * containerWidth;
            particle.y = particle.vy > 0 ? 0 : containerHeight;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [id, minSize, maxSize, particleDensity, particleColor, speed]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <canvas
        id={id || "tsparticles"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: background || "transparent",
        }}
      />
    </div>
  );
};
