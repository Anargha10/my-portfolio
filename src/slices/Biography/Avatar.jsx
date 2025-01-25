"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";

export default function Avatar({ image, className }) {
  const component = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation for avatar appearance
      gsap.fromTo(
        ".avatar",
        { opacity: 0, scale: 1.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.3, // Fixed animation duration
          ease: "power3.inOut",
        }
      );

      // Mousemove interaction for avatar rotation
      const handleMouseMove = (e) => {
        if (!component.current) return;

        const componentRect = component.current.getBoundingClientRect();
        const componentCenterX = componentRect.left + componentRect.width / 2;

        const componentPercent = {
          x: (e.clientX - componentCenterX) / componentRect.width / 2,
        };

        const distFromCenterX = 1 - Math.abs(componentPercent.x);

        gsap
          .timeline({ defaults: { duration: 0.5, overwrite: "auto", ease: "power3.out" } })
          .to(
            ".avatar",
            {
              rotation: gsap.utils.clamp(-2, 2, 5 * componentPercent.x),
              duration: 0.5,
            },
            0
          )
          .to(
            ".highlight",
            {
              opacity: distFromCenterX - 0.7,
              x: -10 + 20 * componentPercent.x,
              duration: 0.5,
            },
            0
          );
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, component);

    return () => ctx.revert(); // Cleanup animations
  }, []);

  return (
    <div ref={component} className={clsx("relative h-full w-full", className)}>
      <div
        className="avatar aspect-square overflow-hidden rounded-3xl border-2 border-slate-700 opacity-0"
        style={{ perspective: "500px", perspectiveOrigin: "150% 150%" }}
      >
        <PrismicNextImage
          field={image}
          className="avatar-image h-full w-full object-fill"
          imgixParams={{ q: 90 }}
        />
        <div className="highlight absolute inset-0 hidden w-full scale-110 bg-gradient-to-tr from-transparent via-blue-200 to-transparent opacity-0 md:block"></div>
      </div>
    </div>
  );
}
