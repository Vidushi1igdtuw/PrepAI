import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

export const MarkdownRenderer = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="markdown-body text-[#30263A]">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline) {
              const codeId = Math.random().toString(36).substring(7);
              return (
                <div className="relative my-4 rounded-xl overflow-hidden border border-[#F1E6EE] bg-[#FFFFFF] group">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-[#FFF9FC] border-b border-[#F1E6EE] text-xs text-[#817487]">
                    <span className="font-mono uppercase tracking-wider">{match ? match[1] : 'code'}</span>
                    <button
                      onClick={() => handleCopy(codeString, codeId)}
                      className="flex items-center space-x-1.5 text-xs text-[#817487] hover:text-[#30263A] transition-colors"
                    >
                      {copiedCodeIndex === codeId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto text-[#30263A]">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code className="bg-[#FFF9FC] text-[#C65B89] px-1.5 py-0.5 rounded text-xs font-mono border border-[#E879A9]/20" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
