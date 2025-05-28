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
            x: (i) => {
                const screenWidth = window.innerWidth;
                if (screenWidth < 640) {
                    return (index % 2 === 0 ? "100vw" : "-100vw");
                } else if (screenWidth < 1024) {
                    return (index % 2 === 0 ? "80vw" : "-80vw");
                } else {
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
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              // markers: true, // Re-enable for debugging!
            },
          }
        );

        // --- Animation for individual items (stagger effect) ---
        gsap.fromTo(
          items,
          {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? -10 : 10),
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.03,
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              // markers: true, // Re-enable for debugging!
            },
          }
        );
      });
    }, component);

    return () => ctx.revert();
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

      {/* !!! MOVE THE TECH-ROW LOOP OUTSIDE Bounded !!! */}
      {slice.primary.repeatable.map((item, index) => (
        <div
          key={index}
          // The overflow-hidden on tech-row is crucial here
          className="tech-row mb-8 flex flex-nowrap items-center justify-center gap-2 md:gap-4 text-slate-700 whitespace-nowrap overflow-hidden"
          // Keep minWidth for the row itself
          style={{ minWidth: "100vw" }}
        >
          {Array.from({ length: window.innerWidth < 640 ? 3 : (window.innerWidth < 1024 ? 7 : 15) }, (_, i) => {
            const numItems = window.innerWidth < 640 ? 3 : (window.innerWidth < 1024 ? 7 : 15);
            const middleIndex = Math.floor(numItems / 2);

            return (
              <React.Fragment key={i}>
                <span
                  className="tech-item text-xl md:text-3xl lg:text-6xl font-extrabold uppercase tracking-tighter"
                  style={{
                    color: i === middleIndex ? item.tech_color : "inherit",
                  }}
                >
                  {item.tech_name}
                </span>
                <span className="text-lg md:text-xl lg:text-3xl">
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