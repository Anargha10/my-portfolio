import React from "react";
import clsx from "clsx";

const Bounded = React.forwardRef(
  ({ as: Comp = "section", className = "", children, ...restProps }, ref) => {
    return (
      <Comp
        ref={ref}
        className={clsx("px-4 py-10 md:px-6 md:py-15 lg:py-16", className)} // Fixed usage of clsx
        {...restProps}
      >
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </Comp>
    );
  }
);

Bounded.displayName = "Bounded";

export default Bounded;
