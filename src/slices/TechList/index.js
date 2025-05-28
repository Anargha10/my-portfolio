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

      // Using gsap.matchMedia for cleaner responsive animations
      let mm = gsap.matchMedia();

      // --- Desktop Logic (>= 1024px) ---
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray(".tech-row").forEach((row, index) => {
          const items = row.querySelectorAll(".tech-item");

          gsap.fromTo(
            row,
            {
              x: (index % 2 === 0 ? 600 : -600), // Original desktop animation
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row, // Trigger on the row itself
                start: "top 85%",
                end: "bottom 15%",
                scrub: 1,
                // markers: true, // Enable for desktop debugging if needed
              },
            }
          );

          gsap.fromTo(
            items,
            {
              opacity: 0,
              x: (i) => (i % 2 === 0 ? -100 : 100), // Original desktop item stagger
            },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "bottom 15%",
                scrub: 1,
              },
            }
          );
        });
      });

      // --- Mobile/Tablet Logic (< 1024px) ---
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray(".tech-row").forEach((row, index) => {
          const innerContent = row.querySelector(".tech-row-inner"); // Get the inner content
          if (!innerContent) return; // Safeguard

          // We'll duplicate the content to ensure a seamless loop
          // This should ideally be done in the JSX, but for a quick fix, we can do it here.
          // Better approach would be to render items twice in JSX.
          // For now, let's assume the duplication is handled in JSX as shown below.

          // Calculate the width of the content to scroll
          const contentWidth = innerContent.scrollWidth; // Use scrollWidth to get the full width

          // Determine direction
          const direction = index % 2 === 0 ? -1 : 1; // Even rows move left, odd rows move right

          gsap.to(innerContent, {
            x: (direction * (contentWidth / 2)), // Move half the width for looping. This is adjusted based on how many duplicates you have.
            ease: "none",
            duration: contentWidth / 100, // Adjust duration for desired speed
            repeat: -1, // Infinite loop
            modifiers: {
              x: gsap.utils.wrap(0, contentWidth) // Wrap the x position to create a seamless loop
            }
          });
        });
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

      {/* The tech-row container. overflow-hidden is crucial here. */}
      {slice.primary.repeatable.map((item, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex items-center text-slate-700 overflow-hidden" // Removed justify-center and gap, flex-nowrap if handled by inner div
        >
          {/* Inner div for the actual looping content. This is what GSAP will animate. */}
          {/* We duplicate the content here for a seamless loop */}
          <div className="tech-row-inner flex flex-nowrap items-center gap-4 py-2">
            {/* Render 3 repetitions of the tech name for seamless loop */}
            {Array.from({ length: 3 }, (_, k) => ( // Duplicate content for looping
              <React.Fragment key={k}>
                {/* Adjust item count and styling for mobile here directly using Tailwind classes */}
                {Array.from({ length: 5 }, (_, i) => { // Render fewer visible items for mobile loop
                  const numVisibleItems = 5; // Number of items you want to see before repetition starts
                  const middleIndex = Math.floor(numVisibleItems / 2); // Calculate middle for visible items

                  return (
                    <React.Fragment key={`${k}-${i}`}>
                      <span
                        className="tech-item text-3xl md:text-4xl lg:text-6xl font-extrabold uppercase tracking-tighter" // Responsive font sizes
                        style={{
                          // Only apply color to the "middle" item within the currently visible set
                          color: (i === middleIndex && k === 1) ? item.tech_color : "inherit", // Apply color to middle item of the central duplication
                        }}
                      >
                        {item.tech_name}
                      </span>
                      <span className="text-xl md:text-2xl lg:text-3xl">
                        <MdCircle />
                      </span>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default TechList;