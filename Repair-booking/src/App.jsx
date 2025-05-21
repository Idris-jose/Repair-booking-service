import { MapPin, Car, Wrench, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { setupWorker } from 'msw/browser';
import { handlers, repairServices } from './Handler.js';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner.jsx';
export const worker = setupWorker(...handlers);



function App() {
  // State variables for car type, repair service, and selected station
  const [carType, setCarType] = useState('none');
  const [repairService, setRepairService] = useState('none');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notes, setNotes] = useState('');

  // State variables for error and success messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Loading states
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Find the selected service based on repairService ID
  const selectedService = repairServices.find(
    (service) => service.id === parseInt(repairService)
  );

  // Effect for loading stations after selecting car type and repair service
  useEffect(() => {
    if (carType !== 'none' && repairService !== 'none') {
      setLoadingStations(true);
      setSelectedStation(null);
      setSelectedTimeSlot(null);
      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoadingStations(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setLoadingStations(false);
    }
    // eslint-disable-next-line
  }, [carType, repairService]);

  // Effect for loading time slots after selecting a station
  useEffect(() => {
    if (selectedStation !== null) {
      setLoadingTimeSlots(true);
      setSelectedTimeSlot(null);
      const timer = setTimeout(() => {
        setLoadingTimeSlots(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeSlots(false);
    }
    // eslint-disable-next-line
  }, [selectedStation]);

  const handleSubmit = () => {
    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validation
    if (
      carType === 'none' ||
      repairService === 'none' ||
      selectedStation === null ||
      selectedTimeSlot === null
    ) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    // All validations passed
    setSuccess('Appointment booked successfully!');
    toast.success('Appointment booked successfully!');
  };

  return (
    <div className="min-h-screen mx-2 sm:mx-6 md:mx-16 lg:mx-32 xl:mx-60 my-4">
      <Toaster position="top-right" />
      <h1 className="font-bold text-2xl text-blue-600">Repair Booking</h1>

      {/* Status messages */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
          role="alert"
        >
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4"
          role="alert"
        >
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <p>{success}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-4 gap-4">
        {/* Car type selection */}
        <div className="flex flex-col gap-1">
          <h1 className="font-medium flex items-center gap-2">
            <Car className="text-blue-600" size={20} />
            Car type
          </h1>
          <label htmlFor="carType">Select a car type</label>
          <select
            className="bg-gray-100 p-2 rounded-md"
            name="carType"
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option value="none" disabled>
              Select a car type
            </option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="hatchback">Hatchback</option>
            <option value="convertible">Convertible</option>
            <option value="coupe">Coupe</option>
            <option value="wagon">Wagon</option>
            <option value="sports">Sports</option>
            <option value="luxury">Luxury</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Repair service selection */}
        <div className="mt-2 flex flex-col gap-1">
          <h1 className="font-medium flex items-center gap-2">
            <Wrench className="text-blue-600" size={20} />
            Repair service
          </h1>
          <label htmlFor="repairService">Select a repair service</label>
          <select
            className="bg-gray-100 p-2 rounded-md"
            name="repairService"
            id="repairService"
            value={repairService}
            onChange={(e) => {
              setRepairService(e.target.value);
              setSelectedStation(null); // Reset station when service changes
              setSelectedTimeSlot(null); // Reset time slot when service changes
            }}
          >
            <option value="none" disabled>
              Select a repair service
            </option>
            {repairServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Rendering to show the stations when the user picks a repair and car type */}
        {repairService !== 'none' && carType !== 'none' && selectedService ? (
          <>
            {/* Loading for stations */}
            {loadingStations ? (
              <LoadingSpinner />
            ) : (
              <motion.div
                className="mt-2 flex flex-col gap-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-medium">Nearby stations</h1>
                {selectedService.stations.length > 0 ? (
                  selectedService.stations.map((station, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`bg-gray-100 flex gap-2 items-center p-2 rounded-md border-2 transition-colors ${
                        selectedStation === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-transparent'
                      }`}
                      onClick={() => {
                        setSelectedStation(index);
                        setSelectedTimeSlot(null); // Reset time slot when station changes
                      }}
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                        <MapPin className="text-blue-600" />
                      </div>
                      <div className="flex flex-col text-left">
                        <h2 className="font-medium">{station.name}</h2>
                        <div className="flex gap-1">
                          <p className="text-gray-500">{station.distance}</p>
                          <p className="text-gray-500">|</p>
                          <p className="text-gray-500">
                            {station.star} <span className="text-yellow-500">★</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No stations available for this service.</p>
                )}
              </motion.div>
            )}

            {/* Time slot selection */}
            {selectedStation !== null &&
              selectedService.stations[selectedStation]?.timeSlots.length > 0 && (
                loadingTimeSlots ? (
                  <LoadingSpinner />
                ) : (
                  <motion.div
                    className="mt-2 flex flex-col gap-1"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="font-medium">Select a time slot</h1>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedService.stations[selectedStation].timeSlots.map(
                        (slot, index) => (
                          <button
                            type="button"
                            key={index}
                            className={`bg-gray-100 flex items-center justify-center p-2 rounded-md border-2 transition-colors ${
                              !slot.available
                                ? 'border-red-600 ring-2 ring-red-200 opacity-50 cursor-not-allowed'
                                : selectedTimeSlot === index
                                ? 'border-green-600 ring-2 ring-green-200'
                                : 'border-transparent'
                            }`}
                            disabled={!slot.available}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedTimeSlot(index);
                              }
                            }}
                          >
                            {slot.time}
                          </button>
                        )
                      )}
                    </div>
                  </motion.div>
                )
              )}
          </>
        ) : null}

        {/* Additional notes */}
        <div className="mt-2 flex flex-col gap-1">
          <h1 className="font-medium">Additional notes</h1>
          <textarea
            className="bg-gray-100 p-2 rounded-md"
            rows="4"
            placeholder="Enter any additional notes or requests here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default App;