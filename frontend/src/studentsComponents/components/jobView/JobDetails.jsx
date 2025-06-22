import {
  MapPin,
  Bookmark,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Code,
} from "lucide-react";
import Header from "../header/Header";
import { Link, useParams } from "react-router-dom";
import { useUserJobContext } from "../../contexts/UserJobContext";

const JobDetails = ({}) => {
  const { id } = useParams();
  const { 
    savedJobs, 
    getDaysAgo, 
    selectedJob, 
    setSelectedJob, 
    handleApplyNow,
    appliedJobs 
  } = useUserJobContext();

  if (!id) {
    return <div>Job not found</div>;
  }

  const isApplied = appliedJobs.some(job => job.id === selectedJob?.id);

  return (
    <div className="flex">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-24 max-w-[1800px] mx-auto p-2 h-screen flex flex-col">
        <div className="max-w-6xl mx-auto mb-10 mt-4">
          <Link
            to="/apply-for-jobs"
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-1 text-blue-600 mb-4 hover:text-blue-800"
          >
            <ChevronLeft size={20} />
            <span>Back to jobs</span>
          </Link>

          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">{selectedJob.company}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {selectedJob.title}
                  </h1>
                  {isApplied && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full self-start md:self-auto w-28 text-center">
                    • Applied
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleSaveJob(selectedJob.id)}
                className={`p-2 rounded-full ${
                  savedJobs.includes(selectedJob.id)
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100"
                }`}
              >
                <Bookmark
                  size={24}
                  fill={
                    savedJobs.includes(selectedJob.id) ? "currentColor" : "none"
                  }
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="text-blue-500" size={20} />
                <div>
                  <div className="text-sm text-gray-600">SALARY</div>
                  <div className="font-medium">{selectedJob.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-blue-500" size={20} />
                <div>
                  <div className="text-sm text-gray-600">EXPERIENCE</div>
                  <div className="font-medium">{selectedJob.experience}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-500" size={20} />
                <div>
                  <div className="text-sm text-gray-600">POSTED</div>
                  <div className="font-medium">
                    {getDaysAgo(selectedJob.postedDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-blue-500" size={20} />
                <div>
                  <div className="text-sm text-gray-600">WORK MODE</div>
                  <div className="font-medium">{selectedJob.workMode}</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Job Updates
              </h2>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <button className="text-gray-400">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex-1 px-4 md:px-8">
                    <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2">
                      <span>Applied</span>
                      <span>Expected Date for the Next Update</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
                      <span>1 minute ago</span>
                      <span>24 Apr, 2025</span>
                    </div>
                  </div>
                  <button className="text-gray-400">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code size={20} />
                  Job Description
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We are looking for a skilled {selectedJob.title} to join our
                    team at {selectedJob.company}.
                  </p>
                  <p>Location: {selectedJob.location}</p>
                  <p>Job Type: {selectedJob.type}</p>
                  <p>Required Skills: {selectedJob.skills}</p>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Job Location</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin size={16} />
                    <span>{selectedJob.location}</span>
                  </div>

                  <h3 className="font-medium mb-4">Skills Required</h3>
                  <ul className="space-y-2 text-gray-600">
                    {selectedJob.skills.split(",").map((skill, index) => (
                      <li key={index}>• {skill.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isApplied ? (
                <Link
                  to="/applied-jobs"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors text-lg w-full md:w-auto"
                >
                  View Application
                </Link>
              ) : (
              <Link
                to="/applied-jobs"
                onClick={() => handleApplyNow(selectedJob.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors text-lg w-full md:w-auto"
              >
                Apply Now
              </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
