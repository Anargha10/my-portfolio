import Bounded from "@/components/Bounded"
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react"
import Avatar from "./Avatar";
/**
 * @typedef {import("@prismicio/client").Content.BiographySlice} BiographySlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BiographySlice>} BiographyProps
 * @param {BiographyProps}
 */
const Biography = ({ slice }) => {
  
  return (
   
    < Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
  
 <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr] ">
  <Heading
    as="h1"
    size="lg"
    className="col-start-1 whitespace-nowrap mb-2"
  >
    {slice.primary.heading}
  </Heading>


      <div className="prose prose-xl prose-slate prose-invert col-start-1 text-slate-800 mb-4">
          <PrismicRichText field={slice.primary.description}/>
      </div>
        <Button linkField={slice.primary.button_link} 
        label={slice.primary.button_text}/>

       
         
         <Avatar
          image={slice.primary.avatar}
          className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
</div>
      </Bounded>
  );
};

export default Biography;
