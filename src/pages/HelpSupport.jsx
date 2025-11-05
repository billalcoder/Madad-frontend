import React from "react";

export default function HelpSupport() {
  const supportEmail = "support@example.com"; // change this to your real email

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
    console.log("User clicked to send email to:", supportEmail);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-3">Help & Support</h1>
        <p className="text-gray-600 mb-6">
          Need assistance? We're here to help you.  
          Please reach out to us anytime via email.
        </p>

        <button
          onClick={handleEmailClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
        >
          📧 Contact Us at {supportEmail}
        </button>

        <p className="text-gray-400 text-sm mt-6">
          We usually respond within 24 hours.
        </p>
      </div>
    </div>
  );
}
