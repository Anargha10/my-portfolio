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
      // Check for screen width
      const isMobile = window.innerWidth < 768; // You can adjust this breakpoint

      gsap.utils.toArray(".tech-row").forEach((row, index) => {
        const items = row.querySelectorAll(".tech-item");

        gsap.fromTo(
          row,
          {
            // Adjust x value based on screen size
            x: isMobile ? (index % 2 === 0 ? 200 : -200) : (index % 2 === 0 ? 600 : -600),
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: component.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
              // markers: true, // Enable markers for debugging
            },
          }
        );

        gsap.fromTo(
          items,
          {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? -50 : 50), // Reduced item stagger for mobile
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
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

      {slice.primary.repeatable.map((item, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700 overflow-hidden" // Added overflow-hidden
        >
          {/* Adjust the number of items based on screen size for better mobile display */}
          {Array.from({ length: window.innerWidth < 768 ? 5 : 15 }, (_, i) => ( // Show fewer items on mobile
            <React.Fragment key={i}>
              <span
                className="tech-item text-xl md:text-6xl font-extrabold uppercase tracking-tighter" // Responsive font size
                style={{
                  color: i === Math.floor((window.innerWidth < 768 ? 5 : 15) / 2) ? item.tech_color : "inherit", // Apply color to the middle item dynamically
                }}
              >
                {item.tech_name}
              </span>
              <span className="text-xl md:text-3xl"> {/* Responsive icon size */}
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;