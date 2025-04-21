import { useEffect, useState } from "react";
import { getAppointments, createAppointment } from "../api";
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
    <>
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl overflow-hidden">
        <div className="px-6 py-8">
          <Breadcrumb items={[{ label: t("navbar.appointments") }]} />
          
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
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Filter tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setFilter("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === "all"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("appointments.filters.all")}
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === "upcoming"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("appointments.filters.upcoming")}
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === "past"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("appointments.filters.past")}
            </button>
          </div>
        </div>

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
            <div className="space-y-6">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{appointment.title}</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{appointment.datetime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`appointments.status.${appointment.status}`)}
                    </span>
                    <button
                      onClick={() => navigate(`/appointments/${appointment.id}/chat`)}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {t("appointments.viewDetails")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}