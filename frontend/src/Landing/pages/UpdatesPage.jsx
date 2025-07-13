import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dummy Announcement Data
const dummyData = Array(15)  // Increased to 15 items for better pagination demo
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    date: `2025-04-${(i % 30) + 1}`.padStart(2, "0"),
    title: `Announcement Title ${i + 1}`,
    description: `This is a brief description of announcement ${i + 1}.`,
    type: i % 3 === 0 ? "new" : i % 3 === 1 ? "old" : "general",
  }));

const filters = ["All", "New", "Old"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Convert to Indian date format
const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

export default function UpdatesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 items per page

  // Calculate pagination
  const filtered = dummyData
    .filter((item) =>
      filter === "All" ? true : item.type === filter.toLowerCase()
    )
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-screen-2xl mx-auto p-6 sm:p-8">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-center text-blue-700 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Announcements
      </motion.h1>

      {/* Search Input */}
      <motion.input
        type="text"
        placeholder="Search announcements..."
        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mb-6 transition-all duration-300 hover:border-blue-300"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileFocus={{ scale: 1.01 }}
      />

      {/* Filters */}
      <motion.div
        className="flex gap-3 mb-8 justify-center flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filters.map((f) => (
          <motion.button
            key={f}
            onClick={() => {
              setFilter(f);
              setCurrentPage(1); // Reset to first page when changing filter
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {currentItems.map(({ id, date, title, description }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              className="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-xl"
              whileHover={{
                y: -4,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              {/* Date Row */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <CalendarDays className="text-blue-600 w-4 h-4" />
                <span>{formatDate(date)}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-blue-800 mb-1">{title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600">{description}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* No Data Found */}
        {filtered.length === 0 && (
          <motion.div
            className="text-center text-gray-500 py-8 col-span-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No announcements found.
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {filtered.length > itemsPerPage && (
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="flex items-center gap-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === number
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </motion.div>
      )}
    </div>
  );
}