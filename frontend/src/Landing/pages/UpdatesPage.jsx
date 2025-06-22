import { useState } from "react";
import { CalendarDays } from "lucide-react"; // Professional icon
import { motion, AnimatePresence } from "framer-motion";

const dummyData = Array(5)
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

export default function UpdatesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = dummyData
    .filter((item) =>
      filter === "All" ? true : item.type === filter.toLowerCase()
    )
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-screen-2xl mx-auto p-8"> {/* Increased width */}
      <motion.h1 
        className="text-4xl font-bold text-center text-blue-700 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Announcements
      </motion.h1>

      {/* Search */}
      <motion.input
        type="text"
        placeholder="Search announcements..."
        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mb-6 transition-all duration-300 hover:border-blue-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileFocus={{ scale: 1.01 }}
      />

      {/* Filters */}
      <motion.div 
        className="flex gap-3 mb-6 justify-center flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filters.map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
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

      {/* List */}
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {filtered.map(({ id, date, title, description }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              className="flex items-start gap-4 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white"
              whileHover={{ 
                y: -4,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="flex flex-col items-center text-blue-700"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarDays className="w-6 h-6 mb-1" />
                <span className="text-xs">{date}</span>
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div 
            className="text-center text-gray-500 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No announcements found.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
