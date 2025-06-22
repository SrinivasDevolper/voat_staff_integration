import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Briefcase, Mail, Phone, MapPin, Calendar, 
  Linkedin, ChevronDown, Edit, Save, X, Pencil, Trash2, Clock 
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);

  // Initial profile data with Indian details
  const initialProfileDetails = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, Karnataka",
    jobsPosted: 8,
    receivedJobs: 3,
    pendingApplications: 15,
    paymentDue: 12500,
    hrDetails: {
      company: "TechSolutions India Pvt. Ltd.",
      role: "Senior Software Engineer",
      experience: "5 years",
      basicDetails: "Full-time position | Hybrid",
      contactPerson: "Priya Patel",
      contactEmail: "hr@techsolutionsindia.co.in"
    }
  };

  // State for editable fields
  const [profileDetails, setProfileDetails] = useState(initialProfileDetails);
  const [formData, setFormData] = useState({ ...initialProfileDetails });

  // Tasks state with interview slots
  const [tasks, setTasks] = useState([
    { 
      id: 1,
      date: new Date(2025, 3, 3),
      title: "Interview with Infosys",
      slot: "10:00 AM - 11:00 AM",
      Candidate: "Mr. Rajesh Kumar (Tech Lead)"
    },
    { 
      id: 2,
      date: new Date(2025, 3, 7),
      title: "Follow-up with TCS HR",
      slot: "2:30 PM - 3:00 PM",
      Candidate: "Ms. Priya Sharma (HR Manager)"
    },
    { 
      id: 3,
      date: new Date(2025, 3, 12),
      title: "Technical Round with Amazon",
      slot: "4:00 PM - 5:30 PM",
      Candidate: "Mr. Amit Patel (Senior Engineer)"
    }
  ]);

  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    slot: '',
    Candidate: '',
    date: ''
  });

  // Handle input changes for profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save profile changes
  const handleSave = () => {
    setProfileDetails(formData);
    setIsEditing(false);
    setEditSection(null);
  };

  // Cancel profile editing
  const handleCancel = () => {
    setFormData({ ...profileDetails });
    setIsEditing(false);
    setEditSection(null);
  };

  // Start editing a profile section
  const startEditing = (section) => {
    setFormData({ ...profileDetails });
    setEditSection(section);
    setIsEditing(true);
  };

  // Task functions
  const handleTaskEdit = (task) => {
    setEditingTask(task.id);
    setTaskForm({
      title: task.title,
      slot: task.slot,
      Candidate: task.Candidate,
      date: task.date.toISOString().split('T')[0]
    });
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskSave = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask 
        ? { 
            ...task, 
            title: taskForm.title,
            slot: taskForm.slot,
            Candidate: taskForm.Candidate,
            date: new Date(taskForm.date)
          } 
        : task
    ));
    setEditingTask(null);
    setTaskForm({ title: '', slot: '', Candidate: '', date: '' });
  };

  const handleTaskCancel = () => {
    setEditingTask(null);
    setTaskForm({ title: '', slot: '', Candidate: '', date: '' });
  };

  const handleTaskDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="rounded-xl p-6 shadow-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => startEditing('profile')}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#0F52BA] hover:bg-[#0a3a8a] text-white"
                  aria-label="Edit profile details"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>

            {isEditing && editSection === 'profile' ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Phone number"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Location"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100"
                    aria-label="Cancel editing"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 px-4 py-2 bg-[#0F52BA] hover:bg-[#0a3a8a] text-white rounded"
                    aria-label="Save changes"
                  >
                    <Save size={18} /> Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="shrink-0 text-gray-500" />
                  <span>{profileDetails.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="shrink-0 text-gray-500" />
                  <span>{profileDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="shrink-0 text-gray-500" />
                  <span>{profileDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="shrink-0 text-gray-500" />
                  <span>{profileDetails.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* HR Details */}
          <div className="rounded-xl p-6 shadow-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">HR Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => startEditing('hr')}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#0F52BA] hover:bg-[#0a3a8a] text-white"
                  aria-label="Edit HR details"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>

            {isEditing && editSection === 'hr' ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Company</label>
                  <input
                    type="text"
                    name="hrDetails.company"
                    value={formData.hrDetails.company}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Company name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Role</label>
                  <input
                    type="text"
                    name="hrDetails.role"
                    value={formData.hrDetails.role}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Job role"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Experience</label>
                  <input
                    type="text"
                    name="hrDetails.experience"
                    value={formData.hrDetails.experience}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Years of experience"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Position Type</label>
                  <input
                    type="text"
                    name="hrDetails.basicDetails"
                    value={formData.hrDetails.basicDetails}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Position type"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Contact Person</label>
                  <input
                    type="text"
                    name="hrDetails.contactPerson"
                    value={formData.hrDetails.contactPerson}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Contact person"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Contact Email</label>
                  <input
                    type="email"
                    name="hrDetails.contactEmail"
                    value={formData.hrDetails.contactEmail}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Contact email"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-4 py-2 border rounded hover:bg-gray-100"
                    aria-label="Cancel editing"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 px-4 py-2 bg-[#0F52BA] hover:bg-[#0a3a8a] text-white rounded"
                    aria-label="Save changes"
                  >
                    <Save size={18} /> Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="shrink-0 text-gray-500" />
                  <span>Company: {profileDetails.hrDetails.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="shrink-0 text-gray-500" />
                  <span>Role: {profileDetails.hrDetails.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="shrink-0 text-gray-500" />
                  <span>Experience: {profileDetails.hrDetails.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="shrink-0 text-gray-500" />
                  <span>Position: {profileDetails.hrDetails.basicDetails}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="shrink-0 text-gray-500" />
                  <span>Contact: {profileDetails.hrDetails.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="shrink-0 text-gray-500" />
                  <span>Email: {profileDetails.hrDetails.contactEmail}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Linkedin className="shrink-0 text-gray-500" />
                  <span>LinkedIn: {profileDetails.hrDetails.linkedin}</span>
                </div> */}
              </div>
            )}
          </div>

          {/* Interview Schedule Section */}
          <div className="lg:col-span-2 rounded-xl p-6 shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Interview Schedule</h2>
              <div className="flex gap-2">
                <Link
                  to="/hire/schedule"
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#0F52BA] hover:bg-[#0a3a8a] text-white text-sm"
                  aria-label="View all interviews"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {tasks.map((task) => {
                const formattedDate = `${task.date.toLocaleString('default', { month: 'long' })} ${task.date.getDate()}, ${task.date.getFullYear()}`;
                
                return (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors relative">
                    {editingTask === task.id ? (
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-400">Interview Title</label>
                          <input
                            type="text"
                            name="title"
                            value={taskForm.title}
                            onChange={handleTaskInputChange}
                            className="border rounded p-2 bg-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-400">Time Slot</label>
                          <input
                            type="text"
                            name="slot"
                            value={taskForm.slot}
                            onChange={handleTaskInputChange}
                            className="border rounded p-2 bg-white"
                            placeholder="e.g. 10:00 AM - 11:00 AM"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-400">Candidate</label>
                          <input
                            type="text"
                            name="Candidate"
                            // value={taskForm.interviewer}
                            onChange={handleTaskInputChange}
                            className="border rounded p-2 bg-white"
                            placeholder="Candidate name and designation"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-400">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={taskForm.date}
                            onChange={handleTaskInputChange}
                            className="border rounded p-2 bg-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={handleTaskCancel}
                            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleTaskSave}
                            className="px-3 py-1 bg-[#0F52BA] hover:bg-[#0a3a8a] text-white rounded text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{task.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="mr-1" size={14} />
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleTaskEdit(task)}
                              className="p-1 text-gray-500 hover:text-blue-600"
                              aria-label="Edit interview"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleTaskDelete(task.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                              aria-label="Delete interview"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="mr-2" size={14} />
                            <span className="font-medium">Time Slot:</span> {task.slot}
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <User className="mr-2 mt-0.5" size={14} />
                            <span className="font-medium">Candidate:</span> {task.Candidate}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}