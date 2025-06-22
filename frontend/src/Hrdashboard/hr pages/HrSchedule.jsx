import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

export default function HRSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('calendar');

  // Sample interview data with time slots and interviewers
  const upcomingInterviews = [
    { 
      id: 1,
      date: new Date(2025, 3, 3),
      title: "Technical Interview - Infosys",
      slot: "10:00 AM - 11:00 AM",
      Candidate: "Rajesh Kumar (Tech Lead)",
      status: "scheduled"
    },
    { 
      id: 2,
      date: new Date(2025, 3, 7),
      title: "HR Discussion - TCS",
      slot: "2:30 PM - 3:00 PM",
      Candidate: "Priya Sharma (HR Manager)",
      status: "scheduled"
    },
    { 
      id: 3,
      date: new Date(2025, 3, 12),
      title: "Coding Assessment - Amazon",
      slot: "4:00 PM - 5:30 PM",
      Candidate: "Amit Patel (Senior Engineer)",
      status: "pending"
    },
    { 
      id: 4,
      date: new Date(2025, 3, 15),
      title: "Final Round - Wipro",
      slot: "11:30 AM - 12:30 PM",
      Candidate: "Neha Gupta (Hiring Manager)",
      status: "pending"
    },
    { 
      id: 5,
      date: new Date(2025, 3, 18),
      title: "Technical Screening - Tech Mahindra",
      slot: "3:00 PM - 4:00 PM",
      Candidate: "Vikram Singh (Architect)",
      status: "scheduled"
    },
    { 
      id: 6,
      date: new Date(2025, 3, 22),
      title: "Offer Discussion - Accenture",
      slot: "1:00 PM - 2:00 PM",
      Candidate: "Ananya Das (HR Business Partner)",
      status: "scheduled"
    }
  ];

  const scheduledDays = upcomingInterviews.map(interview => ({
    day: interview.date.getDate(),
    month: interview.date.getMonth(),
    year: interview.date.getFullYear()
  }));

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    return [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  };

  const calendarDays = generateCalendarDays();

  const hasScheduledInterview = (day) => day && scheduledDays.some(
    d => d.day === day && d.month === currentMonth && d.year === currentYear
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (offset) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
    setSelectedDate(null);
    setFilteredInterviews([]);
  };

  const filterInterviewsByDate = (day) => {
    if (!day) return;
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    setFilteredInterviews(
      upcomingInterviews.filter(interview =>
        interview.date &&
        interview.date.getDate() === day &&
        interview.date.getMonth() === currentMonth &&
        interview.date.getFullYear() === currentYear
      )
    );
    if (isMobileView) setActiveTab('interviews');
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setFilteredInterviews([]);
    if (isMobileView) setActiveTab('calendar');
  };

  const formatDateDisplay = (date) => date ? `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}` : '';

  return (
    <div className="max-w-[1800px] mx-auto p-2 sm:p-4 md:p-6 h-screen flex flex-col overflow-hidden">
      {isMobileView && (
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`flex-1 py-2 font-medium ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
          <button
            className={`flex-1 py-2 font-medium ${activeTab === 'interviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('interviews')}
          >
            Interviews
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 flex-1 overflow-hidden mb-8">
        {(isMobileView && activeTab === 'calendar') || !isMobileView ? (
          <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-md flex-1 min-w-0 overflow-hidden max-h-[565px]">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 md:p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mx-2 text-center">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 md:p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-4 md:mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 text-xs sm:text-sm md:text-base py-1">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[30px] sm:min-h-[40px] md:min-h-[50px] lg:min-h-[60px] flex items-center justify-center rounded-lg text-xs sm:text-sm md:text-base
                    ${day ?
                      (hasScheduledInterview(day) ?
                        'bg-[#0F52BA] text-white cursor-pointer' :
                        'bg-gray-100 hover:bg-gray-200 cursor-pointer')
                      : 'bg-transparent'
                    }
                    ${selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() === currentMonth &&
                    selectedDate?.getFullYear() === currentYear ?
                      'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                  onClick={() => filterInterviewsByDate(day)}
                >
                  {day || ''}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#0F52BA] rounded mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-600">Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-100 rounded mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-600">Available</span>
              </div>
              {selectedDate && (
                <button
                  onClick={clearDateFilter}
                  className="ml-auto text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        ) : null}

        {(isMobileView && activeTab === 'interviews') || !isMobileView ? (
          <div className={`bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-md ${isMobileView ? 'w-full' : 'w-full lg:w-[400px] xl:w-[450px]'} min-w-0 flex flex-col h-fit`}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Upcoming Interviews
              </h3>
              <div className="flex items-center gap-2">
                {selectedDate && (
                  <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
                    {formatDateDisplay(selectedDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[450px] overflow-y-auto">
              {(selectedDate ? filteredInterviews : upcomingInterviews).length > 0 ? (
                <>
                  {(selectedDate ? filteredInterviews : upcomingInterviews).map(interview => (
                    <div
                      key={interview.id}
                      className={`p-3 sm:p-4 rounded-lg ${interview.status === 'completed' ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}
                    >
                      <h4 className="font-medium text-sm sm:text-base text-gray-800">
                        {interview.title}
                      </h4>
                      <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-600">
                        <Clock className="mr-2" size={14} />
                        <span>{interview.slot}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-600">
                        <User className="mr-2" size={14} />
                        <span>{interview.Candidate}</span>
                      </div>
                      {interview.date && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateDisplay(interview.date)}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-3 md:py-6"> 
                  <p className="text-gray-500 text-sm md:text-base">
                    {selectedDate
                      ? `No interviews scheduled for ${formatDateDisplay(selectedDate)}`
                      : 'No upcoming interviews'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}