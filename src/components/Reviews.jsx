import React, { useState } from "react";
import"./Reviews.css";

function Reviews() {
  const [url, setUrl] = useState("");
  const [parseDescription, setParseDescription] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setParsedResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/parse-website/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, parse_description: parseDescription }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setParsedResult(data.parsed_result || "No result found");
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Website Scraping and Parsing</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Website URL</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            required
          />
        </div>
        <div>
          <label htmlFor="parseDescription">Parse Description</label>
          <textarea
            id="parseDescription"
            value={parseDescription}
            onChange={(e) => setParseDescription(e.target.value)}
            placeholder="Describe the content you want to extract"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {parsedResult && (
        <div>
          <h2>Parsed Result:</h2>
          <pre>{parsedResult}</pre>
        </div>
      )}
    </div>
  );
}

export default Reviews;
