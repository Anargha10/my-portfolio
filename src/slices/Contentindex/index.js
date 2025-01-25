import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import ContentList from "./ContentList";
import { createClient } from "@/prismicio";

/**
 * @typedef {import("@prismicio/client").Content.ContentindexSlice} ContentindexSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContentindexSlice>} ContentindexProps
 * @param {ContentindexProps}
 */
const Contentindex =async ({ slice }) => {

  const client = createClient();
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project");
  const contentType =  slice.primary.content_type || "Blog"


const items = contentType === 'Blog' ? blogPosts : projects;
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="xl" className='mb-8'>

      {slice.primary.heading}
      </Heading>

        {isFilled.richText(slice.primary.description) && (
          <div className="prose prose-xl prose-invert mb-10">
              <PrismicRichText field={slice.primary.description}/>
          </div>
          
        )}
        
        <ContentList items={items} contentType={contentType} viewMoreText={slice.primary.view_more_text}
        fallBackItemImage={slice.primary.fallback_item_image} />
      
    </Bounded>
  );
};

export default Contentindex;
