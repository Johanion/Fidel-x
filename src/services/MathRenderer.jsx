import React from 'react';
import { View, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import MathJax from 'react-native-mathjax';

const ReadingDoc = () => {
  // Regex to split latex math expressions (only \\[ ... \\] and \\( ... \\))
  const parseContent = (content) => {
    const mathRegex = /(\\\[.*?\\\]|\\\(.*?\\\))/g;
    const parts = content.split(mathRegex).filter(Boolean);
    return parts.map((part, idx) => ({
      type: mathRegex.test(part) ? 'math' : 'text',
      content: part,
      key: `part-${idx}`,
    }));
  };

  // Converts LaTeX text markup to markdown for Markdown rendering
  const convertLatexToMarkdown = (text) => {
    let result = text;
    result = result.replace(/\\section\*?\{([^}]+)\}/g, '## $1');
    result = result.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
    result = result.replace(/\\emph\{([^}]+)\}/g, '*$1*');
    result = result.replace(/\\textit\{([^}]+)\}/g, '*$1*');
    result = result.replace(/\\begin\{itemize\}/g, '');
    result = result.replace(/\\end\{itemize\}/g, '');
    result = result.replace(/\\item\s+/g, '- ');
    result = result.replace(/\\vspace\{[^}]+\}/g, '\n\n');
    result = result.replace(/\\\\/g, '\n');
    return result;
  };

  const content = `
\\section*{Introduction}

Welcome to this lesson on solving quadratic equations by factoring!

\\section*{Step-by-Step Guide}

\\begin{enumerate}
  \\item Rewrite the equation: \\[
  ax^2 + bx + c = 0
  \\]
  \\item Factor the quadratic: \\[
  x^2 + 5x + 6 = 0
  \\]
  \\item Apply zero-product property: \\[
  (x + 2)(x + 3) = 0
  \\]
  \\item Solve for \\( x \\):
  \\[
  x = -2 \\quad \\text{or} \\quad x = -3
  \\]
\\end{enumerate}
`;

  const parts = parseContent(content);

  // Function to double escape backslashes for MathJax in React Native WebView
  const escapeMathjax = (latex) => {
    // Replace single backslash with double backslash for math-rendering correctness
    return latex.replace(/\\/g, '\\\\');
  };

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {parts.map(({ type, content, key }) => {
          if (type === 'math') {
            // Clean delimiters and escape backslashes
            const cleaned = content.trim();
            const wrapped = `<span>\\\\${cleaned}\\\\</span>`; // wrap for HTML MathJax

            // Escape double backslash needed for react-native-mathjax WebView html
            const escapedMath = escapeMathjax(wrapped);

            // Pass as full HTML string to MathJax with math formula double escaped
            return (
              <MathJax
                key={key}
                html={escapedMath}
                mathJaxOptions={{
                  messageStyle: 'none',
                  extensions: ['tex2jax.js'],
                  jax: ['input/TeX', 'output/HTML-CSS'],
                  tex2jax: {
                    inlineMath: [['\\(', '\\)']],
                    displayMath: [['\\[', '\\]']],
                    processEscapes: true,
                  },
                  TeX: {
                    extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
                  },
                }}
                style={{ marginHorizontal: 4, lineHeight: 24 }}
              />
            );
          } else {
            return (
              <Markdown key={key} style={{ flexShrink: 1 }}>
                {convertLatexToMarkdown(content)}
              </Markdown>
            );
          }
        })}
      </View>
    </ScrollView>
  );
};

export default ReadingDoc;
