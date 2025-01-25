

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
      // Loop through each `.tech-row` and apply scroll-triggered animations
      gsap.utils.toArray(".tech-row").forEach((row, index) => {
        const items = row.querySelectorAll(".tech-item");

        gsap.fromTo(
          row,
          {
            x: (index % 2 === 0 ? 600 : -600), // Start from off-screen horizontally
            opacity: 0,
          },
          {
            x: 0, // Move to normal position (center)
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: component.current,
              start: "top 80%", // Trigger when row enters the viewport
              end: "bottom 20%", // End animation when row exits
              scrub: 1, // Smooth scroll effect
              markers: false, // Enable markers for debugging
            },
          }
        );

        // Optionally animate individual items with a stagger effect
        gsap.fromTo(
          items,
          {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? -100 : 100), // Start from left or right
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1, // Stagger the animations
            scrollTrigger: {
              trigger: row,
              start: "top 80%", // Trigger when row enters the viewport
              end: "bottom 20%", // End animation when row exits
              scrub: 1, // Smooth scroll effect
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
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
        >
          {Array.from({ length: 15 }, (_, i) => (
            <React.Fragment key={i}>
              <span
                className="tech-item text-6xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: i === 7 ? item.tech_color : "inherit", // Apply color only to the 7th item
                }}
              >
                {item.tech_name}
              </span>
              <span className="text-3xl">
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
