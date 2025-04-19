"use client";

import { navItems } from "@/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import FloatingNav from "@/components/ui/FloatingNavbar";

const Home = () => {
  return (
    <main 
      className="min-h-screen w-full flex justify-center items-center flex-col overflow-hidden mx-auto px-4 sm:px-6 md:px-8"
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        margin: 0,
        padding: 0
      }}
    >
      <FloatingNav items={navItems} />
      <div className="w-full max-w-7xl">
        <div id="home" className="py-10 md:py-16">
          <Hero />
        </div>
        <div id="headlines" className="py-10 md:py-16">
          <Grid />
        </div>
        <div id="categories" className="py-10 md:py-16">
          <RecentProjects />
        </div>
        <div id="latest" className="py-10 md:py-16">
          <Experience />
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Home;
