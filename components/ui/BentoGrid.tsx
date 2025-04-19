"use client";

import { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { HiSpeakerWave } from "react-icons/hi2"; // Add this import
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('react-lottie'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
});

import { cn } from "@/lib/utils";


import { BackgroundGradientAnimation } from "./GradientBg";
import GridGlobe from "./GridGlobe";
import animationData from "@/data/confetti.json";
import MagicButton from "../MagicButton";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[28rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
  audioUrl, // Add this prop
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
  audioUrl?: string; // Add this type
}) => {
  const leftLists = ["ReactJS", "Express", "Typescript"];
  const rightLists = ["VueJS", "NuxtJS", "GraphQL"];

  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCopy = () => {
    const text = "hsu@jsmastery.pro";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(`http://localhost:8003${audioUrl}`);
      audio.play();
    }
  };

  return (
    <div
      className={cn(
        "row-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden relative group/bento hover:shadow-xl transition duration-200",
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)"
      }}
    >
      {/* add img divs */}
      <div className={`${id === 6 && "flex justify-center"} ${id === 0 && "relative"} h-full`}>
        {id === 0 && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="absolute -left-4 top-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute right-10 bottom-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
            <div className="absolute inset-0 grid grid-cols-3 gap-8 p-8 pointer-events-none select-none">
              {['ReactJS', 'NodeJS', 'TypeScript', 'GraphQL', 'NextJS', 'TailwindCSS'].map((tech, index) => (
                <div
                  key={tech}
                  className="text-neutral-600/20 dark:text-neutral-400/20 text-sm font-mono transform hover:scale-110 transition-transform duration-200 animate-float"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0.5 + Math.random() * 0.5
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="w-full h-full absolute">
          {img && (
            <Image
              src={img}
              alt={title?.toString() || 'Image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              className={cn(
                imgClassName, 
                "object-cover object-center",
                id === 5 && "scale-75 opacity-60"
              )}
              priority
            />
          )}
        </div>
        <div
          className={cn(
            "absolute right-0 -bottom-5",
            id === 5 ? "w-1/2 opacity-60 scale-75" : "w-full h-full"
          )}
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt="Spare image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              className={cn(
                "object-cover object-center",
                id === 5 && "scale-75"
              )}
              priority
            />
          )}
        </div>
        {id === 6 && (
          // add background animation , remove the p tag
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="flex justify-between items-start">
            <div
              className={`font-sans ${id === 5 ? 'text-xl lg:text-4xl' : 'text-lg lg:text-3xl'} max-w-96 font-bold z-10`}
            >
              {title}
            </div>
          </div>

          {/* for the github 3d globe */}
          {id === 1 && <GridGlobe />}

          {/* Tech stack list div */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-10
                    lg:opacity-15 rounded-lg text-center bg-[#10132E]/20 text-gray-500"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]/20"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]/20"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-10
                    lg:opacity-15 rounded-lg text-center bg-[#10132E]/20 text-gray-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              <div
                className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"}`}
              >
                {isMounted && copied && (
                  <Lottie options={defaultOptions} height={200} width={400} />
                )}
              </div>

              <MagicButton
                title={copied ? "Email is Copied!" : "Subscribe to Newsletter"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
