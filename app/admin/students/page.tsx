"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Users, AlertTriangle, CheckCircle2, Save, Search } from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function AdminStudentsPage() {
  const supabase = createClient();
  
  // Data
  const [contestants, setContestants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [levelDept, setLevelDept] = useState("");
  const [campaignQuote, setCampaignQuote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContestants = contestants.filter((student) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.level_dept?.toLowerCase().includes(term)
    );
  });

  const fetchContestants = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("contestants")
      .select("*")
      .order("name", { ascending: true });
    
    if (data) setContestants(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContestants();
  }, []);

  const handleEditClick = (student: any) => {
    setEditingId(student.id);
    setName(student.name);
    setSlug(student.slug);
    setLevelDept(student.level_dept || "");
    setCampaignQuote(student.campaign_quote || "");
    setCurrentImageUrl(student.image_url || "");
    setImageFile(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setLevelDept("");
    setCampaignQuote("");
    setCurrentImageUrl("");
    setImageFile(null);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: Are you sure you want to delete this student? This action will instantly CASCADE and remove ALL their active nominations and votes across every category. This cannot be undone!")) return;
    
    setIsLoading(true);
    const { error } = await supabase.from("contestants").delete().eq("id", id);
    if (error) {
      alert(`Failed to delete student: ${error.message}`);
    } else {
      fetchContestants();
      if (editingId === id) handleCancelEdit();
    }
    setIsLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setMessage(null);
    setIsSubmitting(true);

    let updatedImageUrl = currentImageUrl;

    // Upload new image if present
    if (imageFile) {
      setMessage({ type: "success", text: "Uploading new photo..." });
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("nominee_images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage({ type: "error", text: `Image upload failed: ${uploadError.message}` });
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("nominee_images")
        .getPublicUrl(uploadData.path);
        
      updatedImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("contestants")
      .update({
        name,
        slug,
        level_dept: levelDept,
        campaign_quote: campaignQuote,
        image_url: updatedImageUrl
      })
      .eq("id", editingId);

    setIsSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: `Failed to update student: ${error.message}` });
    } else {
      setMessage({ type: "success", text: "Student profile updated successfully!" });
      fetchContestants();
      handleCancelEdit();
    }
  };

  return (
    <>
      <TopAppBar isAdmin />
      <main className=" max-w-2xl lg:max-w-6xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Students Roster
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Manage the core student profiles (contestants).
          </p>
        </div>

        {/* Edit Form */}
        {editingId && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
              <div className="w-8 h-8 rounded-lg bg-nacos-gold/10 flex items-center justify-center">
                <Edit2 size={16} className="text-nacos-gold" />
              </div>
              <h2 className="font-heading font-bold text-lg text-gray-900">
                Edit Student Profile
              </h2>
            </div>

            {message && (
              <div
                className={`mb-5 px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-body ${
                  message.type === "success"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-red-50 border-red-100 text-red-600"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="flex-shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">Level & Department</label>
                  <select
                    value={levelDept}
                    onChange={(e) => setLevelDept(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all appearance-none"
                  >
                    <option value="" disabled>Select Level/Dept</option>
                    <option value="ND1">ND1</option>
                    <option value="ND2">ND2</option>
                    <option value="HND1(AI)">HND1(AI)</option>
                    <option value="HND1(NCC)">HND1(NCC)</option>
                    <option value="HND2(AI)">HND2(AI)</option>
                    <option value="HND2(NCC)">HND2(NCC)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">Campaign Quote</label>
                  <textarea
                    value={campaignQuote}
                    onChange={(e) => setCampaignQuote(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">Update Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nacos-green/10 file:text-nacos-green hover:file:bg-nacos-green/20"
                  />
                  {currentImageUrl && !imageFile && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 font-body">
                      <img src={currentImageUrl} alt="Current" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                      <span>Current photo active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-nacos-gold hover:bg-yellow-600 text-white font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md disabled:opacity-60"
                >
                  <Save size={16} />
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="px-6 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6  border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users size={16} className="text-gray-600" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900 text-lg">
                  All Students
                </h2>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  Core database profiles for all contestants
                </p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Slug
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm font-body">
                      Loading students...
                    </td>
                  </tr>
                ) : contestants.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm font-body">
                      No students found.
                    </td>
                  </tr>
                ) : filteredContestants.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 text-sm font-body">
                      No results found for your search.
                    </td>
                  </tr>
                ) : (
                  filteredContestants.map((student) => (
                    <tr key={student.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === student.id ? 'bg-gray-50/80' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                            {student.image_url ? (
                              <img src={student.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xs font-heading">
                                {student.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-gray-900 text-[14px] truncate">
                              {student.name}
                            </p>
                            <p className="text-[12px] text-gray-400 font-body truncate">
                              {student.level_dept || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-body text-gray-500 text-[13px] bg-gray-100 px-2 py-1 rounded-md">
                          /{student.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(student)}
                            className={`transition-colors ${editingId === student.id ? 'text-nacos-gold' : 'text-gray-400 hover:text-nacos-gold'}`}
                            title="Edit Student"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
