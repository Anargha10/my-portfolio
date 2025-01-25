import React from "react";
import { createClient } from "@prismicio/client"; // Correct import
import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";
import NavBar from "./NavBar";

export default async function Header() {
    // Create the client with the correct repository name
    const client = createClient("idontkno"); // Your Prismic repository name as a string

    console.log("Client created:", client);

    try {
        // Fetch the settings document
        const settings = await client.getSingle("settings");

        return (
            <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
                <NavBar settings={settings} />
            </header>
        );
    } catch (error) {
        console.error("Error fetching settings document:", error);
        return (
            <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
                <nav>
                    <ul>
                        <li>
                            <Link href="/" aria-label="Home Page">
                                Error: Could not load settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}
