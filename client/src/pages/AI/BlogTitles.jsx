import React, { useState } from 'react';
import { AiToolsData } from '../../assets';
import useApi from '../../hooks/useApi';
import AIToolLayout from './AIToolLayout';

const BlogTitles = () => {
  const styleData = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ];
  const [selected, setSelected] = useState('General');
  const [input, setInput] = useState('');
  const { loading, data, callApi, setData } = useApi();

  const aiTool = {
    ...AiToolsData[1],
    inputLabel: 'Keyword',
    placeholder: 'The future of artificial intelligence...',
    styleLabel: 'Category',
  };

  const prompt = `
      You are a creative blog title generator. 
      Generate 10 unique, catchy, and SEO-friendly blog title ideas.  
      Inputs: 
      - text: ${input} 
      - category: ${selected}
      Rules:
      1. The titles must be relevant to the given text.  
      2. Adapt the style to the selected category (e.g., professional for Business, trendy for Lifestyle, informative for Education, etc.).  
      3. Each title should be concise (under 12 words).  
      4. Use engaging words that attract clicks without being clickbait.  
      5. Return the list in plain numbered format.
  `;

  const handleSubmit = async () => {
    const result = await callApi('/openai/generate-text', { prompt });
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

export default BlogTitles;
