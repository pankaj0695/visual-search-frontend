// Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <a href="/">
          <div className={styles.logo}>VS</div>
        </a>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/cloth-recommendation" className={styles.link}>
              Cloth Recommendation
            </Link>
          </li>
          <li>
            <Link to="/video-recommendation" className={styles.link}>
              Video Recommendation
            </Link>
          </li>
          <li>
            <Link to="/product-recommendation" className={styles.link}>
              Product Recommendation
            </Link>
          </li>
        </ul>
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
