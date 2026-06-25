"use client";

import { useState, useEffect } from "react";
import { Plus, Users, AlertTriangle, CheckCircle2, Trash2, Search } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";
import InjectVotesForm from "@/components/admin/InjectVotesForm";

export default function AdminNomineesPage() {
  const supabase = createClient();
  
  // State for data
  const [nominations, setNominations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [contestants, setContestants] = useState<any[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // RBAC: resolved from the active session on mount
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Form State
  const [isExisting, setIsExisting] = useState(false);
  const [selectedContestantId, setSelectedContestantId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [levelDept, setLevelDept] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [campaignQuote, setCampaignQuote] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNominations = nominations.filter((nom) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const contestantName = nom.contestants?.name?.toLowerCase() || "";
    const categoryName = nom.categories?.name?.toLowerCase() || "";
    return contestantName.includes(term) || categoryName.includes(term);
  });

  const fetchData = async () => {
    setIsLoading(true);

    // Resolve superadmin status from the live session on every data refresh
    const { data: { user } } = await supabase.auth.getUser();
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    setIsSuperAdmin(!!user && !!superAdminEmail && user.email === superAdminEmail);

    
    // Fetch categories for dropdown
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });
      
    if (catData) setCategories(catData);

    // Fetch existing contestants for combobox
    const { data: contestantsData } = await supabase
      .from("contestants")
      .select("*")
      .order("name", { ascending: true });
    
    if (contestantsData) setContestants(contestantsData);

    // Fetch nominations joined with contestants and categories
    const { data: nomData } = await supabase
      .from("nominations")
      .select(`
        *,
        contestants (*),
        categories (name)
      `)
      .order("created_at", { ascending: false });

    if (nomData) setNominations(nomData);
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteNomination = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this nomination? This action cannot be undone.")) return;
    
    setIsLoading(true);
    const { error } = await supabase.from("nominations").delete().eq("id", id);
    if (error) {
      alert(`Failed to delete nomination: ${error.message}`);
    }
    fetchData();
  };

  const handleAddNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    if (!categoryId) {
      setMessage({ type: "error", text: "Please select a category." });
      setIsSubmitting(false);
      return;
    }

    let targetContestantId = selectedContestantId;

    if (!isExisting) {
      // Upload Image if present
      let uploadedImageUrl = "";
      if (imageFile) {
        setMessage({ type: "success", text: "Uploading image..." });
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
          
        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // Action 1: INSERT into contestants
      const { data: contestantData, error: contestantError } = await supabase
        .from("contestants")
        .insert([
          {
            name,
            slug,
            level_dept: levelDept,
            image_url: uploadedImageUrl,
            campaign_quote: campaignQuote
          }
        ])
        .select()
        .single();

      if (contestantError) {
        setMessage({ type: "error", text: `Contestant creation failed: ${contestantError.message}` });
        setIsSubmitting(false);
        return;
      }
      
      targetContestantId = contestantData.id;
    }

    if (!targetContestantId) {
      setMessage({ type: "error", text: "Please select an existing student or create a new one." });
      setIsSubmitting(false);
      return;
    }

    // Action 2: INSERT into nominations
    const { error: nominationError } = await supabase
      .from("nominations")
      .insert([
        {
          contestant_id: targetContestantId,
          category_id: categoryId,
          current_votes: 0
        }
      ]);

    setIsSubmitting(false);

    if (nominationError) {
      setMessage({ type: "error", text: `Nomination linking failed: ${nominationError.message}` });
    } else {
      setMessage({ type: "success", text: "Nominee successfully added to category!" });
      
      // Reset form
      setName("");
      setSlug("");
      setLevelDept("");
      setImageFile(null);
      setCampaignQuote("");
      setCategoryId("");
      setSelectedContestantId("");
      setIsExisting(false);
      
      // Refresh table
      fetchData();
    }
  };

  // Helper to auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  return (
    <>
      <main className=" max-w-2xl lg:max-w-6xl mx-auto px-4 pt-4">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Nominee Management
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Add contestants and link them to award categories.
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-nacos-green/10 flex items-center justify-center">
              <Plus size={16} className="text-nacos-green" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              Add New Nominee
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

          <div className="flex items-center gap-4 mb-6  border-b border-gray-50">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-body font-medium text-gray-700">
              <input
                type="radio"
                checked={!isExisting}
                onChange={() => setIsExisting(false)}
                className="w-4 h-4 text-nacos-green focus:ring-nacos-green"
              />
              Create New Student
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-body font-medium text-gray-700">
              <input
                type="radio"
                checked={isExisting}
                onChange={() => setIsExisting(true)}
                className="w-4 h-4 text-nacos-green focus:ring-nacos-green"
              />
              Select Existing Profile
            </label>
          </div>

          <form onSubmit={handleAddNominee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {isExisting ? (
                <div>
                  <label htmlFor="existingContestant" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    id="existingContestant"
                    value={selectedContestantId}
                    onChange={(e) => setSelectedContestantId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all appearance-none"
                    style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                  >
                    <option value="" disabled>Choose a student</option>
                    {contestants.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="e.g., David Olamide"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                      Slug (URL string)
                    </label>
                    <input
                      id="slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., david-olamide"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                    />
                  </div>

                  <div>
                    <label htmlFor="levelDept" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                      Level & Department
                    </label>
                    <select
                      id="levelDept"
                      value={levelDept}
                      onChange={(e) => setLevelDept(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all appearance-none"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
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
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="categoryId" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                  Award Category
                </label>
                <select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all appearance-none"
                  style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {!isExisting && (
                <>
                  <div>
                    <label htmlFor="imageFile" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                      Nominee Photo
                    </label>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nacos-green/10 file:text-nacos-green hover:file:bg-nacos-green/20"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                    />
                  </div>

                  <div>
                    <label htmlFor="campaignQuote" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                      Campaign Quote
                    </label>
                    <textarea
                      id="campaignQuote"
                      value={campaignQuote}
                      onChange={(e) => setCampaignQuote(e.target.value)}
                      placeholder="A short quote from the nominee..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all resize-none"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit Button spanning full width */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-nacos-green/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                {isSubmitting ? "Adding Nominee..." : "Add Nominee"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Nominees List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6  border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users size={16} className="text-gray-600" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900 text-lg">
                  Active Nominations
                </h2>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  All contestants currently assigned to categories
                </p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
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
                    Nominee
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Current Votes
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm font-body">
                      Loading nominations...
                    </td>
                  </tr>
                ) : nominations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm font-body">
                      No nominations found.
                    </td>
                  </tr>
                ) : filteredNominations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm font-body">
                      No results found for your search.
                    </td>
                  </tr>
                ) : (
                  filteredNominations.map((nom) => {
                    const contestant = nom.contestants || {};
                    const categoryName = nom.categories?.name || "Unknown Category";
                    
                    return (
                      <tr key={nom.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                              {contestant.image_url ? (
                                <img src={contestant.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xs font-heading">
                                  {contestant.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-gray-900 text-[14px] truncate">
                                {contestant.name}
                              </p>
                              <p className="text-[12px] text-gray-400 font-body truncate">
                                {contestant.level_dept || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-body text-gray-700 text-[13px]">
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right hidden sm:table-cell">
                          <span className="font-heading font-bold text-nacos-green text-[14px]">
                            {nom.current_votes || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => handleDeleteNomination(nom.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Nomination"
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* Superadmin-only: dummy vote injection */}
                            {isSuperAdmin && (
                              <InjectVotesForm
                                nominationId={nom.id}
                                nomineeName={contestant.name || "Unknown"}
                                onSuccess={fetchData}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
