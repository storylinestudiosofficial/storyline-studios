import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [packageSelected, setPackageSelected] = useState(null);
  const [upsells, setUpsells] = useState([]);
  const [receiptFile, setReceiptFile] = useState(null);

  // Fetch blocked dates
  React.useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setBlockedDates);
  }, []);

  const packages = [
    { type: 'A', price: 2399, inclusions: ['4hrs coverage', '30 edited photos', '1min highlight reel'] },
    { type: 'B', price: 4000, inclusions: ['6hrs coverage', '50 edited photos', '2min highlight reel'] },
    { type: 'C', price: 6000, inclusions: ['8hrs coverage', '100 edited photos', '5min highlight reel'] },
    { type: 'D', price: 7999, inclusions: ['12hrs coverage', '200 edited photos', '10min highlight reel'] }
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitBooking = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('bookingData', JSON.stringify({
      ...formData,
      package: packageSelected,
      upsells,
      event: { ...formData.event, date: selectedDate }
    }));
    if (receiptFile) formDataToSend.append('receipt', receiptFile);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      body: formDataToSend
    });
    
    if (res.ok) {
      navigate('/portal');
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Booking Flow - Step {step}/5
        </h1>
        <div className="flex justify-center space-x-4 text-sm">
          {['Client Info', 'Event Details', 'Date', 'Package', 'Payment'].map((label, idx) => (
            <div key={idx} className={`flex items-center ${idx < step ? 'text-cyan-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                idx < step ? 'bg-cyan-500' : 'bg-gray-700'
              }`}>
                {idx + 1}
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <ClientInfoForm formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <EventDetailsForm formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <DatePicker 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
          blockedDates={blockedDates}
          nextStep={nextStep} 
          prevStep={prevStep}
        />
      )}
      {step === 4 && (
        <PackageSelection 
          packages={packages}
          packageSelected={packageSelected}
          setPackageSelected={setPackageSelected}
          upsells={upsells}
          setUpsells={setUpsells}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 5 && (
        <PaymentStep 
          packageSelected={packageSelected}
          upsells={upsells}
          receiptFile={receiptFile}
          setReceiptFile={setReceiptFile}
          submitBooking={submitBooking}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

// Individual Step Components (abbreviated for brevity)
const ClientInfoForm = ({ formData, setFormData, nextStep }) => (
  <form className="max-w-2xl mx-auto space-y-6">
    <input
      type="text"
      placeholder="Full Name"
      className="w-full p-4 bg-black/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
      onChange={(e) => setFormData({...formData, name: e.target.value})}
    />
    {/* Email, Phone, Location inputs */}
    <button
      type="button"
      onClick={nextStep}
      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-4 rounded-xl font-semibold mt-8"
    >
      Next: Event Details
    </button>
  </form>
);

// Similar structure for other steps...

export default BookingFlow;
