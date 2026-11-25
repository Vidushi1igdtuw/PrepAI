import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import {
  BookOpen,
  Search,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Code
} from 'lucide-react';

export const StudyMaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Data Structures and Algorithms',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'Programming Languages'
  ];

  useEffect(() => {
    loadMaterials();
  }, [activeCategory, searchQuery]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.getStudyMaterials(params);
      if (res.success) {
        setMaterials(res.materials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaterial = async (id) => {
    try {
      const res = await api.getStudyMaterialById(id);
      if (res.success) {
        setSelectedMaterial(res.material);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.toggleBookmark(id);
      if (res.success) {
        setMaterials(materials.map(m => m._id === id ? { ...m, isBookmarked: res.isBookmarked } : m));
        if (selectedMaterial && selectedMaterial._id === id) {
          setSelectedMaterial({ ...selectedMaterial, isBookmarked: res.isBookmarked });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleComplete = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.toggleComplete(id);
      if (res.success) {
        setMaterials(materials.map(m => m._id === id ? { ...m, isCompleted: res.isCompleted } : m));
        if (selectedMaterial && selectedMaterial._id === id) {
          setSelectedMaterial({ ...selectedMaterial, isCompleted: res.isCompleted });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6EE] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E879A9]/15 text-[#C65B89] border border-[#E879A9]/30 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Learning Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#30263A]">Study Material</h1>
          <p className="text-sm text-[#817487] mt-1">
            Structured modules covering core CS foundations, interview patterns, and high-yield cheat sheets.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#817487] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search concepts, topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#E879A9]/20 border-[#E879A9] text-[#30263A] shadow-sm'
                  : 'bg-[#FFF9FC] border-[#F1E6EE] text-[#817487] hover:text-[#30263A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#E879A9] border-t-transparent animate-spin" />
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div
              key={m._id}
              onClick={() => handleOpenMaterial(m._id)}
              className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between cursor-pointer group border border-[#F1E6EE]"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-[#C65B89]">{m.category}</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => handleToggleBookmark(e, m._id)}
                      className={`p-1 rounded-lg transition-colors ${
                        m.isBookmarked ? 'text-[#FBBF24]' : 'text-[#817487] hover:text-[#30263A]'
                      }`}
                      title={m.isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => handleToggleComplete(e, m._id)}
                      className={`p-1 rounded-lg transition-colors ${
                        m.isCompleted ? 'text-emerald-400' : 'text-[#817487] hover:text-[#30263A]'
                      }`}
                      title={m.isCompleted ? 'Completed' : 'Mark complete'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#30263A] group-hover:text-[#C65B89] transition-colors leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs text-[#817487] mt-2 line-clamp-2 leading-relaxed">
                  {m.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1E6EE] flex items-center justify-between text-xs text-[#817487]">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#E879A9]" />
                  <span>{m.readTimeMinutes} min read</span>
                </span>
                <span className="text-[#30263A] group-hover:translate-x-1 transition-transform flex items-center space-x-1 text-xs font-semibold text-[#E879A9]">
                  <span>Study</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#FFF9FC] border border-[#F1E6EE] text-[#817487]">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No study materials matched your criteria.</p>
        </div>
      )}

      {/* Reader Modal / Drawer */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#F1E6EE] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#F1E6EE] flex items-center justify-between bg-[#FFF9FC]">
              <div>
                <span className="text-xs font-bold text-[#C65B89] uppercase tracking-wider">
                  {selectedMaterial.category} • {selectedMaterial.topic}
                </span>
                <h2 className="text-xl font-bold text-[#30263A] mt-1">{selectedMaterial.title}</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => handleToggleBookmark(e, selectedMaterial._id)}
                  className={`p-2 rounded-xl border border-[#F1E6EE] text-xs flex items-center space-x-1.5 ${
                    selectedMaterial.isBookmarked ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : 'text-[#817487] hover:text-[#30263A]'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>{selectedMaterial.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <button
                  onClick={(e) => handleToggleComplete(e, selectedMaterial._id)}
                  className={`p-2 rounded-xl border border-[#F1E6EE] text-xs flex items-center space-x-1.5 ${
                    selectedMaterial.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'text-[#817487] hover:text-[#30263A]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedMaterial.isCompleted ? 'Completed' : 'Mark Completed'}</span>
                </button>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="p-2 rounded-xl text-[#817487] hover:text-[#30263A] hover:bg-[#FCE7F3]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="p-4 rounded-xl bg-[#FFF9FC] border border-[#F1E6EE]">
                <h4 className="text-xs font-bold text-[#E879A9] uppercase mb-1">Key Takeaways</h4>
                <ul className="space-y-1 text-xs text-[#817487]">
                  {selectedMaterial.keyTakeaways?.map((kt, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-[#E879A9]">•</span>
                      <span>{kt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#F1E6EE] pt-6">
                <MarkdownRenderer content={selectedMaterial.content} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
