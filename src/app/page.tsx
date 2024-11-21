"use client";
import React, { useState } from "react";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ResponseData {
  alphabets?: string[];
  numbers?: string[];
  highest_lowercase_alphabet?: string;
}

const Home: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { name: "Alphabets", id: "Alphabets" },
    { name: "Numbers", id: "Numbers" },
    { name: "Highest lowercase alphabet", id: "Highest lowercase alphabet" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(input);
      const res = await axios.post<ResponseData>(`${backendUrl}/bfhl`, data);
      setResponse(res.data);
      setError("");
    } catch (error) {
      setError("Invalid JSON input");
    }
  };

  const handleSelect = (selectedList: { id: string }[]) => {
    const selectedIds = selectedList.map((item) => item.id);
    setSelectedOptions(selectedIds);
  };

  const handleRemove = (removedList: { id: string }[]) => {
    const selectedIds = removedList.map((item) => item.id);
    setSelectedOptions(selectedIds);
  };

  return (
    <div className="container mx-auto p-4 pt-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">JSON Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-400 rounded mb-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter JSON input"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      {response && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Select Options</h2>
          <Multiselect
            options={options}
            displayValue="name"
            selectedValues={selectedOptions.map((id) =>
              options.find((option) => option.id === id)
            )}
            onSelect={handleSelect}
            onRemove={handleRemove}
            placeholder="Select Options"
            className="w-full mb-4"
            style={{
              chips: { background: "blue", color: "white" },
              searchBox: { border: "1px solid gray", borderRadius: "4px" },
            }}
          />
          <h2 className="text-2xl font-bold mt-10 mb-4">Response</h2>
          <div className="bg-gray-200 p-4 rounded">
            {selectedOptions.includes("Alphabets") && response.alphabets && (
              <p>Alphabets: {response.alphabets.join(", ")}</p>
            )}
            {selectedOptions.includes("Numbers") && response.numbers && (
              <p>Numbers: {response.numbers.join(", ")}</p>
            )}
            {selectedOptions.includes("Highest lowercase alphabet") &&
              response.highest_lowercase_alphabet && (
                <p>
                  Highest lowercase alphabet:{" "}
                  {response.highest_lowercase_alphabet}
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
