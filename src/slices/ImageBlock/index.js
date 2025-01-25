import { PrismicNextImage } from "@prismicio/next";

/**
 * @typedef {import("@prismicio/client").Content.ImageBlockSlice} ImageBlockSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ImageBlockSlice>} ImageBlockProps
 * @param {ImageBlockProps}
 */
const ImageBlock = ({ slice }) => {
  return (
   <PrismicNextImage field={slice.primary.image} imgixParams={{w: 800}} />
  );
};

export default ImageBlock;
