"use client";

import React, { useState } from "react";

const SSEStreamComponent = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const startSSE = () => {
    setQuestions([]);
    setLoading(true);

    let buffer = "";

    const eventSource = new EventSource("/api/suggest-message");

    eventSource.onmessage = (event) => {
      const char: string = event.data;
        buffer += char;

        if (buffer.endsWith("||")) {
          // Finalize the previous question
          setQuestions((prev) => [...prev, ""]);
          buffer = "";
        } else {
          // Update the last question
          setQuestions((prev) => {
            if (prev.length === 0) return [char];
            const updated = [...prev];
            if (char === "|") return updated;
            updated[updated.length - 1] += char;
            return updated;
          });
      }
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setLoading(false);
    });

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={startSSE}
        disabled={loading}
      >
        {loading ? "Streaming..." : "Start SSE Stream"}
      </button>

      <ul className="bg-gray-100 p-4 rounded list-disc list-inside space-y-2 min-h-[100px]">
        {questions.map((q, idx) => (
          <li key={idx} className="animate-pulse">
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SSEStreamComponent;
