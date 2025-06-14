'use client';

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/api";
import { Save, User, AlertCircle, Loader, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

interface MedicalProfile {
  height: string;
  weight: string;
  conditions: string;
  allergies: string;
  medications: string;
  lifestyle: string;
}

interface Profile {
  name: string;
  email: string;
  age: string;
  gender: string;
  medicalProfile: MedicalProfile;
}

const normalizeProfile = (data: any): Profile => ({
  ...data,
  name: data.name ?? "",
  email: data.email ?? "",
  age: data.age ?? "",
  gender: data.gender ?? "",
  medicalProfile: {
    height: data.medicalProfile?.height ?? "",
    weight: data.medicalProfile?.weight ?? "",
    conditions: data.medicalProfile?.conditions ?? "",
    allergies: data.medicalProfile?.allergies ?? "",
    medications: data.medicalProfile?.medications ?? "",
    lifestyle: data.medicalProfile?.lifestyle ?? "",
  }
});

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile>({
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const data = res.data;
        setProfile(normalizeProfile(data));
      } catch (err) {
        console.error("Profile API error", err);
        setError(t("profile.errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      medicalProfile: {
        ...profile.medicalProfile,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving profile", err);
      setError(t("profile.errorSaving"));
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: t("navbar.profile") }]} />
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mt-6">
          {/* Header section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t("profile.title")}</h1>
                <p className="mt-1 text-indigo-100">{t("profile.subtitle")}</p>
              </div>
              <button
                type="submit"
                form="profile-form"
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors"
              >
                <Save size={18} />
                {t("profile.saveChanges")}
              </button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">{t("profile.loading")}</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-12">
                <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
                <span className="text-red-600 dark:text-red-400">{error}</span>
              </div>
            ) : (
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <User className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                    {t("profile.personalInfo.title")}
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.personalInfo.fullName")}</label>
                        <input 
                          name="name" 
                          value={profile.name} 
                          onChange={handleChange} 
                          placeholder={t("profile.personalInfo.fullNamePlaceholder")}
                          required 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.personalInfo.email")}</label>
                        <input 
                          name="email" 
                          value={profile.email} 
                          onChange={handleChange} 
                          placeholder={t("profile.personalInfo.emailPlaceholder")}
                          type="email" 
                          required 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.personalInfo.age")}</label>
                        <input 
                          name="age" 
                          value={profile.age} 
                          onChange={handleChange} 
                          placeholder={t("profile.personalInfo.agePlaceholder")}
                          type="number" 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.personalInfo.gender")}</label>
                        <select 
                          name="gender" 
                          value={profile.gender} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-white"
                        >
                          <option value="">{t("profile.personalInfo.genderPlaceholder")}</option>
                          <option value="male">{t("profile.personalInfo.genderOptions.male")}</option>
                          <option value="female">{t("profile.personalInfo.genderOptions.female")}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <AlertCircle className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                    {t("profile.medicalInfo.title")}
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.height")}</label>
                        <input 
                          name="height" 
                          value={profile.medicalProfile.height} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.heightPlaceholder")}
                          type="number" 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.weight")}</label>
                        <input 
                          name="weight" 
                          value={profile.medicalProfile.weight} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.weightPlaceholder")}
                          type="number" 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.conditions")}</label>
                        <textarea 
                          name="conditions" 
                          value={profile.medicalProfile.conditions} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.conditionsPlaceholder")}
                          rows={2} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.allergies")}</label>
                        <textarea 
                          name="allergies" 
                          value={profile.medicalProfile.allergies} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.allergiesPlaceholder")}
                          rows={2} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.medications")}</label>
                        <textarea 
                          name="medications" 
                          value={profile.medicalProfile.medications} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.medicationsPlaceholder")}
                          rows={2} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("profile.medicalInfo.lifestyle")}</label>
                        <textarea 
                          name="lifestyle" 
                          value={profile.medicalProfile.lifestyle} 
                          onChange={handleMedicalChange} 
                          placeholder={t("profile.medicalInfo.lifestylePlaceholder")}
                          rows={2} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-gray-800 dark:text-white" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button (mobile version) */}
                <div className="sm:hidden">
                  <button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Save size={18} />
                    {t("profile.saveChanges")}
                  </button>
                </div>

                {/* Success message */}
                {saved && (
                  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <CheckCircle size={18} />
                    {t("profile.saved")}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
    </ProtectedRoute>
  );
}