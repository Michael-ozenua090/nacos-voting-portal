"use client";

import { useState, useEffect } from "react";
import { Plus, List, AlertTriangle, CheckCircle2, Edit2, Trash2, Search } from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import { createClient } from "@/utils/supabase/client";

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(term) ||
      cat.description?.toLowerCase().includes(term)
    );
  });

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Feedback State
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCategories(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    if (editingCategoryId) {
      const { error } = await supabase
        .from("categories")
        .update({ name, description })
        .eq("id", editingCategoryId);

      setIsSubmitting(false);

      if (error) {
        setMessage({ type: "error", text: error.message || "Failed to update category." });
      } else {
        setMessage({ type: "success", text: "Category updated successfully!" });
        setName("");
        setDescription("");
        setEditingCategoryId(null);
        fetchCategories();
      }
    } else {
      const { error } = await supabase.from("categories").insert([
        { name, description }
      ]);

      setIsSubmitting(false);

      if (error) {
        setMessage({ type: "error", text: error.message || "Failed to create category." });
      } else {
        setMessage({ type: "success", text: "Category created successfully!" });
        setName("");
        setDescription("");
        fetchCategories();
      }
    }
  };

  const handleEditClick = (cat: any) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
    
    setIsLoading(true);
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert(`Failed to delete category: ${error.message}`);
    } else {
      fetchCategories();
    }
  };

  return (
    <>
      <TopAppBar isAdmin />
      <main className="pb-24 md:pb-8 max-w-2xl lg:max-w-4xl mx-auto px-4 pt-4">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Create and manage award categories.
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-nacos-green/10 flex items-center justify-center">
              <Plus size={16} className="text-nacos-green" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900">
              {editingCategoryId ? "Edit Category" : "Create New Category"}
            </h2>
          </div>

          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-body ${
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                Category Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tech Bro of the Year"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the award..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all resize-none"
                style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-nacos-green/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {editingCategoryId ? <Edit2 size={16} /> : <Plus size={16} />}
                {isSubmitting ? (editingCategoryId ? "Updating..." : "Creating...") : (editingCategoryId ? "Update Category" : "Create Category")}
              </button>
              {editingCategoryId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setName("");
                    setDescription("");
                    setMessage(null);
                  }}
                  className="px-6 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <List size={16} className="text-gray-600" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-900 text-lg">
                  Existing Categories
                </h2>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  All currently active award categories
                </p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
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
                    Category Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Description
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
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm font-body">
                      No categories found. Create one above!
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 text-sm font-body">
                      No results found for your search.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-heading font-bold text-gray-900 text-[14px]">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-body text-gray-500 text-[13px]">
                          {cat.description || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="text-gray-400 hover:text-nacos-green transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Category"
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
      <AdminBottomNav />
    </>
  );
}
