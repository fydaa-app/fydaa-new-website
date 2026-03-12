'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import FormSubmittedSuccess from './successForm';

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    graduationYear: '',
    college: '',
    course: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue = value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.phoneNumber,
      graduationYear: formData.graduationYear,
      college: formData.college,
      course: formData.course,
      isStudent: true,
    };
    console.log('[ApplyForm] Submit triggered, payload:', payload);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL + 'referrals/website-lead';
      console.log('[ApplyForm] Sending to:', apiUrl);
      console.log('[ApplyForm] Body (stringified):', JSON.stringify(payload));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[ApplyForm] Response status:', response.status, response.statusText);

      const data = response.ok ? null : await response.json().catch(() => ({}));

      if (response.ok) {
        setShowSuccessModal(true);
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          graduationYear: '',
          college: '',
          course: '',
        });
      } else {
        // Extract message safely from error response
        let errorMsg = 'Something went wrong. Please try again.';

        if (data) {
          if (typeof data.message === 'string') {
            errorMsg = data.message;
          } else if (data.message && typeof data.message === 'object') {
            // If message is an object with nested structure
            const firstError = Array.isArray(data.message) ? data.message[0] : data.message;

            if (typeof firstError === 'string') {
              errorMsg = firstError;
            } else if (firstError && typeof firstError === 'object' && firstError.message) {
              errorMsg = firstError.message;
            }
          }
        }

        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setErrorMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (!showSuccessModal) return;
    const t = setTimeout(() => setShowSuccessModal(false), 3000);
    return () => clearTimeout(t);
  }, [showSuccessModal]);

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeSuccessModal}
          ></div>
          <div className="z-10 w-full max-w-xl">
            <FormSubmittedSuccess />
          </div>
        </div>
      )}

      <div id="apply-form" className={`bg-[#EFF9F6] py-12 px-4 md:px-8 ${showSuccessModal ? 'blur-sm' : ''}`}>
        <div className="bg-white rounded-xl shadow-md max-w-7xl mx-auto p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#001E3C] mb-3">
            Apply Now
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Take the first step towards a rewarding career in investment advisory. Fill out the form below to apply for the Fydaa Young Investment Advisor Program.
          </p>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Form Section */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">Your Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">
                  Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  min="1950"
                  max="2030"
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">College University <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#001E3C] mb-1">Course <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none py-1"
                  required
                />
              </div>
              {/* Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#19A86E] text-white px-6 py-2 rounded-full font-medium mt-4 hover:bg-[#159e65] transition"
                  disabled={isSubmitting}
                >
                  <Image
                    src="/carrers/Group17.png"
                    alt="Check Icon"
                    width={24}
                    height={24}
                  />
                  {isSubmitting ? 'Submitting...' : 'Get Register Now'}
                </button>
              </div>
            </form>

            <div className="relative">
  {/* Right Side Image */}
  <div className="hidden md:block relative">
    <Image
      src="/carrers/Group55.svg"
      alt="Apply Illustration"
      width={500}
      height={500}
      className="w-full h-auto"
    />

    {/* Get in touch section */}
<div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-[#EBF0FA] rounded-t-lg rounded-b-[40px] border border-gray-200 p-4 shadow-sm w-full max-w-md">
  <div className="flex items-center gap-4">
    {/* Get in touch text */}
    <span className="text-sm font-semibold text-[#001E3C]">Get in touch</span>

    {/* Divider Line */}
    <Image
      src="/carrers/Line.svg"
      alt="Divider Line"
      width={30}
      height={1}
      className="h-[1px] w-[30px]"
    />
  </div>

  {/* Call and Email Section */}
  <div className="flex flex-col gap-2 mt-4">
    {/* Call Section */}
    <div className="flex items-center gap-2">
      <Image src="/carrers/Group53.svg" alt="Call Icon" width={20} height={20} />
      <span className="text-sm font-bold text-[#001E3C]">
        Call on : <span className="font-normal">+91 9004501770</span>
      </span>
    </div>

    {/* Email Section */}
    <div className="flex items-center gap-2">
      <Image src="/carrers/Group54.svg" alt="Mail Icon" width={20} height={20} />
      <span className="text-sm font-bold text-[#001E3C]">
        Email : <a href="mailto:admissions@fydaa.com" className="font-normal text-[#001E3C] underline">admissions@fydaa.com</a>
      </span>
    </div>
  </div>
</div>
  </div>
</div>

          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 text-center mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );
}