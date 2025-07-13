import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// For demo, use mock data. Replace with API call or context as needed.
const mockJobs = [
  {
    id: '1',
    title: 'Software / Web Developer Intern',
    company: 'Smart Finance',
    location: 'Anna Nagar, Chennai',
    experience: 'Any experience',
    salary: '₹12,000 - ₹25,000 monthly',
    posted: '2023-05-15',
    urgent: true,
    description: 'We are looking for a Software/Web Developer Intern...'
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Bangalore, Karnataka',
    experience: '1-2 years',
    salary: '₹20,000 - ₹35,000 monthly',
    posted: '2023-05-10',
    urgent: false,
    description: 'Join our frontend team to build modern web apps...'
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Data Systems Ltd',
    location: 'Hyderabad, Telangana',
    experience: '2-3 years',
    salary: '₹25,000 - ₹40,000 monthly',
    posted: '2023-05-14',
    urgent: true,
    description: 'Seeking a backend engineer for scalable systems...'
  }
];

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === id);
  const isLoggedIn = !!Cookies.get("jwtToken");

  if (!job) {
    return <div className="p-8 text-center text-red-600">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">&larr; Back</button>
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        {job.urgent && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">Urgent</span>}
        <div className="text-gray-700 mb-2">{job.company} &bull; {job.location}</div>
        <div className="mb-2"><strong>Experience:</strong> {job.experience}</div>
        <div className="mb-2"><strong>Salary:</strong> <span className="text-green-700">{job.salary}</span></div>
        <div className="mb-2"><strong>Posted:</strong> {job.posted}</div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="code">&lt;/&gt;</span>
            Job Description
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              We are looking for a skilled {job.title} to join our team at {job.company}.
            </p>
            <p>Location: {job.location}</p>
            <p>Job Type: Full Time</p>
            <p>Required Skills: HTML, CSS, JavaScript, React</p>
          </div>
        </div>
        {isLoggedIn ? (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            onClick={() => alert('Applied!')}
          >
            Apply
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            onClick={() => navigate('/login')}
          >
            Login to Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage; 