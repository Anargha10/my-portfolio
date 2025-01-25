
import { isFilled, asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";


import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

export default  function ContentBody({ page }) {
  

  function formatDate(date) {
    if (!isFilled.date(date)) return null;
    
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date));
  }

  const formattedDate = formatDate(page.data.date);

  return (
    <Bounded as='article'>
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as='h1'>{page.data.title}</Heading>

         {/* Tags */}
         <div className="flex gap-4 text-yellow-400 text-xl font-bold mt-5">
          {page.tags.map((tag) => (
            <span key={tag} className="">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Date display */}
        
          <p className="mt-7 border-b border-slate-600  text-xl font-medium text-slate-300">
            {formattedDate}
          </p>
        

          <div className="prose prose-lg prose-invert mt-12 max-w-none md:mt-20">

        <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}