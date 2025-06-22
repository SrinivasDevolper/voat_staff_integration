import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from "lucide-react";

const JobCard = ({ job, onCheckEligibility }) => {
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    applied: { bg: "bg-yellow-200", text: "text-yellow-900", label: "• Applied" },
    hiring: { bg: "bg-green-200", text: "text-green-900", label: "• Hiring Done" },
    previous: { bg: "bg-gray-200", text: "text-gray-900", label: "• Previous" },
  };

  const getStatusBadge = () => {
    const status = statusStyles[job.status];
    return (
      status && (
        <span
          className={`${status.bg} ${status.text} text-xs font-semibold px-3 py-0.5 rounded-full absolute top-4 right-4 shadow-sm`}
        >
          {status.label}
        </span>
      )
    );
  };

  const renderDetails = () => {
    const infoItems = [
      { icon: <MapPin size={16} />, text: job.location },
      { icon: <Clock size={16} />, text: job.salary },
      job.status === "applied"
        ? { icon: <Briefcase size={16} />, text: `${job.title.split(" ")[0]} Role` }
        : { icon: <Users size={16} />, text: `${job.openings} opening${job.openings !== 1 ? "s" : ""}` },
      job.status !== "applied" && { icon: <Calendar size={16} />, text: job.date },
    ].filter(Boolean);

    const columns = job.status === "applied" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

    return (
      <div className={`grid grid-cols-1 ${columns} gap-2 sm:gap-4 mt-2`}>
        {infoItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative group p-[1px] rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500">
      <div className="bg-white rounded-xl p-5 transition-all duration-300 group-hover:shadow-inner">
        {getStatusBadge()}

        <div className="mb-2">
          {/* <div className="text-gray-400 text-xs mb-1">{job.id}</div> */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 pr-20">{job.title}</h3>
          <p className="text-sm text-blue-700 font-medium mb-2">{job.company}</p>
          <div className="max-h-[150px] overflow-y-auto custom-scrollbar pr-3">
            {renderDetails()}
          </div>
          {expanded && (
            <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-3">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-sm sm:text-base mb-2 text-gray-800">
                  Eligibility Criteria
                </h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {job.eligibility || "No eligibility criteria specified"}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-sm sm:text-base mb-2 text-gray-800">
                  Required Skills
                </h4>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {job.requiredSkills || "No specific skills required"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              onCheckEligibility(job);
              setExpanded(!expanded);
            }}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            {expanded ? "View Less" : job.status === "applied" ? "View Application" : "View Details"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
