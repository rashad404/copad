import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { Save, User, AlertCircle, Loader, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    medicalProfile: {
      height: "",
      weight: "",
      conditions: "",
      allergies: "",
      medications: "",
      lifestyle: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(res => {
        const data = res.data;
      
        // Fix: if no medicalProfile, initialize it
        if (!data.medicalProfile) {
          data.medicalProfile = {
            height: "",
            weight: "",
            conditions: "",
            allergies: "",
            medications: "",
            lifestyle: ""
          };
        }
      
        setProfile(data);
        setLoading(false);
      });
      
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleMedicalChange = e => {
    setProfile({
      ...profile,
      medicalProfile: {
        ...profile.medicalProfile,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put("http://localhost:8080/api/profile", profile, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Profile" }]} />
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
          {/* Header section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Your Profile</h1>
                <p className="mt-1 text-indigo-100">Manage your personal and medical information</p>
              </div>
              <button
                type="submit"
                form="profile-form"
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading your profile...</span>
              </div>
            ) : (
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2 text-indigo-600" size={20} />
                    Personal Information
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                          name="name" 
                          value={profile.name} 
                          onChange={handleChange} 
                          placeholder="Enter your full name" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                          name="email" 
                          value={profile.email} 
                          onChange={handleChange} 
                          placeholder="Enter your email" 
                          type="email" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input 
                          name="age" 
                          value={profile.age} 
                          onChange={handleChange} 
                          placeholder="Enter your age" 
                          type="number" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                          name="gender" 
                          value={profile.gender} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="mr-2 text-indigo-600" size={20} />
                    Medical Information
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                        <input 
                          name="height" 
                          value={profile.medicalProfile.height} 
                          onChange={handleMedicalChange} 
                          placeholder="Enter your height" 
                          type="number" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input 
                          name="weight" 
                          value={profile.medicalProfile.weight} 
                          onChange={handleMedicalChange} 
                          placeholder="Enter your weight" 
                          type="number" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                        <textarea 
                          name="conditions" 
                          value={profile.medicalProfile.conditions} 
                          onChange={handleMedicalChange} 
                          placeholder="List any medical conditions" 
                          rows="2" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                        <textarea 
                          name="allergies" 
                          value={profile.medicalProfile.allergies} 
                          onChange={handleMedicalChange} 
                          placeholder="List any allergies" 
                          rows="2" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                        <textarea 
                          name="medications" 
                          value={profile.medicalProfile.medications} 
                          onChange={handleMedicalChange} 
                          placeholder="List any current medications" 
                          rows="2" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle</label>
                        <textarea 
                          name="lifestyle" 
                          value={profile.medicalProfile.lifestyle} 
                          onChange={handleMedicalChange} 
                          placeholder="Describe your lifestyle (e.g., exercise, smoking, alcohol)" 
                          rows="2" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button (mobile version) */}
                <div className="sm:hidden">
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Success notification */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <CheckCircle className="mr-2" size={18} />
          Profile saved successfully!
        </div>
      )}
    </div>
  );
}