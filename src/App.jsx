import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ClothRecommendation from "./components/ClothRecommendation";
import VideoRecommendation from "./components/VideoRecommendation";
import ProductRecommendation from "./components/ProductRecommendation";
import Reviews from "./components/Reviews";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cloth-recommendation"
            element={<ClothRecommendation />}
          />
          <Route
            path="/video-recommendation"
            element={<VideoRecommendation />}
          />
          <Route
            path="/product-recommendation"
            element={<ProductRecommendation />}
          />
          <Route
            path="/Reviews"
            element={<Reviews />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
