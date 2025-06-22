import React from 'react';
import { Link } from 'react-router-dom';

function ViewJob({ jobId }) {
  return (
    <Link
      to={`/apply-for-jobs/job-details/${jobId}`}
      className="text-blue-600 hover:text-blue-800 font-semibold"
    >
      View Job
    </Link>
  );
}

export default ViewJob;
