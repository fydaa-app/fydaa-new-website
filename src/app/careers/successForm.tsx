import React from "react";

const FormSubmittedSuccess = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full border border-gray-200 text-center">
      <img
        src="/carrers/Group30.png"
        alt="Form submitted success"
        className="w-60 mx-auto mb-6"
      />

      <h2 className="text-2xl font-semibold text-gray-800">
        <span className="text-green-600 font-bold">Thank you!</span>{" "}
        Your form has been{" "}
        <span className="text-green-500 font-medium">successfully submitted.</span>
      </h2>

      <p className="mt-4 text-gray-600 text-base">
        One of our experts will get in touch with you shortly to assist you further.
      </p>
    </div>
  );
};

export default FormSubmittedSuccess;