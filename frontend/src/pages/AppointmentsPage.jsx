import { useEffect, useState } from "react";
import { getAppointments, createAppointment } from "../api";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, Plus, Loader, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getAppointments()
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Failed to load appointments:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = () => {
    navigate("/appointments/new");
  };

  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments.filter(appt => appt.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: t("navbar.appointments") }]} />
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
          {/* Header section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t("appointments.title")}</h1>
                <p className="mt-1 text-indigo-100">{t("appointments.subtitle")}</p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors"
              >
                <Plus size={18} />
                {t("appointments.newAppointment")}
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-6">
              <button
                onClick={() => setFilter("all")}
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  filter === "all" 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t("appointments.filters.all")}
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  filter === "upcoming" 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t("appointments.filters.upcoming")}
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  filter === "completed" 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t("appointments.filters.completed")}
              </button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="ml-2 text-gray-600">{t("appointments.loading")}</span>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12 px-4">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("appointments.empty.title")}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {filter === "all" 
                    ? t("appointments.empty.all")
                    : t("appointments.empty.filtered", { filter: t(`appointments.filters.${filter}`) })}
                </p>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus size={16} className="mr-2" />
                  {t("appointments.empty.schedule")}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => navigate(`/appointments/${appt.id}/chat`)}
                    className="group relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer hover:border-indigo-300"
                  >
                    {/* Status indicator */}
                    <div className={`absolute top-5 right-5 w-2 h-2 rounded-full ${
                      appt.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    
                    {/* Specialty */}
                    <div className="text-lg font-semibold text-gray-900 mb-2">{appt.specialty}</div>
                    
                    {/* Concern */}
                    <div className="flex items-start mb-3">
                      <FileText className="text-gray-400 w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">{appt.primaryConcern}</p>
                    </div>
                    
                    {/* Date/time */}
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(appt.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Time */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{new Date(appt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>

                    {/* Hover effect indicator */}
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}