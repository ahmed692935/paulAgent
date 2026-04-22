import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAppointments } from "../api/Call";
import type { Appointment, AppointmentsResponse } from "../interfaces/appointments";
import { Calendar, User, Clock, CheckCircle, AlertCircle, Search, X } from "lucide-react";
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
    <div className="py-8 space-y-10 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[14px] border border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
              <Calendar size={12} />
              <span>Schedule</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
              Appointments <span className="text-brand-primary">Control</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight max-w-xl">
              Real-time monitoring of all scheduled appointments.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Appointments</p>
               <p className="text-2xl font-black text-slate-900">{appointments.length}</p>
             </div>
             <div className="h-12 w-px bg-slate-200 hidden sm:block" />
             <div className="p-3.5 bg-slate-50 text-brand-primary rounded-[14px] border border-slate-200">
               <Calendar size={24} />
             </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: "Total Appointments", value: appointments.length, icon: <Calendar size={20} />, color: "text-slate-500" },
          { label: "Successfully Appointments", value: scheduledCount, icon: <CheckCircle size={20} />, color: "text-emerald-500" },
          { label: "Pending Appointments", value: "--", icon: <Clock size={20} />, color: "text-amber-500" },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[14px] border border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-slate-400 tracking-[0.05em] uppercase">{stat.label}</p>
              <div className={`p-2.5 rounded-lg bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                 Active
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white rounded-[14px] border border-slate-300 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-8 border-b border-slate-300 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full md:w-[450px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by appointments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-[14px] py-4 pl-14 pr-6 text-slate-900 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Buffer:</span>
              <select 
                value={maxResults} 
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg py-2 px-4 text-slate-700 text-xs font-bold focus:outline-none focus:border-brand-primary transition-all cursor-pointer shadow-sm hover:border-slate-400"
              >
                {[10, 50, 100, 250, 500].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg">
              Showing <span className="text-brand-primary">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAppointments.length)}</span> of {filteredAppointments.length}
            </div>
          </div>
        </div>

        {/* Responsive Table Area */}
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-300">
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Appointments</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">Users</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Attendee</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Time</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:table-cell">Status</th>
                <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Loading Appointments...</p>
                    </div>
                  </td>
                </tr>
              ) : currentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-slate-50 rounded-full text-slate-200">
                        <AlertCircle size={48} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-sm uppercase tracking-tight">Mission Log Empty</p>
                        <p className="text-slate-500 text-xs mt-1">No appointments registered in the current sector.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentAppointments.map((app) => (
                  <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 group-hover:text-brand-primary transition-colors text-base mb-1 tracking-tight">
                        {app.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium line-clamp-1 max-w-xs">{app.description}</div>
                    </td>
                    <td className="px-8 py-8 hidden sm:table-cell">
                      <div className="flex items-center gap-3 text-slate-700 text-sm font-bold">
                        <User size={14} className="text-brand-primary shrink-0 opacity-70" />
                        <span className="truncate max-w-[120px]">{app.owner_username}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-6 tracking-tight truncate max-w-[150px]">{app.owner_email}</div>
                    </td>
                    <td className="px-8 py-8">
                      {app.attendee_name || app.attendee_email ? (
                        <div className="space-y-1">
                          <div className="text-slate-900 text-sm font-bold tracking-tight">{app.attendee_name || "Guest Attendee"}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{app.attendee_email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-200 text-xs">Unregistered</span>
                      )}
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2.5 text-slate-900 text-sm font-black whitespace-nowrap">
                        <Calendar size={13} className="text-brand-primary shrink-0" />
                        {app.appointment_date}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold ml-6 mt-1 uppercase tracking-tight">
                        <Clock size={11} className="shrink-0" />
                        {app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-8 py-8 hidden lg:table-cell">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        app.status === "scheduled" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <button
                          onClick={() => openModal(app)}
                          className="group/btn relative px-6 py-2.5 bg-slate-900 text-white rounded-[14px] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-95 overflow-hidden"
                        >
                          <span className="relative z-10">View</span>
                          <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Console */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-300 flex flex-wrap justify-between items-center gap-4 bg-slate-50/20">
             
             <div className="flex items-center gap-3">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-white shadow-sm rounded-[14px] text-[10px] font-black uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 border border-slate-300 transition-all active:scale-95"
              >
                Prev
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const num = i + 1;
                  if (num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1)) {
                    return (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`w-10 h-10 rounded-[14px] text-[11px] font-black transition-all active:scale-95 ${
                          currentPage === num 
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                            : "bg-white text-slate-400 border border-slate-300 hover:text-slate-900 hover:border-slate-400"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  } else if (num === 2 && currentPage > 3 || num === totalPages - 1 && currentPage < totalPages - 2) {
                    return <span key={num} className="text-slate-300 font-bold px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-white shadow-sm rounded-[14px] text-[10px] font-black uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 border border-slate-300 transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[14px] border border-slate-300 shadow-2xl overflow-hidden"
            >
               <div className="p-10 border-b border-slate-100 bg-linear-to-br from-brand-primary/5 via-transparent to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        selectedAppointment.status === "scheduled" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {selectedAppointment.title}
                    </h2>
                  </div>
                  <button onClick={closeModal} className="p-3 bg-slate-100 rounded-[14px] text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-200 active:scale-90">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="bg-slate-50 p-6 rounded-[14px] border border-slate-300">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Context</p>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedAppointment.description || "No automated mission briefing recorded for this session."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendee</p>
                        <p className="text-slate-900 font-black tracking-tight">{selectedAppointment.attendee_name || "Unverified Contact"}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{selectedAppointment.attendee_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                        <p className="text-slate-900 font-black tracking-tight">{selectedAppointment.appointment_date}</p>
                        <p className="text-xs text-slate-500 font-medium">{selectedAppointment.start_time} - {selectedAppointment.end_time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</p>
                    <div className="p-6 bg-emerald-50/50 rounded-[14px] border border-emerald-100 text-emerald-800 text-sm font-medium leading-relaxed">
                      {selectedAppointment.notes}
                    </div>
                  </div>
                )}
                
                <div className="p-6 bg-slate-50 rounded-[14px] border border-slate-300">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">User</p>
                      <p className="text-xs text-slate-900 font-bold">{selectedAppointment.owner_username}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-xs text-slate-900 font-bold truncate">{selectedAppointment.owner_email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-slate-100 bg-slate-50/30">
                <button
                  onClick={closeModal}
                  className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-[14px] transition-all shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
