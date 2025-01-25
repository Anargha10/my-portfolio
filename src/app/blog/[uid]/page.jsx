import { notFound, redirect } from "next/navigation";

import { createClient } from "@/prismicio";

import ContentBody from "@/components/ContentBody";

export default async function Page({ params }) {
    console.log("CHOTA PROBLEMMMMMMMMM: ", params)
  const { uid } = await params;
  
  const client = createClient();
  const page = await client.getByUID("blog_post", uid, {
    fetch: ['date', 'title', 'tags', 'slices'],
    fetchLinks: ['related_post.date']
  }).catch(() => redirect('/'+ params.uid));

 
  
  return (
    <ContentBody page={page}/>
  );
}