"use client";

import { useState, useEffect } from "react";
import { Users, Upload, Search, Filter, Loader2, MessageSquare, CheckCircle2, XCircle, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string | null;
  phone: string;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  createdAt: string;
}

export function ContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) setContacts(await res.json());
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleImport = async () => {
    if (!csvContent.trim()) {
      toast.error("Please paste CSV content first.");
      return;
    }

    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
      });
      if (res.ok) {
        const { count } = await res.json();
        toast.success(`Successfully imported ${count} contacts.`);
        setIsImportOpen(false);
        setCsvContent("");
        fetchContacts();
      } else {
        const err = await res.text();
        toast.error(err || "Failed to import contacts");
      }
    } catch (error) {
      toast.error("An error occurred during import");
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8792a2] mb-1">Audience</p>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1f36]">Contacts</h1>
          <p className="text-sm text-[#8792a2] mt-1">Manage your guests and customers for direct messaging campaigns.</p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2d6a4f] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-[#2d6a4f]/20 transition-all active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" /> Import CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Contacts", value: contacts.length, icon: Users, color: "#2d6a4f", bg: "#f0eeff" },
          { label: "WhatsApp Opt-in", value: contacts.filter(c => c.whatsappOptIn).length, icon: MessageSquare, color: "#25D366", bg: "#e6f8ed" },
          { label: "SMS Opt-in", value: contacts.filter(c => c.smsOptIn).length, icon: CheckCircle2, color: "#09825d", bg: "#efffee" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e3e8ef] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8792a2] tracking-wider uppercase">{stat.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a1f36]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table & Filtering */}
      <div className="bg-white border border-[#e3e8ef] rounded-xl shadow-[0_1px_3px_rgba(60,66,87,0.05)] overflow-hidden">
        <div className="p-4 border-b border-[#f0f3f7] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8792a2]" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f6f9fc] border-none rounded-lg focus:ring-2 focus:ring-[#2d6a4f]/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 text-[#8792a2] hover:bg-[#f6f9fc] rounded-lg">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-[#2d6a4f] animate-spin" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#8792a2]">
                No contacts found matching your search.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#fcfdfe] text-left text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">WhatsApp</th>
                  <th className="px-6 py-4">SMS</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f7]">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#fcfdfe] transition-colors">
                    <td className="px-6 py-4">
                       <p className="text-sm font-semibold text-[#1a1f36]">{contact.name || "Unknown Guest"}</p>
                       <p className="text-[11px] text-[#8792a2]">Added {new Date(contact.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3c4257]">{contact.phone}</td>
                    <td className="px-6 py-4">
                       {contact.whatsappOptIn ? (
                           <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#25D366]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" /> Opt-in
                           </span>
                       ) : (
                           <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8792a2]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#e3e8ef]" /> No
                           </span>
                       )}
                    </td>
                    <td className="px-6 py-4">
                        {contact.smsOptIn ? (
                           <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#09825d]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#09825d]" /> Opt-in
                           </span>
                       ) : (
                           <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8792a2]">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#e3e8ef]" /> No
                           </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-1.5 text-[#8792a2] hover:text-[#1a1f36] hover:bg-[#f0f3f7] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setIsImportOpen(false)} />
              <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-[#f0f3f7]">
                      <h2 className="text-xl font-bold text-[#1a1f36]">Import Contacts</h2>
                      <p className="text-sm text-[#8792a2] mt-1">Paste your CSV content below. Requires 'phone' and 'name' columns.</p>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="bg-[#f0eeff] rounded-xl p-4 border border-[#2d6a4f]/10">
                          <p className="text-xs font-semibold text-[#2d6a4f] mb-1">Example Format:</p>
                          <code className="text-[11px] text-[#3c4257]">name, phone<br />John Doe, +1234567890<br />Jane Smith, +0987654321</code>
                      </div>
                      <textarea
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        placeholder="Paste CSV here..."
                        className="w-full h-48 p-4 bg-[#f6f9fc] rounded-xl border border-[#e3e8ef] focus:bg-white focus:border-[#2d6a4f] focus:ring-4 focus:ring-[#2d6a4f]/10 outline-none transition-all resize-none text-sm"
                      />
                  </div>
                  <div className="p-6 bg-[#fcfdfe] border-t border-[#f0f3f7] flex justify-end gap-3">
                      <button 
                        onClick={() => setIsImportOpen(false)}
                        className="px-4 py-2 text-sm font-semibold text-[#475467] hover:text-[#1a1f36]"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleImport}
                        className="px-6 py-2 bg-[#2d6a4f] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-[#2d6a4f]/20 active:scale-[0.98] transition-all"
                      >
                        Start Import
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
