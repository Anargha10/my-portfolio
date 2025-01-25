import { notFound, redirect } from "next/navigation";
import { isFilled, asImageSrc } from "@prismicio/client";


import { createClient } from "@/prismicio";

import ContentBody from "@/components/ContentBody";

export default async function Page({ params }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("project", uid).catch(() => notFound());
  
  return < ContentBody page={page} />;
}

export async function generateMetadata({ params }) {
    const { uid } = await params;
    // console.log("PROBLEMMMMMMMMMMMM: ", params)
    
  const client = createClient();
  const page = await client.getByUID("project", uid).catch(() => redirect('/'+ params.uid));
//   console.log("laude ka page", page)

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title)
        ? page.data.meta_title
        : undefined,
      description: isFilled.keyText(page.data.meta_description)
        ? page.data.meta_description
        : undefined,
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}