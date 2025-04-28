import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

function MarkdownForBot({ content }: { content: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  return (
    <>
      <div className="mark_down_text">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkEmoji, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            img: ({ src, alt }) => (
              <img
                onClick={() => {
                  setIsModalOpen(true);
                  setImageUrl(src || "");
                }}
                src={src || ""}
                alt={alt || ""}
                className="w-[250px] h-[200px] rounded-2xl border contain-style p-2"
                width={1500}
                height={1500}
              />
            ),
          }}
          {...({ breaks: true } as any)}
        >
          {content}
        </ReactMarkdown>
      </div>

      {isModalOpen && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={imageUrl}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
}

export default memo(MarkdownForBot);
