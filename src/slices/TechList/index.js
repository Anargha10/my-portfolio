"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { MdCircle } from "react-icons/md";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TechList = ({ slice }) => {
  const component = useRef(null);

  // We still keep these state variables and useEffect for safe client-side rendering
  // in Next.js, even if we're not dynamically changing the animation ranges or item counts
  // based on screen width for the animation itself. They are still good practice.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set true once component mounts on the client
  }, []);

  useLayoutEffect(() => {
    if (!component.current || !isClient) return; // Only proceed if component is mounted and on client

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          start: "top top", // Changed to top top for better pinning behavior
          end: "bottom top",
          scrub: 4,
          // markers: true, // IMPORTANT: Uncomment for debugging!
        },
      });

      tl.fromTo(
        ".tech-row",
        {
          x: (index) => {
            // Reverting to fixed pixel values like your "working" code
            return index % 2 === 0
              ? gsap.utils.random(600, 400)
              : gsap.utils.random(-600, -400);
          },
          opacity: 0.1, // Keep initial opacity for subtle fade
        },
        {
          x: (index) => {
            // Reverting to fixed pixel values like your "working" code
            return index % 2 === 0
              ? gsap.utils.random(-600, -400)
              : gsap.utils.random(600, 400);
          },
          opacity: 1, // Keep final opacity
          ease: "power1.inOut",
        },
      );
    }, component);

    return () => ctx.revert();
  }, [isClient]); // Dependency on isClient to re-run effect after client-side hydration

  return (
    <section
      ref={component}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      // Added vertical padding to ensure the section has height for pinning
      // Kept overflow-hidden as this is crucial for the "working" code's behavior on mobile
      className="overflow-hidden py-10 md:py-15 lg:py-20"
    >
      <Bounded as="div">
        <Heading size="lg" className="mb-8" as="h2">
          {slice.primary.heading}
        </Heading>
      </Bounded>

      {slice.primary.repeatable.map((item, index) => (
        <div
          key={index}
          // Keeping justify-center as it was in your "working" example
          // Re-added whitespace-nowrap for the text
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700 whitespace-nowrap overflow-hidden"
          // Removed width: '100vw' as it was not present in your working code
          // and might interfere if combined with justify-center and fixed pixel animations
          style={{
            // These properties are still good for animation performance and text clarity
            willChange: 'transform, opacity',
            // transform: 'translateZ(0)', // GSAP handles this for 'x' animation
          }}
        >
          {/* Fixed number of items to 15, like your "working" code */}
          {/* Also using `index` as the key for `React.Fragment` here */}
          {Array.from({ length: 15 }, (_, i) => {
            // Recalculating middleIndex for 15 items: floor(15 / 2) = 7
            const middleIndex = Math.floor(15 / 2); // 7

            return (
              <React.Fragment key={i}>
                <span
                  className="tech-item text-8xl font-extrabold uppercase tracking-tighter" // Used text-8xl from your working code
                  style={{
                    color: i === middleIndex ? item.tech_color : "inherit",
                    whiteSpace: "nowrap", // Ensure text doesn't wrap
                    transform: 'translateZ(0)', // Force GPU layer for text
                    WebkitFontSmoothing: 'antialiased', // For Safari/Chrome
                    MozOsxFontSmoothing: 'grayscale', // For Firefox
                  }}
                >
                  {item.tech_name}
                </span>
                <span className="text-3xl" style={{ whiteSpace: "nowrap", transform: 'translateZ(0)' }}> {/* Used text-3xl from your working code */}
                  <MdCircle />
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default TechList;