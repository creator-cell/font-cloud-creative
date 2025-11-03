"use client";

import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const MarkdownPreview = ({ markdown, isStreaming }: { markdown: string; isStreaming: boolean }) => {
  const nodes = useMemo(() => parseMarkdown(markdown), [markdown]);
  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed text-slate-700 [&_a]:text-sky-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        isStreaming && "opacity-80"
      )}
    >
      {nodes}
    </div>
  );
};

const parseMarkdown = (value: string) => {
  const elements: ReactNode[] = [];
  const lines = value.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] | null = null;
  let code: { language: string | null; content: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      elements.push(<p key={`p-${elements.length}`}>{renderInline(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list && list.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5">
          {list.map((item, index) => (
            <li key={`li-${elements.length}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  const flushCode = () => {
    if (code) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100"
        >
          <code>{code.content.join("\n")}</code>
        </pre>
      );
      code = null;
    }
  };

  lines.forEach((line) => {
    if (code) {
      if (line.startsWith("```") ) {
        flushCode();
      } else {
        code.content.push(line);
      }
      return;
    }

    if (line.startsWith("```") ) {
      flushParagraph();
      flushList();
      code = { language: line.slice(3).trim() || null, content: [] };
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith("#")) {
      flushParagraph();
      flushList();
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const content = line.replace(/^#+\s*/, "");
      elements.push(createHeading(level, content, elements.length));
      return;
    }

    if (line.trim().startsWith("- ")) {
      flushParagraph();
      list = list ?? [];
      list.push(line.trim().slice(2));
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCode();
  return elements;
};

const createHeading = (level: number, content: string, index: number) => {
  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag key={`heading-${index}`} className="font-semibold text-slate-800">
      {renderInline(content)}
    </HeadingTag>
  );
};

const renderInline = (value: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`strong-${nodes.length}`}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`em-${nodes.length}`}>{renderInline(token.slice(1, -1))}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={`code-${nodes.length}`} className="rounded bg-slate-200 px-1 py-0.5 text-xs text-slate-900">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const [, text, url] = token.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      if (text && url) {
        nodes.push(
          <a key={`link-${nodes.length}`} href={url} target="_blank" rel="noreferrer" className="text-sky-600 underline">
            {text}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
};
