"use client";

import React, { useRef, useState, useEffect } from "react";
import { asImageSrc, isFilled } from "@prismicio/client";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const ContentList = ({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Read More",
}) => {
  const component = useRef(null);
  const itemsRef = useRef([]);
  const revealRef = useRef(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [hovering, setHovering] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const urlPrefix = contentType === "Blog" ? "/blog" : "/project";

  useEffect(() => {
    console.log("Initializing GSAP context");
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        console.log(`Animating item at index: ${index}`);
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, component);

    return () => {
      console.log("Reverting GSAP context");
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      const speed = Math.sqrt(
        Math.pow(mousePos.x - lastMousePos.current.x, 2)
      );

      if (currentItem !== null) {
        const maxY = window.scrollY + window.innerHeight - 350;
        const maxX = window.innerWidth - 250;

        console.log(`Moving reveal element for item: ${currentItem}`);
        gsap.to(revealRef.current, {
          x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
          y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
          rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
          ease: "back.out(2)",
          duration: 1.3,
        });
        gsap.to(revealRef.current, {
          opacity: hovering ? 1 : 0,
          visibility: "visible",
          ease: "power3.out",
          duration: 0.4,
        });
      }

      lastMousePos.current = mousePos;
    };

    console.log("Adding mousemove event listener");
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      console.log("Removing mousemove event listener");
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovering, currentItem]);

  const onMouseEnter = (index) => {
    console.log(`Mouse entered item at index: ${index}`);
    setCurrentItem(index);
    if (!hovering) setHovering(true);
  };

  const onMouseLeave = () => {
    console.log("Mouse left the item");
    setHovering(false);
    setCurrentItem(null);
  };

  const contentImages = items.map((item, index) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;
    console.log(`Processing image for item at index: ${index}`);
    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10,
    });
  });

  useEffect(() => {
    console.log("Preloading content images");
    contentImages.forEach((url, index) => {
      if (!url) return;
        const img = new Image();
        img.src = url;
        console.log(`Preloaded image for item at index: ${index}`);
      
    });
  }, [contentImages]);

  return (
    <ul
      ref={component}
      className="grid border-b border-b-slate-100 "
      onMouseLeave={onMouseLeave}
    >
      {items.map((post, index) => (
        <>
        {isFilled.keyText(post.data.title) &&(
        <li
          key={index}
          ref={(el) => (itemsRef.current[index] = el)}
          onMouseEnter={() => onMouseEnter(index)}
          className="list-item opacity-0"
        >
          <Link
            href={urlPrefix + "/" + post.uid}
            className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
            aria-label={post.data.title}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{post.data.title}</span>
              <div className="flex gap-3 text-yellow-400">
                {post.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="text-lg font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
              {viewMoreText} <MdArrowOutward />
            </span>
          </Link>
        </li>
        )}
        </>
      ))}

      <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : "",
             // Add this line
        }}
        ref={revealRef}
      ></div>
    </ul>
  );
};

export default ContentList;
