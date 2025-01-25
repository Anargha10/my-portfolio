import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.TextBlockSlice} TextBlockSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TextBlockSlice>} TextBlockProps
 * @param {TextBlockProps}
 */
const TextBlock = ({ slice }) => {
  return (
    <div className="max-w-prose">
      <PrismicRichText field={slice.primary.text}/>
    </div>
    
  );
};

export default TextBlock;
