import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Visual Search System</h1>
      <p className={styles.description}>
        Welcome to the Visual Search App. Explore the following features:
      </p>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => navigate("/cloth-recommendation")}
        >
          Recommendation for Clothes
        </button>
        <button
          className={styles.button}
          onClick={() => navigate("/video-recommendation")}
        >
          Recommendation using Video
        </button>
        <button
          className={styles.button}
          onClick={() => navigate("/product-recommendation")}
        >
          Recommendation for Products
        </button>
        <button
          className={styles.button}
          onClick={() => navigate("/Reviews")}
        >
          Reviews
        </button>
      </div>
    </div>
  );
}

export default Home;
