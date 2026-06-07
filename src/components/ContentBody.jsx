
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
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-3 py-8 sm:px-4 sm:py-10 md:px-8 md:py-20">
        <Heading as='h1' className="break-words">{page.data.title}</Heading>

         {/* Tags */}
         <div className="mt-5 flex flex-wrap gap-2 text-lg font-bold text-yellow-400 sm:gap-4 sm:text-xl">
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
        

          <div className="prose prose-lg prose-invert mt-12 max-w-none break-words [overflow-wrap:anywhere] md:mt-20">

        <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}