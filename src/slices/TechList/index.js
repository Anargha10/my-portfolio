"use client";

import React, { useRef, useLayoutEffect } from "react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { MdCircle } from "react-icons/md";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TechList = ({ slice }) => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray(".tech-row").forEach((row, index) => {
        const items = row.querySelectorAll(".tech-item");

        // --- Animation for the entire row (left/right movement) ---
        gsap.fromTo(
          row,
          {
            // Use responsive x values based on media queries or percentage
            // This ensures they start further out for larger screens, but closer for smaller
            x: (i) => {
                const screenWidth = window.innerWidth;
                if (screenWidth < 640) { // Small screens (e.g., phones)
                    return (index % 2 === 0 ? "100%" : "-100%"); // Start completely off-screen
                } else if (screenWidth < 1024) { // Medium screens (e.g., tablets)
                    return (index % 2 === 0 ? "80%" : "-80%");
                } else { // Large screens (desktops)
                    return (index % 2 === 0 ? "600px" : "-600px");
                }
            },
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row, // Trigger on the row itself
              start: "top 85%", // Trigger when row enters the viewport
              end: "bottom 15%", // End animation when row exits
              scrub: 1, // Smooth scroll effect
              // markers: true, // Enable markers for debugging - useful for fine-tuning
            },
          }
        );

        // --- Animation for individual items (stagger effect) ---
        gsap.fromTo(
          items,
          {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? -20 : 20), // Smaller initial x for individual items
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.05, // Slightly reduced stagger
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "bottom 15%",
              scrub: 1,
            },
          }
        );
      });
    }, component);

    return () => ctx.revert(); // Cleanup animations
  }, []);

  return (
    <section
      ref={component}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Bounded>
        <Heading size="lg" className="mb-8" as="h2">
          {slice.primary.heading}
        </Heading>
      </Bounded>

      {slice.primary.repeatable.map((item, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex flex-nowrap items-center justify-center gap-2 md:gap-4 text-slate-700 whitespace-nowrap overflow-hidden" // Added whitespace-nowrap, adjusted gap
        >
          {/* Dynamically adjust number of items based on screen size */}
          {Array.from({ length: window.innerWidth < 640 ? 3 : (window.innerWidth < 1024 ? 7 : 15) }, (_, i) => {
            const numItems = window.innerWidth < 640 ? 3 : (window.innerWidth < 1024 ? 7 : 15);
            const middleIndex = Math.floor(numItems / 2);

            return (
              <React.Fragment key={i}>
                <span
                  className="tech-item text-lg md:text-3xl lg:text-6xl font-extrabold uppercase tracking-tighter" // More granular responsive font sizes
                  style={{
                    color: i === middleIndex ? item.tech_color : "inherit", // Apply color to the middle item dynamically
                  }}
                >
                  {item.tech_name}
                </span>
                <span className="text-xl md:text-2xl lg:text-3xl"> {/* Responsive icon size */}
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