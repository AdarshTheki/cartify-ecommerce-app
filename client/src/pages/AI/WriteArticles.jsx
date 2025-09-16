import React, { useState } from 'react';
import { AiToolsData } from '../../assets';
import { toast } from 'react-toastify';
import AIToolLayout from './AIToolLayout';
import useApi from '../../hooks/useApi';

const WriteArticle = () => {
  const styleData = [
    'Short (200-300 word)',
    'Medium (600-800 word)',
    'Long (1200+ word)',
  ];
  const [selected, setSelected] = useState(styleData[0]);
  const [input, setInput] = useState('');
  const { loading, data, callApi, setData } = useApi();

  const aiTool = {
    ...AiToolsData[0],
    inputLabel: 'Article Topic',
    placeholder: 'The future of artificial intelligence...',
    styleLabel: 'Article Length',
  };

  const handleSubmit = async () => {
    if (!input.trim()) return toast.error('Enter a valid article topic');

    const prompt = `
      You are a professional article writer. 
      Write a well-structured, engaging, and informative article based on the given inputs.
      Inputs: 
      - Article Topic: ${input}  
      - Article Length: ${selected}  
      Rules:
      1. Match the requested length:  
         - Short → 200–300 words  
         - Medium → 600–800 words  
         - Long → 1200+ words  
      2. Structure the article with:  
         - A clear introduction  
         - A well-organized body (use subheadings if helpful)  
         - A strong conclusion  
      3. Ensure the tone matches the topic (professional, educational, lifestyle, etc.).  
      4. Make the article human-like, plagiarism-free, and optimized for readability.  
      5. Do not include filler text like "In this article we will discuss" — just deliver the content directly.  
      6. Use simple, clear, and engaging language suitable for a broad audience.  
  `;

    const result = await callApi('/openai/generate-text', {
      prompt,
      userText: input,
    });
    if (result) {
      setData(result);
      setSelected(styleData[0]);
      setInput('');
    }
  };

  return (
    <AIToolLayout
      aiTool={aiTool}
      styleData={styleData}
      handleSubmit={handleSubmit}
      input={input}
      setInput={setInput}
      selected={selected}
      setSelected={setSelected}
      loading={loading}
      data={data}
    />
  );
};

export default WriteArticle;
