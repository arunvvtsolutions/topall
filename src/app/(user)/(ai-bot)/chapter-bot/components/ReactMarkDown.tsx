import React, { memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

function MarkdownForBot({ content }: { content: string }) {
  console.log(content);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const preprocessLaTeX = useCallback((content: string) => {
    const lineBreakProcessed = content
      .replace(/\\n/g, "\n") // Convert escaped \n to actual newlines
      .replace(/\n\t+/g, "\n&nbsp;&nbsp;&nbsp;&nbsp;") // Replace tabs with spaces
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Convert stray tabs
      .replace(/(\d)\s+(\d)/g, "$1\u200B$2"); // Prevent number splitting

    // Ensure "Question X" starts on a separate line
    const questionFormattedContent = lineBreakProcessed.replace(
      /(.*?)(\*\*Question\s*\d+:?\*\*)/g,
      (_, beforeQuestion, questionHeading) => `${beforeQuestion.trim()}\n\n${questionHeading}\n`
    );

    // 1. Insert line breaks before "**Options:**" if needed.
    //    This replaces any spaces + "**Options:**" with "\n\n**Options:**"
    const optionsTitleFormatted = questionFormattedContent.replace(/\s*\*\*Options:?\*\*\s*/g, "\n\n**Options**\n\n");

    //  removed dynamically picking Ensure **any heading (bold/italic)** starts on a new line
    const formattedHeadings = optionsTitleFormatted.replace(
      /(\n)?(\*{2,3}[\w\s]+:\*{2,3})/g, // Matches **Heading:** or ***Heading:***
      "\n\n$2\n\n"
    );

    // 2. Put each option (A), B), C), D)) on its own line.
    const separatedOptions = formattedHeadings.replace(
      /(A\)|B\)|C\)|D\))[\s\S]*?(?=(?:\n[A-D]\))|$)/g,
      (match) => `\n${match.trim()}\n`
    );
    
    // Process block equations ($$ ... $$)
    const blockProcessedContent = separatedOptions.replace(/\\\[(.*?)\\\]/g, (_, equation) => `$$${equation}$$`);

    // Process inline equations ($ ... $)
    const inlineProcessedContent = blockProcessedContent.replace(/\\\((.*?)\\\)/g, (_, equation) => `$${equation}$`);

    // Additional step: Remove extra escaping (double backslashes to single backslashes)
    const fullyProcessedContent = inlineProcessedContent.replace(/\\\\/g, "\\");

    return separatedOptions;
  }, []);
  
  const processedContent = preprocessLaTeX(`${content}`);
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
         {processedContent}
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
