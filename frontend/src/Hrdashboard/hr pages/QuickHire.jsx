import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { apiUrl } from '../../utilits/apiUrl';
import { UploadCloud, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QuickHire = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setError('');
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB limit.");
        setSelectedFile(null);
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, and PDF files are allowed.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleProcessPoster = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('poster', selectedFile);

    try {
      const token = Cookies.get('jwtToken');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${apiUrl}/hr/quick-hire/process-poster`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const jobData = response.data.jobDetails;
      toast.success("Job details processed successfully! Redirecting to Post Job.");
      navigate('/hire/post-job', { state: { jobData } });

    } catch (err) {
      console.error("Error processing poster:", err);
      const errorMessage = err.response?.data?.error || "Failed to process poster. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return null;
    if (file.type.startsWith('image/')) return <ImageIcon size={24} className="text-blue-500" />;
    if (file.type === 'application/pdf') return <FileText size={24} className="text-red-500" />;
    return <FileText size={24} className="text-gray-500" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Quick Hire - Process Job Poster</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition duration-300 ease-in-out">
        <input
          id="file-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
          <UploadCloud size={48} className="text-gray-400" />
          <p className="text-lg text-gray-600 font-medium">Drag & drop your job poster here, or <span className="text-blue-600 hover:underline">browse</span></p>
          <p className="text-sm text-gray-500">JPG, PNG, or PDF (Max 5MB)</p>
        </label>
        {selectedFile && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center justify-between text-blue-800 text-sm font-medium border border-blue-200">
            <div className="flex items-center space-x-2">
              {getFileIcon(selectedFile)}
              <span>{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <button
        onClick={handleProcessPoster}
        disabled={!selectedFile || loading}
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-colors duration-300 ${
          selectedFile && !loading ? 'bg-[#0F52BA] hover:bg-[#0a3a8a]' : 'bg-gray-400 cursor-not-allowed'
        } flex items-center justify-center`}
      >
        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
        {loading ? 'Processing...' : 'Process Job Poster'}
      </button>
    </div>
  );
};

export default QuickHire;
