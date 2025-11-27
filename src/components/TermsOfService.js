import React from "react";

const TermsOfService = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <p>
        Welcome to FloodPrediction. By accessing or using our website or
        services, you agree to the following Terms of Service.
      </p>

      <h2>Use of the Service</h2>
      <p>You agree to use our website responsibly and legally. You must not:</p>
      <ul>
        <li>Misuse or manipulate prediction data</li>
        <li>Attempt to access restricted systems</li>
        <li>Use the service for harmful or illegal activities</li>
      </ul>

      <h2>Account Requirements</h2>
      <p>
        To use certain features, you must authenticate using Google OAuth. You
        are responsible for maintaining the security of your account.
      </p>

      <h2>Prediction Disclaimer</h2>
      <p>
        FloodPrediction provides predictions based on available data and models.
        These predictions are for informational purposes only. We do not
        guarantee accuracy, and we are not responsible for damages resulting
        from reliance on our predictions.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content, branding, and code on FloodPrediction is the property of
        the developer and may not be copied or reproduced without permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        We are not liable for any direct or indirect damages caused by the use
        of our service, including inaccurate predictions.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms of Service at any time. Updated versions will
        be posted on this page.
      </p>

      <h2>Contact Us</h2>
      <p>If you have questions about these terms, contact us at:</p>
      <p>
        <strong>yashrajdhamale15@gmail.com</strong>
      </p>
    </div>
  );
};

export default TermsOfService;
