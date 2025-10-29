"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Merchant = {
  id: number;
  name: string;
  business_registration_number: string;
  email: string;
  phone: string;
  status: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function MerchantDashboard() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [form, setForm] = useState({
    name: "",
    business_registration_number: "",
    email: "",
    phone: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Merchant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Merchant | null>(null);

  const fetchMerchants = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/merchant/`);
      const data = await res.json();
      setMerchants(data.results || data);
    } catch (err) {
      console.error("Error fetching merchants:", err);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/merchant/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({
          name: "",
          business_registration_number: "",
          email: "",
          phone: "",
          status: "Pending",
        });
        fetchMerchants();
      }
    } catch (err) {
      console.error("Error creating merchant:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editing) return;
    const res = await fetch(`${API_BASE}/api/merchant/${editing.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setEditing(null);
      fetchMerchants();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE}/api/merchant/${id}/`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchMerchants();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700 animate-pulse";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-12 tracking-tight">
          Merchant Management Dashboard
        </h1>

        {/* Create Merchant Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-12 border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Add New Merchant
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4 text-gray-800"
          >
            <Input
              placeholder="Merchant Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Business Registration Number"
              value={form.business_registration_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  business_registration_number: e.target.value,
                })
              }
              required
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>Pending</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>

            <Button
              type="submit"
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Adding..." : "Add Merchant"}
            </Button>
          </form>
        </div>

        {/* Merchant Cards */}
        {merchants.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No merchants found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchants?.map((m) => (
              <div
                key={m.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all border border-gray-100 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {m.name}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      m.status
                    )}`}
                  >
                    {m.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">BRN:</span>{" "}
                    {m.business_registration_number}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {m.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {m.phone}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(m)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDelete(m)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Merchant</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
                <Input
                  value={editing.business_registration_number}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      business_registration_number: e.target.value,
                    })
                  }
                />
                <Input
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
                <Input
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                >
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
                <Button
                  onClick={handleEditSave}
                  className="w-full bg-blue-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Merchant</DialogTitle>
            </DialogHeader>
            {confirmDelete && (
              <div className="space-y-4">
                <p className="text-sm">
                  Are you sure you want to delete{" "}
                  <strong>{confirmDelete.name}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDelete(confirmDelete.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
