import sanitizeHtml from "sanitize-html";

/** Sanitizes Tiptap-produced article HTML. Strips scripts, event handlers, and unsafe URLs. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html || "", {
    allowedTags: [
      "p", "br", "h1", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "del",
      "blockquote", "ul", "ol", "li", "a", "img", "hr", "code", "pre", "figure", "figcaption", "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["style", "class"],
    },
    allowedStyles: {
      "*": { "text-align": [/^(left|right|center|justify)$/] },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    },
  });
}
