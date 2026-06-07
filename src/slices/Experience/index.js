import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicRichText } from "@prismicio/react";

const Experience = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading as="h2" size="lg">
        {slice.primary.heading}
      </Heading>
      {slice.primary.repeatable.map((item, index) => (
        <div key={index} className="ml-2 mt-8 max-w-prose sm:ml-6 md:ml-12 md:mt-16">
          <Heading as="h3" size="sm">
            {item.title}
          </Heading>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-lg font-semibold tracking-tight text-slate-400 sm:text-2xl">
            <span>{item.time_period}</span>
            <span className="text-3xl font-extralight">/</span>
            <span>{item.institution}</span>
          </div>
          <div className="prose prose-lg prose-invert mt-4">
            <PrismicRichText field={item.description} />
          </div>
        </div>
      ))}
    </Bounded>
  );
};

export default Experience;
