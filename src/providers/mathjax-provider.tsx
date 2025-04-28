'use client';
import { MathJaxContext } from 'better-react-mathjax';
import React from 'react';

const MathJaxProvider = ({ children }: { children: React.ReactNode }) => {
  // config
  const config = {
    options: {
      messageStyle: 'none'
    },
    'fast-preview': {
      disabled: true
    },
    tex2jax: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)']
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]']
      ]
    },
    tex: {
      loader: { load: ['ui/lazy'] },
      jax: ['input/TeX', 'output/HTML-CSS'],
      packages: { '[+]': ['html'] },
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)']
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]']
      ]
    },
    'HTML-CSS': {
      linebreaks: { automatic: true }
    },
    SVG: {
      linebreaks: { automatic: true }
    }
  };

  return (
    <MathJaxContext version={2} config={config} onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 1)}>
      {children}
    </MathJaxContext>
  );
};

export default MathJaxProvider;
