import React, { useState } from "react";
import { AiToolsData } from "../../assets/assets";
import { Sparkles } from "lucide-react";
import useApi from "../../hooks/useApi";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const { loading, data, callApi } = useApi();
  const aiTool = AiToolsData[4];

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pdf", input);
    const result = await callApi("/openai/resume-review", formData);
    if (result) {
      setInput("");
    }
  };

  return (
    <div className="gap-4 p-4 grid sm:grid-cols-2">
      {/* Left Create Form */}
      <form className="card !px-5 flex-1 space-y-5" onSubmit={handleSubmitForm}>
        <div className="flex gap-2 items-center">
          <Sparkles className={`w-6 h-6`} style={{ color: aiTool.bg.from }} />
          <p className="font-medium">{aiTool.title}</p>
        </div>
        <div>
          <label htmlFor="ai-pdf-preview" className="font-medium text-sm">
            Upload Resume
          </label>
          <input
            name="ai-pdf-preview"
            id="ai-pdf-preview"
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
            accept="application/pdf"
            className="w-full text-sm p-2 px-5 rounded-lg border outline-none"
            style={{ borderColor: aiTool.bg.from }}
          />
          <small>Supports PDF resume only.</small>
        </div>

        <button
          style={{
            background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to})`,
          }}
          className="py-2 mt-8 hover:opacity-85 flex text-white rounded-full items-center justify-center gap-2 !text-sm w-full">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full border-t-2 border-blue-1 border-solid h-5 w-5"></div>
            </div>
          ) : (
            <aiTool.Icon className="w-4 h-4" />
          )}
          {aiTool.title}
        </button>
      </form>

      {/* Right Generate Content */}
      <div className="card !px-5 flex-1">
        <div className="flex gap-2 items-center">
          <aiTool.Icon
            className="lucide lucide-square-pen w-7 h-7 p-1 text-white rounded-xl"
            style={{
              background: `linear-gradient(to bottom, ${aiTool.bg.from}, ${aiTool.bg.to}`,
            }}
          />
          <p className="font-medium">{aiTool.title}</p>
        </div>
        <div className="min-h-[300px] h-full text-center flex items-center justify-center flex-col">
          {data ? (
            <pre>{data}</pre>
          ) : (
            <>
              <aiTool.Icon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <small className="text-gray-400">
                Enter a topic and click “{aiTool.title}” to get started
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
