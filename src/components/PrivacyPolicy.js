import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <p>
        FloodPrediction (“we”, “our”, “us”) is committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, and protect
        your information when you use our website and services.
      </p>

      <h2>Information We Collect</h2>
      <p>We only collect the following information through Google OAuth:</p>
      <ul>
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your Google profile picture (optional)</li>
      </ul>

      <p>
        We do <strong>not</strong> collect passwords, phone numbers, or any
        sensitive personal information.
      </p>

      <h2>How We Use Your Information</h2>
      <p>Your information is used only for:</p>
      <ul>
        <li>User authentication</li>
        <li>Providing personalized predictions or features</li>
        <li>Improving the user experience</li>
      </ul>

      <h2>Data Storage & Security</h2>
      <p>
        Your information is stored securely on our servers. We do not share,
        sell, or transfer your data to any third party.
      </p>

      <h2>Third-Party Services</h2>
      <p>We use Google OAuth for login and authentication.</p>

      <h2>Your Rights</h2>
      <p>You may request deletion of your account or data at any time by emailing:</p>
      <p>
        <strong>yashrajdhamale15@gmail.com</strong>
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Updated versions will
        always be available on this page.
      </p>

      <h2>Contact Us</h2>
      <p>If you have any questions, you can contact us at:</p>
      <p>
        <strong>yashrajdhamale15@gmail.com</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
