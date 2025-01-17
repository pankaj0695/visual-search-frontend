import React, { useState } from "react";
import axios from "axios";
import styles from "./ClothRecommendation.module.css";

function ClothRecommendation() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // State to store the preview image URL
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Generate a preview URL for the uploaded image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      console.error("No image selected");
      return;
    }

    // Extract the file extension
    const imageExtension = image.name.split(".").pop();

    try {
      // Step 1: Get the signed URL from the "s3url" route
      const s3UrlResponse = await axios.post(
        "http://127.0.0.1:8000/api/s3url/",
        {
          imgExtension: imageExtension,
        }
      );
      const { url } = s3UrlResponse.data;

      // Step 2: Upload the image to the S3 URL
      await axios.put(url, image, {
        headers: {
          "Content-Type": "multipart/form-data", // Use the correct content type
        },
      });

      // Step 3: Pass the uploaded image URL to the "brand-recommendation" API
      const brandResponse = await axios.post(
        "http://127.0.0.1:8000/api/brand-recommendation/",
        {
          imageUrl: url.split("?")[0], // Remove query params from the URL
          queryText: queryText,
        },
        {
          headers: {
            "Content-Type": "application/json", // Use the correct content type
          },
        }
      );

      // Update the results state with the response
      setResults(brandResponse.data);
    } catch (error) {
      console.error("Error in the process:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cloth Recommendation</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
        </label>
        {previewImage && (
          <div className={styles.previewContainer}>
            <img
              src={previewImage}
              alt="Uploaded Preview"
              className={styles.previewImage}
            />
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
          <p className={styles.brand}>
            Predicted Brand: {results.predicted_brand}
          </p>
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

export default ClothRecommendation;
