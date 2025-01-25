"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { asLink } from "@prismicio/client";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import Button from "./Button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function NavBar({ settings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:m-4 md:flex-row md:items-center md:rounded-xl">
        <div className="flex items-center justify-between">
          <NameLogo name={settings.data.name} />
          <button
            aria-expanded={open}
            aria-label="Open menu"
            className="block p-2 text-2xl text-slate-800 md:hidden"
            onClick={() => setOpen(true)}
          >
            <MdMenu />
          </button>
        </div>
        <div
          className={clsx(
            "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 bg-slate-50 pr-4 pt-14 transition-transform duration-300 ease-in-out md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]"
          )}
        >
          <button
            aria-label="Close menu"
            aria-expanded={open}
            className="fixed right-4 top-3 block p-2 text-2xl text-slate-800 md:hidden "
            onClick={() => setOpen(false)}
          >
            <MdClose />
          </button>
          
          {settings.data.nav_item.map(({ link, label }, index) => {
            
            // console.log("Lund mera:", link);
            {console.log(settings.data.nav_item)}
            const linkUrl = (settings.data.nav_item[index].link.uid) || "#";
            console.log("main url", linkUrl); // Log the full link object
            return (
              <section key={index}>
                <li className="first:mt-8">
                  <PrismicNextLink
                    className={clsx(
                      "group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-900 "
                    )}
                    href={linkUrl}
                    onClick={() => setOpen(false)}
                    aria-current={pathname.includes(linkUrl) ? "page" : undefined}
                  >
                    <span
                      className={clsx(
                        "absolute inset-0 z-0 h-full translate-y-12 rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                        pathname.includes(linkUrl)
                          ? "translate-y-6"
                          : "translate-y-18"
                      )}
                    />
                    <span className="relative">
                      {typeof(label)  === "string" ? label : JSON.stringify(label)}
                    </span>
                  </PrismicNextLink>
                </li>
                {index < settings.data.nav_item.length - 1 && (
                  <span
                    className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
                    aria-hidden="true"
                  >
                    
                  </span>
                )}
              </section>
            );
          })}
          <li>
            <Button
              linkField={settings.data.cta_link}
              label={""}
              className="ml-3"
            />
          </li>
        </div>
        <DesktopMenu settings={settings} pathname={pathname} />
      </ul>
    </nav>
  );
}

function NameLogo({ name }) {
  // console.log("Name:", name);
  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-xl font-extrabold tracking-tighter text-slate-900"
    >
      {typeof name === "string" ? name : JSON.stringify(name)}
    </Link>
  );
}

function DesktopMenu({ settings, pathname }) {
  
  return (
    <div className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {settings.data.nav_item.map(({ link, label }, index) => {
        //  console.log("Link Object:", link); // Log the full link object
        
        const linkUrl = (settings.data.nav_item[index].link.uid) || "#";
        // console.log("Desktop Link URL:", linkUrl);
        // console.log("Desktop Label:", label);

        return (
          <React.Fragment key={index}>
            <li>
              <PrismicNextLink
                className={clsx(
                  "group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-900"
                )}
                href={linkUrl}// href={linkUrl}
                
                
                aria-current={pathname.includes(linkUrl) ? "page" : undefined}
              >
                <span
                  className={clsx(
                    "absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform  duration-300 ease-in-out group-hover:translate-y-0",
                    pathname.includes(linkUrl)
                      ? "translate-y-6"
                      : "translate-y-8"
                  )}
                />
                <span className="relative">
                  {typeof label === "string" ? label : JSON.stringify(label)}
                </span>
              </PrismicNextLink>
            </li>
            {index < settings.data.nav_item.length - 1 && (
              <span
                className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
                aria-hidden="true"
              >
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
      <ul>
      <li>
       
       
    
       
        <Button
          linkField={settings.data.cta_link}
          label={"Contact Me"}
          className="ml-3 "
        />
      </li>
      </ul>
    </div>
  );
}
