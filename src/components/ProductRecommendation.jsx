import React, { useState } from "react";
import axios from "axios";
import styles from "./ProductRecommendation.module.css";

function ProductRecommendation() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // State for image preview
  const [productName, setProductName] = useState("");
  const [results, setResults] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
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
          "Content-Type": "multipart/form-data",
        },
      });

      // Step 3: Pass the uploaded image URL to the "brand-recommendation" API
      const response = await axios.post(
        "http://127.0.0.1:8000/api/multiproduct/",
        {
          imageUrl: url.split("?")[0], // Remove query params from the URL
          objectName: productName,
        },
        {
          headers: {
            "Content-Type": "application/json",
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
      <h2 className={styles.title}>Product Recommendation</h2>
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
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
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
          <ul className={styles.productList}>
            {results.products.map((product, index) => (
              <li key={index} className={styles.productItem}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.productImage}
                />
                <p className={styles.productTitle}>{product.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductRecommendation;
