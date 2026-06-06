"use client";

import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMarkdown({ content }) {
  return (
    <div
      className={clsx(
        "prose prose-sm max-w-none break-words",
        "prose-invert",
        "prose-p:my-2 prose-p:leading-relaxed prose-p:text-slate-100",
        "prose-headings:mb-2 prose-headings:mt-3 prose-headings:text-slate-50",
        "prose-strong:font-semibold prose-strong:text-cyan-300",
        "prose-em:text-slate-200",
        "prose-li:my-0.5 prose-li:text-slate-100",
        "prose-ol:my-2 prose-ul:my-2",
        "prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        p: ({ children }) => <p className="first:mt-0 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc space-y-1.5 pl-4 marker:text-cyan-400/80">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-2 pl-4 marker:font-medium marker:text-cyan-400/90">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-slate-50">{children}</h3>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
