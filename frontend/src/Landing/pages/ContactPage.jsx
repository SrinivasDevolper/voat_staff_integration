import React, { useState, useEffect } from "react";

const InputField = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div>
    <label className="block mb-1 font-semibold text-blue-800" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-md focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-blue-400 transition-all duration-300 hover:border-blue-300"
    />
  </div>
);

const TextAreaField = ({ name, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <label className="block mb-1 font-semibold text-blue-800" htmlFor={name}>
      Message
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 rounded-md focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-blue-400 transition-all duration-300 resize-none hover:border-blue-300"
    />
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitted(false);

    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setError("All fields are required!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div className="py-5 sm:py-12 px-4 sm:px-6 flex flex-col items-center min-h-0 md:min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900">
        Contact <span className="text-blue-600">Us</span>
      </h1>

      <div className="w-full max-w-screen-2xl p-1 sm:p-6 md:p-8 lg:p-5 rounded-xl sm:rounded-2xl grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <InputField
            label="Name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextAreaField
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 sm:py-3 rounded-md text-white font-semibold transition-all duration-300
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Submit"
            )}
          </button>

          {error && (
            <p className="text-red-600 text-sm sm:text-base font-semibold">{error}</p>
          )}

          {isSubmitted && !error && (
            <p className="text-green-600 text-sm sm:text-base font-semibold">Submitted successfully!</p>
          )}
        </form>

        {/* Map only visible on md and above screens */}
        <div className="hidden md:block rounded-xl lg:rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: "300px" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3309788625803!2d78.37717691466714!3d17.445604788030075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91693eb085dd%3A0x4edc387e6d7369d!2sMadhapur%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1617819348333!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;