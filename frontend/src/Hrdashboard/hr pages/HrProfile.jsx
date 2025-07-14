import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Briefcase, Mail, Phone, MapPin, Calendar, 
  Linkedin, ChevronDown, Edit, Save, X, Pencil, Trash2, Clock 
} from "lucide-react";
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHrProfile = async () => {
      try {
        const token = Cookies.get("jwtToken");
        
        console.log("Debug: HrProfile.jsx - Token being used:", token);
        const userDetailsString = Cookies.get("userDetails");
        let userRole = null;
        if (userDetailsString) {
          try {
            const userDetails = JSON.parse(userDetailsString);
            userRole = userDetails.role;
          } catch (parseError) {
            console.error("Error parsing userDetails from cookie in HrProfile.jsx:", parseError);
          }
        }
        console.log("Debug: HrProfile.jsx - User Role from cookie:", userRole);
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          "/api/profile", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Debug: HrProfile.jsx - API Response for /api/profile:", response.data); // Added this line
        setProfileDetails(response.data);
        setFormData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching HR profile:", err);
        setError(err.response?.data?.error || "Failed to load profile.");
        setIsLoading(false);
        toast.error(err.response?.data?.error || "Failed to load profile.");
      }
    };

    fetchHrProfile();
  }, []);

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
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("jwtToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.put(
        "/api/profile", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileDetails(response.data.profile);
      setFormData(response.data.profile);
      
      // Update userDetails cookie with the latest profile data
      Cookies.set('userDetails', JSON.stringify(response.data.profile), { expires: 7 });
      console.log("Debug: HrProfile.jsx - userDetails cookie updated to:", response.data.profile);

      // Dispatch a custom event to notify other components of auth change
      //tan
      // After profile update success:
      Cookies.set("userDetails", JSON.stringify(response.data.profile), { expires: 7 });
      window.dispatchEvent(new Event('authChange'));  // Force Sidebar/UserAvatar refresh

      setIsEditing(false);
      setEditSection(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating HR profile:", err);
      setError(err.response?.data?.error || "Failed to update profile.");
      toast.error(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
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

  // Render loading and error states
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading HR Profile...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;
  }

  // If profileDetails is null, it means there's no data to display (e.g., first load failed)
  if (!profileDetails) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-500">No HR profile data available.</div>;
  }

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
                    name="username"
                    value={formData.username || ''}
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
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Email"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">VOAT ID</label>
                  <input
                    type="text"
                    name="voat_id"
                    value={formData.voat_id || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="VOAT ID"
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
                  <span>{profileDetails.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="shrink-0 text-gray-500" />
                  <span>{profileDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="shrink-0 text-gray-500" />
                  <span>VOAT ID: {profileDetails.voat_id || 'N/A'}</span>
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
                  onClick={() => startEditing('hrDetails')}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#0F52BA] hover:bg-[#0a3a8a] text-white"
                  aria-label="Edit HR details"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>

            {isEditing && editSection === 'hrDetails' ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Company"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Role"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Experience"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Basic Details</label>
                  <input
                    type="text"
                    name="basicDetails"
                    value={formData.basicDetails || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Basic Details"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Contact Person"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail || ''}
                    onChange={handleInputChange}
                    className="border rounded p-2 bg-white"
                    aria-label="Contact Email"
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
                  <span>Company: {profileDetails.company || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="shrink-0 text-gray-500" />
                  <span>Role: {profileDetails.role || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="shrink-0 text-gray-500" />
                  <span>Experience: {profileDetails.experience || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="shrink-0 text-gray-500" />
                  <span>Position: {profileDetails.basicDetails || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="shrink-0 text-gray-500" />
                  <span>Contact: {profileDetails.contactPerson || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="shrink-0 text-gray-500" />
                  <span>Email: {profileDetails.contactEmail || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Section */}
          <div className="rounded-xl p-6 shadow-md bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#0F52BA]">{profileDetails.jobsPosted || 0}</span>
                  <span className="text-sm text-gray-600">Jobs Posted</span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-green-700">{profileDetails.receivedJobs || 0}</span>
                  <span className="text-sm text-gray-600">Received Jobs</span>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-700">{profileDetails.pendingApplications || 0}</span>
                  <span className="text-sm text-gray-600">Pending Applications</span>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-red-700">₹{profileDetails.paymentDue || 0}</span>
                  <span className="text-sm text-gray-600">Payment Due</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}