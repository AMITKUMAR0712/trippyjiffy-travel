import React from "react";
import Style from "../Style/utils.module.scss";

export const safeParse = (data) => {
  if (!data) return {};
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("❌ JSON parse error:", error, data);
    return {};
  }
};

export const renderBlocks = (paragraphs) => {
  if (!paragraphs || !paragraphs.blocks) return null;

  return paragraphs.blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "header":
        return React.createElement(`h${block.data.level || 2}`, {
          key: index,
          dangerouslySetInnerHTML: { __html: block.data.text },
        });

      case "list":
        return block.data.style === "ordered" ? (
          <ol key={index}>
            {block.data.items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: typeof item === "string" ? item : item.content,
                }}
              />
            ))}
          </ol>
        ) : (
          <ul key={index}>
            {block.data.items.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: typeof item === "string" ? item : item.content,
                }}
              />
            ))}
          </ul>
        );

      case "inlineImage":
        return (
          <div key={index} className={Style.inlineImage}>
            <img src={block.data.url} alt={block.data.caption || "image"} />
            {block.data.caption && <p>{block.data.caption}</p>}
          </div>
        );

      default:
        return null;
    }
  });
};
