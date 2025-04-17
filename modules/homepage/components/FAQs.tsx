import React, { useState } from 'react';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How do I get started with the academic system?",
      answer: "Getting started is easy! Simply sign up using the 'Sign up as Teacher' or 'Sign up as Student' button. After registering, you'll receive login credentials to access your personalized dashboard where you can manage courses, schedules, and more."
    },
    {
      question: "What are the pricing options for institutions?",
      answer: "We offer flexible pricing plans based on the size of your institution and features needed. Options include Basic (free trial), Standard (for small institutions), and Premium (for large institutions with advanced features). Contact us for a custom quote tailored to your specific requirements."
    },
    {
      question: "How does this system differ from other academic management platforms?",
      answer: "Our system stands out with its comprehensive automation features, intuitive user interface, and seamless integration capabilities. We offer specialized tools for exam scheduling, automatic seating arrangements, and conflict-free timetable generation that many other platforms lack."
    },
    {
      question: "Is there technical support available for users?",
      answer: "Yes, we provide dedicated technical support for all users. Teachers and administrators have access to priority support channels, while students can reach our support team via email or the help center within the platform. Support is available Monday to Friday from 9AM to 6PM."
    },
    {
      question: "Can I integrate this platform with existing school management systems?",
      answer: "Absolutely! Our academic system features robust API integration capabilities that allow seamless connection with most existing school management systems, student information systems (SIS), and learning management systems (LMS). Our technical team can assist with custom integration needs."
    }
  ];

  return (
    <div className="w-full bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Everything about the academic system is online, with features and support tailored to your institution's needs.
            Need some pointers? Our support team is available Monday to Friday.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-6 px-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-blue-500 transform ${openIndex === index ? 'rotate-45' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
              <div 
                className={`px-4 pb-6 ${openIndex === index ? 'block' : 'hidden'}`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-500 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="mb-6">Contact us for more information.</p>
          <a 
            href="#" 
            className="inline-flex items-center border border-white rounded-full px-6 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Contact
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}