import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAppointments } from "../api/Call";
import type { Appointment, AppointmentsResponse } from "../interfaces/appointments";
import { Calendar, User, Clock, Info, CheckCircle, AlertCircle, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination & Fetch State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [maxResults, setMaxResults] = useState(500);

  const token = useSelector((state: RootState) => state.auth.user?.access_token);

  useEffect(() => {
    const fetchAuthAppointments = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response: AppointmentsResponse = await getAppointments(token, maxResults);
        if (response.success) {
          setAppointments(response.appointments);
          setCurrentPage(1); // Reset to first page
        } else {
          toast.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("An error occurred while fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthAppointments();
  }, [token, maxResults]);

  const filteredAppointments = appointments.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.owner_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scheduledCount = appointments.filter(app => app.status === "scheduled").length;

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-transparent">
      {/* Header */}
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter"
        >
          Appointments <span className="text-brand-primary">Management</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 font-medium tracking-tight max-w-xl"
        >
          View and manage all your scheduled events and meetings with real-time tracking.
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Appointments</p>
            <h3 className="text-3xl font-bold text-white mt-1">{appointments.length}</h3>
          </div>
          <div className="bg-brand-primary/20 p-4 rounded-2xl text-brand-primary">
            <Calendar size={28} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm font-medium">Scheduled</p>
            <h3 className="text-3xl font-bold text-white mt-1">{scheduledCount}</h3>
          </div>
          <div className="bg-green-500/20 p-4 rounded-2xl text-green-500">
            <CheckCircle size={28} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm font-medium">Coming Soon</p>
            <h3 className="text-3xl font-bold text-white mt-1">--</h3>
          </div>
          <div className="bg-yellow-500/20 p-4 rounded-2xl text-yellow-500">
            <Info size={28} />
          </div>
        </motion.div>
      </div>

      {/* Search and Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, attendee, or owner..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Load Max:</span>
              <select 
                value={maxResults} 
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
              >
                <option value={10} className="bg-dark-bg">10</option>
                <option value={50} className="bg-dark-bg">50</option>
                <option value={100} className="bg-dark-bg">100</option>
                <option value={250} className="bg-dark-bg">250</option>
                <option value={500} className="bg-dark-bg">500</option>
              </select>
            </div>
            
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Showing <span className="text-brand-primary">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAppointments.length)}</span> of <span className="text-white">{filteredAppointments.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                <th className="px-4 md:px-6 py-4">Title & Description</th>
                <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Owner</th>
                <th className="px-4 md:px-6 py-4">Attendee</th>
                <th className="px-4 md:px-6 py-4">Date & Time</th>
                <th className="px-4 md:px-6 py-4 hidden md:table-cell">Status</th>
                <th className="px-4 md:px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-medium tracking-tight">Loading appointments...</p>
                    </div>
                  </td>
                </tr>
              ) : currentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={40} className="text-white/10" />
                      <p>No appointments found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 md:px-6 py-5">
                      <div className="font-bold text-white mb-0.5 group-hover:text-brand-primary transition-colors text-sm md:text-base">
                        {app.title}
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-1 max-w-[200px] md:max-w-xs">{app.description}</div>
                    </td>
                    <td className="px-4 md:px-6 py-5 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <User size={12} className="text-brand-primary shrink-0" />
                        <span className="truncate max-w-[100px]">{app.owner_username}</span>
                      </div>
                      <div className="text-[9px] text-gray-500 ml-5 truncate max-w-[120px]">{app.owner_email}</div>
                    </td>
                    <td className="px-4 md:px-6 py-5">
                      {app.attendee_name ? (
                        <>
                          <div className="text-white text-sm font-medium">{app.attendee_name}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{app.attendee_email}</div>
                        </>
                      ) : app.attendee_email ? (
                        <div className="text-white text-sm font-medium truncate max-w-[150px]">{app.attendee_email}</div>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-5">
                      <div className="flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap">
                        <Calendar size={12} className="text-brand-primary shrink-0" />
                        {app.appointment_date}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 ml-5 whitespace-nowrap">
                        <Clock size={10} className="shrink-0" />
                        {app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-5 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        app.status === "scheduled" 
                          ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-5 text-center">
                      <button 
                        onClick={() => openModal(app)}
                        className="p-2 glass !bg-white/5 rounded-xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                      >
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 glass !bg-white/5 rounded-xl text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                // Show first, last, and pages around current
                if (
                  number === 1 || 
                  number === totalPages || 
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        currentPage === number 
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                          : "glass !bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {number}
                    </button>
                  );
                } else if (
                  (number === 2 && currentPage > 3) || 
                  (number === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={number} className="text-gray-600 px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 glass !bg-white/5 rounded-xl text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block border border-brand-primary/30">
                      Appointment Details
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                      {selectedAppointment.title}
                    </h2>
                  </div>
                  <button onClick={closeModal} className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 text-left">Description</p>
                    <p className="text-gray-300 leading-relaxed text-left">{selectedAppointment.description || "No description provided."}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 text-left lowercase">Attendee</p>
                      <div className="flex flex-col text-left">
                        <span className="text-white font-bold">{selectedAppointment.attendee_name || "—"}</span>
                        <span className="text-xs text-gray-500 truncate">{selectedAppointment.attendee_email || "No email provided"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 text-left lowercase">Owner</p>
                      <div className="flex flex-col text-left">
                        <span className="text-white font-bold">{selectedAppointment.owner_username}</span>
                        <span className="text-xs text-gray-500 truncate">{selectedAppointment.owner_email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                        <Calendar size={20} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-gray-500">Date</span>
                        <span className="text-white font-bold">{selectedAppointment.appointment_date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                        <Clock size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Time Range</span>
                        <span className="text-white font-bold text-sm">{selectedAppointment.start_time} - {selectedAppointment.end_time}</span>
                      </div>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 text-left">Notes</p>
                      <p className="text-gray-300 text-sm p-4 bg-white/5 rounded-2xl border border-white/5 text-left">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={closeModal}
                    className="flex-1 py-4 glass !bg-brand-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                  >
                    Alright
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
