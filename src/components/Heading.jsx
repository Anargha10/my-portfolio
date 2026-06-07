import clsx from "clsx";

export default function Heading({
  as = "h1", // Default to "h1" if no `as` prop is provided
  className,
  children,
  size = "lg", // Default size to "lg"
}) {
  const Component = as; // Dynamically set the component tag

  return (
    <Component
      className={clsx(
        "max-w-full break-words font-bold leading-tight tracking-tight text-slate-300",
        size === "xl" && "text-4xl sm:text-5xl md:text-7xl lg:text-9xl",
        size === "lg" && "text-4xl sm:text-5xl md:text-6xl lg:text-8xl",
        size === "md" && "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        size === "sm" && "text-2xl sm:text-3xl md:text-4xl",
        className
      )}
    >
      {children}
    </Component>
  );
}
