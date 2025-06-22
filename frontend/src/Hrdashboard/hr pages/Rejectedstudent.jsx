import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Globe,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  User
} from 'lucide-react';

export default function RejectedStudentsSection() {
  // Mock rejected student data
  const [rejectedStudents, setRejectedStudents] = useState([
    {
      id: 1,
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "(555) 111-2222",
      portfolio: "davidwilson.dev",
      location: "Chicago, IL",
      program: "Business Administration",
      education: "MBA, University of Chicago",
      rejectedDate: "2023-10-15",
      bio: "Business professional with 5 years of experience in financial analysis and strategic planning.",
      skills: ["Financial Modeling", "Excel", "Market Analysis"],
      status: "rejected",
      resume: "https://example.com/resumes/david-wilson-resume.pdf"
    },
    {
      id: 2,
      name: "Emily Parker",
      email: "emily.parker@example.com",
      phone: "(555) 333-4444",
      portfolio: "emilyparker.dev",
      location: "Austin, TX",
      program: "Graphic Design",
      education: "B.F.A. Graphic Design, RISD",
      rejectedDate: "2023-10-18",
      bio: "Creative designer specializing in branding and digital media. Worked with several startups.",
      skills: ["Adobe Creative Suite", "UI/UX Design", "Branding"],
      status: "rejected",
      resume: "https://example.com/resumes/emily-parker-resume.pdf"
    },
    // Add more mock data if needed to test pagination
    {
      id: 3,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 555-5555",
      portfolio: "johnsmith.dev",
      location: "New York, NY",
      program: "Computer Science",
      education: "B.S. Computer Science, NYU",
      rejectedDate: "2023-10-20",
      bio: "Software engineer with experience in web development and cloud computing.",
      skills: ["JavaScript", "React", "AWS"],
      status: "rejected",
      resume: "https://example.com/resumes/john-smith-resume.pdf"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 666-7777",
      portfolio: "sarahjohnson.dev",
      location: "San Francisco, CA",
      program: "Data Science",
      education: "M.S. Data Science, Stanford",
      rejectedDate: "2023-10-22",
      bio: "Data scientist with expertise in machine learning and big data analytics.",
      skills: ["Python", "TensorFlow", "SQL"],
      status: "rejected",
      resume: "https://example.com/resumes/sarah-johnson-resume.pdf"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [applicationToApprove, setApplicationToApprove] = useState(null);
  const [applicationToHold, setApplicationToHold] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(3);

  // Filter rejected students
  const filteredStudents = rejectedStudents.filter(s => s.status === "rejected");

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);
      
      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) {
          pageNumbers.push('...');
        }
      }
      
      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }
      
      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle student status change to approved
  const handleApprove = (id) => {
    setRejectedStudents(rejectedStudents.map(student => 
      student.id === id ? { ...student, status: "approved" } : student
    ));
    setApplicationToApprove(null);
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  // Handle student status change to hold
  const handleHold = (id) => {
    setRejectedStudents(rejectedStudents.map(student => 
      student.id === id ? { ...student, status: "hold" } : student
    ));
    setApplicationToHold(null);
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Student profile view (keep this exactly the same as before)
  if (selectedStudent) {
    const currentIndex = filteredStudents.findIndex(s => s.id === selectedStudent.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < filteredStudents.length - 1;

    const handlePrevious = () => {
      if (hasPrevious) {
        setSelectedStudent(filteredStudents[currentIndex - 1]);
      }
    };

    const handleNext = () => {
      if (hasNext) {
        setSelectedStudent(filteredStudents[currentIndex + 1]);
      }
    };

    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevious}
              className={`flex items-center gap-2 ${hasPrevious ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
              disabled={!hasPrevious}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {filteredStudents.length}
            </span>
            
            <button 
              onClick={handleNext}
              className={`flex items-center gap-2 ${hasNext ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
              disabled={!hasNext}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
  
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h1>
        </div>
  
        {selectedStudent.resume && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Resume Preview</h2>
              <a 
                href={selectedStudent.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Full Resume
              </a>
            </div>
            
            <div className="h-[600px] w-full bg-white border border-gray-300 rounded overflow-hidden">
              <iframe 
                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedStudent.resume)}&embedded=true`}
                className="w-full h-full"
                frameBorder="0"
                title="Resume Preview"
              >
                <p className="p-4 text-gray-500">Your browser does not support PDF preview. 
                  <a href={selectedStudent.resume} className="text-blue-600 hover:underline ml-1">
                    Download the resume instead
                  </a>
                </p>
              </iframe>
            </div>
          </div>
        )}
  
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock size={14} />
            Rejected {formatDate(selectedStudent.rejectedDate)}
          </span>
        </div>
  
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setApplicationToApprove(selectedStudent.id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            Approve
          </button>
          <button 
            onClick={() => setApplicationToHold(selectedStudent.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
          >
            Hold
          </button>
          <button 
            onClick={() => window.open(selectedStudent.resume, '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DOWNLOAD RESUME
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedStudent.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-500" />
                <a href={`https://${selectedStudent.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {selectedStudent.portfolio}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedStudent.location}</span>
              </div>
            </div>
          </div>
  
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap size={18} />
              Education
            </h2>
            <p className="text-gray-700">{selectedStudent.education}</p>
          </div>
  
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={18} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedStudent.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
  
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              About
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{selectedStudent.bio}</p>
          </div>
        </div>

        {/* Approve Confirmation Dialog */}
        {applicationToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to approve this student's application?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToApprove(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(applicationToApprove)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hold Confirmation Dialog */}
        {applicationToHold && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Hold</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to put this student's application on hold?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToHold(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleHold(applicationToHold)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Confirm Hold
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main list view
  return (
    <div className="bg-white m-4 rounded-2xl shadow-sm">
      {currentStudents.length > 0 ? (
        <div className="space-y-4">
          {currentStudents.map(student => (
            <div key={student.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Student Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                  <p className="text-gray-600">{student.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                      {student.program}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                      Rejected: {formatDate(student.rejectedDate)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full md:w-auto flex flex-col gap-3">
                  <button 
                    onClick={() => setSelectedStudent(student)}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setApplicationToApprove(student.id)}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => setApplicationToHold(student.id)}
                      className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors min-w-[120px]"
                    >
                      Hold
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {filteredStudents.length > studentsPerPage && (
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> -{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastStudent, filteredStudents.length)}
                </span> of <span className="font-medium">{filteredStudents.length}</span> students
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((number, index) => (
                    number === '...' ? (
                      <span key={index} className="px-2">...</span>
                    ) : (
                      <button
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                          number === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    )
                  ))}
                </div>
                
                <button 
                  className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-1 ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No rejected students found</p>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      {applicationToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to approve this application?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApplicationToApprove(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(applicationToApprove)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hold Confirmation Dialog */}
      {applicationToHold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Hold</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to put this application on hold?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApplicationToHold(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleHold(applicationToHold)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}