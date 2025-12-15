import React from 'react';


const Grievance = () => {
  const contacts = [
    {
      designation: 'Customer Care',
      name: 'Rinku Das',
      address: '903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063',
      phone: '9136935300',
      email: 'rinku.das@fydaa.com',
      hours: '10.00 A.M – 7.00 P.M',
    },
    {
      designation: 'Head of Customer Care',
      name: 'Rajat Tomar',
      address: '903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063',
      phone: '8077746386',
      email: 'rajat.tomar@fydaa.com',
      hours: '10.00 A.M – 7.00 P.M',
    },
    {
      designation: 'Compliance Officer',
      name: 'Kuntal Bhansali',
      address: '903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063',
      phone: '9930768002',
      email: 'kuntal@multistratocapital.com',
      hours: '10.00 A.M – 7.00 P.M',
    },
    {
      designation: 'CEO',
      name: 'Kuntal Bhansali',
      address: '903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063',
      phone: '9930768002',
      email: 'kuntal@multistratocapital.com',
      hours: '10.00 A.M – 7.00 P.M',
    },
    {
      designation: 'Principal Officer',
      name: 'Kuntal Bhansali',
      address: '903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063',
      phone: '9930768002',
      email: 'kuntal@multistratocapital.com',
      hours: '10.00 A.M – 7.00 P.M',
    },
  ];

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-6 mt-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold text-white mb-4">Grievance Redressal</h2>
            <p className="text-blue-200 text-lg max-w-3xl mx-auto">
              We&apos;re here to help resolve your concerns. Reach out to our dedicated team through any of the channels below.
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">{contact.designation}</h2>
                  <p className="text-blue-100 mt-1">{contact.name}</p>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{contact.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contact.phone}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {contact.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contact.email}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {contact.email}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{contact.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 py-10 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 text-lg">
              For immediate assistance, please contact our Customer Care team. We aim to respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>
      </div>
 
    </>
  );
};

export default Grievance;