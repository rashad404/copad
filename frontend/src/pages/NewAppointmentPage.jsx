import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../api";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useTranslation } from "react-i18next";

const specialtyOptions = [
  { value: "General", label: "General Consultation" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Mental Health", label: "Mental Health" },
  { value: "Other", label: "Other Specialty" },
];

export default function NewAppointmentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    specialty: "",
    primaryConcern: "",
    symptoms: "",
    duration: "",
    severity: "Mild",
    treatmentsTried: "",
    notes: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createAppointment(form);
      navigate(`/appointments/${res.data.id}/chat`);
    } catch (err) {
      setIsSubmitting(false);
      console.error("Failed to create appointment", err);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return !!form.specialty && !!form.primaryConcern;
    }
    return true;
  };

  // Progress percentage based on current step
  const progressPercentage = ((step - 1) / 1) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { to: "/appointments", label: t("navbar.appointments") },
            { label: t("appointments.newAppointment") }
          ]} 
        />
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
          {/* Header */}
          <div className="border-b border-gray-200 bg-indigo-50 px-6 py-4">
            <h1 className="text-xl font-bold text-indigo-800">{t("newAppointment.title")}</h1>
            <p className="text-sm text-indigo-600 mt-1">
              {t("newAppointment.subtitle")}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 h-2">
            <div 
              className="bg-indigo-600 h-2 transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("newAppointment.specialty.label")} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specialtyOptions.map(option => (
                      <div 
                        key={option.value}
                        onClick={() => setForm({...form, specialty: option.value})}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors
                          ${form.specialty === option.value 
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                            : 'hover:bg-gray-50 border-gray-200'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
                          ${form.specialty === option.value ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                          {option.value.charAt(0)}
                        </div>
                        <span className={`text-sm font-medium ${form.specialty === option.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {t(`newAppointment.specialty.options.${option.value.toLowerCase()}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="primaryConcern" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("newAppointment.primaryConcern.label")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="primaryConcern"
                    name="primaryConcern"
                    rows="3"
                    required
                    placeholder={t("newAppointment.primaryConcern.placeholder")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.primaryConcern}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors
                      ${isStepValid() 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {t("newAppointment.continue")}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("newAppointment.duration.label")}
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      type="text"
                      placeholder={t("newAppointment.duration.placeholder")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                      {t("newAppointment.severity.label")}
                    </label>
                    <select
                      id="severity"
                      name="severity"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.severity}
                      onChange={handleChange}
                    >
                      <option value="Mild">{t("newAppointment.severity.options.mild")}</option>
                      <option value="Moderate">{t("newAppointment.severity.options.moderate")}</option>
                      <option value="Severe">{t("newAppointment.severity.options.severe")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("newAppointment.symptoms.label")}
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    rows="2"
                    placeholder={t("newAppointment.symptoms.placeholder")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.symptoms}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="treatmentsTried" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("newAppointment.treatments.label")}
                  </label>
                  <textarea
                    id="treatmentsTried"
                    name="treatmentsTried"
                    rows="2"
                    placeholder={t("newAppointment.treatments.placeholder")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.treatmentsTried}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("newAppointment.notes.label")}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="2"
                    placeholder={t("newAppointment.notes.placeholder")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t("newAppointment.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("newAppointment.submitting")}
                      </>
                    ) : t("newAppointment.submit")}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Helpful tips */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tips for a better consultation:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="text-indigo-500 font-bold mr-1">•</span>
                Be specific about your symptoms and when they started
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 font-bold mr-1">•</span>
                Mention any previous medical history that might be relevant
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 font-bold mr-1">•</span>
                List any medications you're currently taking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}