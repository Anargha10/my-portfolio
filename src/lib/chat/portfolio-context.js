import { unstable_cache } from "next/cache";
import { asText, isFilled } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { CONTACT_INFO, FALLBACK_PORTFOLIO_CONTEXT } from "./constants";

const MAX_TEXT_SNIPPET = 250;
const MAX_PROJECT_SNIPPET = 200;

function snippet(text, max = MAX_TEXT_SNIPPET) {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max).trim()}…`;
}

function extractSlices(slices, collectors) {
  for (const slice of slices ?? []) {
    switch (slice.slice_type) {
      case "biography": {
        const heading = slice.primary?.heading;
        const description = isFilled.richText(slice.primary?.description)
          ? asText(slice.primary.description)
          : "";
        if (heading || description) {
          collectors.biography.push(
            [heading, snippet(description)].filter(Boolean).join("\n")
          );
        }
        break;
      }
      case "experience": {
        const heading = slice.primary?.heading;
        const entries = [];
        if (heading) entries.push(`Section: ${heading}`);

        for (const item of slice.primary?.repeatable ?? []) {
          const header = [item.title, item.time_period, item.institution]
            .filter(Boolean)
            .join(" — ");
          if (header) entries.push(header);
          if (isFilled.richText(item.description)) {
            entries.push(snippet(asText(item.description)));
          }
        }

        if (entries.length) collectors.experience.push(entries.join("\n"));
        break;
      }
      case "tech_list": {
        for (const item of slice.primary?.repeatable ?? []) {
          if (item.tech_name) collectors.skills.add(item.tech_name);
        }
        const heading = slice.primary?.heading;
        if (heading) collectors.skillHeadings.add(heading);
        break;
      }
      case "hero": {
        const name = [slice.primary?.first_name, slice.primary?.second_name]
          .filter(Boolean)
          .join(" ");
        const tagline = slice.primary?.tag_line;
        if (name) collectors.hero.push(`Name: ${name}`);
        if (tagline) collectors.hero.push(`Tagline: ${tagline}`);
        break;
      }
      case "contentindex": {
        const heading = slice.primary?.heading;
        const description = isFilled.richText(slice.primary?.description)
          ? snippet(asText(slice.primary.description))
          : "";
        const contentType = slice.primary?.content_type || "Content";
        const block = [heading && `${contentType}: ${heading}`, description]
          .filter(Boolean)
          .join("\n");
        if (block) collectors.contentIndex.push(block);
        break;
      }
      default:
        break;
    }
  }
}

function extractProject(project) {
  const parts = [`- ${project.data.title ?? project.uid}`];

  if (project.data.date) {
    parts.push(`  Date: ${project.data.date}`);
  }

  if (isFilled.keyText(project.data.meta_description)) {
    parts.push(`  Summary: ${snippet(project.data.meta_description, MAX_PROJECT_SNIPPET)}`);
  }

  for (const slice of project.data.slices ?? []) {
    if (
      slice.slice_type === "text_block" &&
      isFilled.richText(slice.primary?.text)
    ) {
      parts.push(`  ${snippet(asText(slice.primary.text), MAX_PROJECT_SNIPPET)}`);
    }
  }

  return parts.join("\n");
}

function buildContextDocument(collectors, projects) {
  const sections = [];

  if (collectors.hero.length) {
    sections.push(collectors.hero.join("\n"));
  }

  if (collectors.biography.length) {
    sections.push(
      `About:\n${[...new Set(collectors.biography)].join("\n\n")}`
    );
  }

  if (collectors.skills.size) {
    const headings = [...collectors.skillHeadings].join(", ");
    sections.push(
      `Skills & Technologies${headings ? ` (${headings})` : ""}:\n${[...collectors.skills].join(", ")}`
    );
  }

  if (collectors.experience.length) {
    sections.push(
      `Experience:\n${[...new Set(collectors.experience)].join("\n\n")}`
    );
  }

  if (collectors.contentIndex.length) {
    sections.push(
      `Site sections:\n${[...new Set(collectors.contentIndex)].join("\n\n")}`
    );
  }

  if (projects.length) {
    sections.push(`Projects:\n${projects.join("\n\n")}`);
  }

  sections.push(
    `Contact:\n- Email: ${CONTACT_INFO.email}\n- Phone: ${CONTACT_INFO.phone}`
  );

  return sections.join("\n\n").trim();
}

async function fetchPortfolioContext() {
  const collectors = {
    hero: [],
    biography: [],
    experience: [],
    skills: new Set(),
    skillHeadings: new Set(),
    contentIndex: [],
  };

  try {
    const client = createClient();

    const [homepage, pages, projects] = await Promise.all([
      client.getSingle("homepage").catch(() => null),
      client.getAllByType("page"),
      client.getAllByType("project"),
    ]);

    if (homepage?.data?.slices) {
      extractSlices(homepage.data.slices, collectors);
    }

    for (const page of pages) {
      extractSlices(page.data.slices, collectors);
    }

    const projectSummaries = projects.map(extractProject);
    const document = buildContextDocument(collectors, projectSummaries);

    if (!document || collectors.skills.size === 0 && !collectors.biography.length) {
      return FALLBACK_PORTFOLIO_CONTEXT;
    }

    return document;
  } catch (error) {
    console.error("Failed to load Prismic portfolio context for chat:", error);
    return FALLBACK_PORTFOLIO_CONTEXT;
  }
}

export const getPortfolioContext = unstable_cache(
  fetchPortfolioContext,
  ["portfolio-chat-context-v2"],
  { revalidate: 3600, tags: ["prismic"] }
);
