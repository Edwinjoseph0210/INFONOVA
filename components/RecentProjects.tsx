"use client";

import { FaLocationArrow } from "react-icons/fa6";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";

const RecentProjects = () => {
  const router = useRouter();

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <div className="py-20">
      <h1 className="heading">
        News <span className="text-purple">Categories</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] relative group cursor-pointer"
            key={item.id}
            onClick={() => handleClick(item.link)}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <PinContainer
              title={item.title}
              href={item.link}
            >
              <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  style={{ 
                    backgroundColor: "#13162D",
                    boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)"
                  }}
                >
                  <Image
                    src="/bg.png"
                    alt="background"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                  <Image
                    src={item.id === 4 ? "/forth.jpeg" : item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover w-full h-full ${
                      item.id === 1 ? 'object-top' :
                      'object-center'
                    }`}
                    priority
                  />
                </div>
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border-2 border-white/[0.2] rounded-full bg-black/80 lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center hover:border-purple-500/50 transition-colors duration-300"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <Image
                        src={icon}
                        alt={`icon-${index + 1}`}
                        width={32}
                        height={32}
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Read More
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
