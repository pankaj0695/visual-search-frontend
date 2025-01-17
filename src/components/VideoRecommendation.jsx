import React, { useState } from "react";
import axios from "axios";
import styles from "./VideoRecommendation.module.css";

function VideoRecommendation() {
  const [video, setVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null); // State for video preview
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      setPreviewVideo(URL.createObjectURL(file)); // Generate a preview URL for the uploaded video
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      console.error("No video selected");
      return;
    }

    // Extract the file extension
    const videoExtension = video.name.split(".").pop();

    try {
      // Step 1: Get the signed URL from the "s3url" route
      const s3UrlResponse = await axios.post(
        "http://127.0.0.1:8000/api/s3url/",
        {
          imgExtension: videoExtension,
        }
      );
      const { url } = s3UrlResponse.data;

      // Step 2: Upload the image to the S3 URL
      await axios.put(url, video, {
        headers: {
          "Content-Type": "multipart/form-data", // Use the correct content type
        },
      });

      // Step 3: Pass the uploaded image URL to the "brand-recommendation" API
      const response = await axios.post(
        "http://127.0.0.1:8000/api/video-query/",
        {
          videoUrl: url.split("?")[0], // Remove query params from the URL
          queryText: queryText,
        },
        {
          headers: {
            "Content-Type": "application/json", // Use the correct content type
          },
        }
      );

      // Update the results state with the response
      setResults(response.data);
    } catch (error) {
      console.error("Error in the process:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Video Recommendation</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Upload Video:
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className={styles.input}
          />
        </label>
        {previewVideo && (
          <div className={styles.previewContainer}>
            <video
              src={previewVideo}
              controls
              className={styles.previewVideo}
            ></video>
          </div>
        )}
        <label className={styles.label}>
          Query Text:
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      {results && (
        <div className={styles.results}>
          <h3 className={styles.resultsTitle}>Results:</h3>
          <ul className={styles.imageList}>
            {results.images.map((img, index) => (
              <li key={index} className={styles.imageItem}>
                <img src={img.image} alt={img.title} className={styles.image} />
                <p className={styles.imageTitle}>{img.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default VideoRecommendation;
