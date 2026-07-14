import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  LogOut,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ShieldCheck,
  Calendar,
  Trophy,
  FileText,
  Plus,
  Save,
  Pencil,
  DownloadCloud,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  importGallery,
  importEvents,
  importAchievements,
  importAlumni,
  seedAbout,
} from "@/lib/admin-seed";
import type { EventDoc, AchievementDoc, AlumniDoc, AboutContent } from "@/lib/admin-content";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Newton EM School" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "gallery" | "events" | "achievements" | "alumni" | "about";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "events", label: "Events", icon: Calendar },
  { key: "achievements", label: "Achievements", icon: Trophy },
  { key: "alumni", label: "Alumni", icon: Users },
  { key: "about", label: "About", icon: FileText },
];

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAdminAuth();
  const [tab, setTab] = useState<TabKey>("gallery");

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/admin/login" });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <SiteShell>
        <div className="container-page min-h-[60vh] grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container-page pt-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Console
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
              Welcome back.
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Signed in as <span className="font-medium text-ink">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={async () => {
              await signOut(auth);
              navigate({ to: "/admin/login" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-24">
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "events" && <EventsAdmin />}
        {tab === "achievements" && <AchievementsAdmin />}
        {tab === "alumni" && <AlumniAdmin />}
        {tab === "about" && <AboutAdmin />}
      </section>
    </SiteShell>
  );
}

/* ---------------- GALLERY ---------------- */

type GalleryDoc = {
  id: string;
  url: string;
  title: string;
  category: string;
  publicId?: string;
};
const GALLERY_CATS = ["Festivals", "Events", "School", "Activities"];

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryDoc[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GALLERY_CATS[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryDoc, "id">) }))),
    );
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Please choose an image.");
    if (!title.trim()) return setError("Please add a title.");
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      await addDoc(collection(db, "gallery"), {
        url: result.secure_url,
        publicId: result.public_id,
        title: title.trim(),
        category,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await deleteDoc(doc(db, "gallery", id));
  }

  return (
    <>
      <form onSubmit={handleUpload} className="rounded-3xl border border-border bg-card p-6 sm:p-8 mt-6">
        <h2 className="font-display text-2xl text-ink">Upload a new image</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Title (e.g. Annual Day 2025)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {GALLERY_CATS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
          />
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </form>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3 mb-6">
        <h2 className="font-display text-2xl text-ink">Gallery items ({items.length})</h2>
        <div className="flex items-center gap-3">
          <ImportButton importer={importGallery} label="Import website gallery" />
          <Link to="/gallery" className="text-sm font-semibold text-primary hover:underline">
            View public gallery →
          </Link>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={ImageIcon} text="No images yet — upload your first above." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card">
              <img src={it.url} alt={it.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="p-4">
                <p className="font-display text-lg text-ink truncate">{it.title}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{it.category}</p>
              </div>
              <button
                onClick={() => handleDelete(it.id)}
                className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-ivory opacity-100 sm:opacity-0 group-hover:opacity-100 transition hover:bg-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- EVENTS ---------------- */

function EventsAdmin() {
  const [items, setItems] = useState<EventDoc[]>([]);
  const [editing, setEditing] = useState<EventDoc | null>(null);
  const [form, setForm] = useState({ title: "", date: "", place: "", desc: "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EventDoc, "id">) }))),
    );
  }, []);

  function resetForm() {
    setEditing(null);
    setForm({ title: "", date: "", place: "", desc: "" });
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(ev: EventDoc) {
    setEditing(ev);
    setForm({ title: ev.title, date: ev.date, place: ev.place, desc: ev.desc });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError("Title is required.");
    setUploading(true);
    try {
      const file = fileRef.current?.files?.[0];
      let imageUrl = editing?.imageUrl;
      let publicId = editing?.publicId;
      if (file) {
        const r = await uploadToCloudinary(file);
        imageUrl = r.secure_url;
        publicId = r.public_id;
      }
      const payload = {
        title: form.title.trim(),
        date: form.date.trim(),
        place: form.place.trim(),
        desc: form.desc.trim(),
        imageUrl: imageUrl ?? null,
        publicId: publicId ?? null,
      };
      if (editing) {
        await updateDoc(doc(db, "events", editing.id), payload);
      } else {
        await addDoc(collection(db, "events"), { ...payload, createdAt: serverTimestamp() });
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    if (editing?.id === id) resetForm();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 mt-6">
        <h2 className="font-display text-2xl text-ink">
          {editing ? "Edit event" : "Add a new event"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text" placeholder="Event title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text" placeholder="Date (e.g. 15 Dec 2025)" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text" placeholder="Location" value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            ref={fileRef} type="file" accept="image/*"
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
          />
          <textarea
            placeholder="Description" value={form.desc} rows={3}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit" disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {uploading ? "Saving..." : editing ? "Save changes" : "Add event"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-accent">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Events ({items.length})</h2>
        <ImportButton importer={importEvents} label="Import website events" />
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Calendar} text="No events yet — add your first above." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((ev) => (
            <div key={ev.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {ev.imageUrl && (
                <img src={ev.imageUrl} alt={ev.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              )}
              <div className="p-5">
                <p className="text-xs text-muted-foreground">{ev.date} · {ev.place}</p>
                <h3 className="mt-1 font-display text-lg text-ink">{ev.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{ev.desc}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => startEdit(ev)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(ev.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------- ACHIEVEMENTS ---------------- */

function AchievementsAdmin() {
  const [items, setItems] = useState<AchievementDoc[]>([]);
  const [editing, setEditing] = useState<AchievementDoc | null>(null);
  const [form, setForm] = useState({ year: "2024-25", title: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AchievementDoc, "id">) }))),
    );
  }, []);

  function resetForm() {
    setEditing(null);
    setForm({ year: "2024-25", title: "", text: "" });
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(a: AchievementDoc) {
    setEditing(a);
    setForm({ year: a.year, title: a.title, text: a.text });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.year.trim()) return;
    setBusy(true);
    try {
      const file = fileRef.current?.files?.[0];
      let imageUrl = editing?.imageUrl;
      let publicId = editing?.publicId;
      if (file) {
        const r = await uploadToCloudinary(file);
        imageUrl = r.secure_url;
        publicId = r.public_id;
      }
      const payload = {
        year: form.year.trim(),
        title: form.title.trim(),
        text: form.text.trim(),
        imageUrl: imageUrl ?? null,
        publicId: publicId ?? null,
      };
      if (editing) await updateDoc(doc(db, "achievements", editing.id), payload);
      else await addDoc(collection(db, "achievements"), { ...payload, createdAt: serverTimestamp() });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return;
    await deleteDoc(doc(db, "achievements", id));
    if (editing?.id === id) resetForm();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 mt-6">
        <h2 className="font-display text-2xl text-ink">
          {editing ? "Edit achievement" : "Add an achievement"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-[150px_1fr]">
          <input
            type="text" placeholder="Year" value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text" placeholder="Title (e.g. 100% pass in 10ᵗʰ Class)" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            placeholder="Description" value={form.text} rows={3}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Image (optional)
            </label>
            <input
              ref={fileRef} type="file" accept="image/*"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
            />
            {editing?.imageUrl && (
              <p className="mt-2 text-xs text-muted-foreground">
                Current image will be kept unless you choose a new one.
              </p>
            )}
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editing ? "Save changes" : "Add"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm}
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-accent">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Achievements ({items.length})</h2>
        <ImportButton importer={importAchievements} label="Import website achievements" />
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Trophy} text="No achievements yet — add your first above." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {a.imageUrl && (
                <img src={a.imageUrl} alt={a.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              )}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{a.year}</p>
                <h3 className="mt-2 font-display text-lg text-ink">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => startEdit(a)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


/* ---------------- ABOUT ---------------- */

function AboutAdmin() {
  const [form, setForm] = useState<AboutContent>(seedAbout);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "content", "about"));
      if (snap.exists()) {
        const data = snap.data() as AboutContent;
        setForm((prev) => ({ ...prev, ...data }));
      }
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "content", "about"), form, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-10 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 mt-6">
      <h2 className="font-display text-2xl text-ink">Edit About page content</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Leave blank to keep default text. Saved values override the public page.
      </p>
      <div className="mt-6 grid gap-5">
        <Field label="Mission statement">
          <textarea rows={3} value={form.mission ?? ""}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
        <Field label="Vision statement">
          <textarea rows={3} value={form.vision ?? ""}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
        <Field label="Principal's quote">
          <textarea rows={3} value={form.principalQuote ?? ""}
            onChange={(e) => setForm({ ...form, principalQuote: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
        <Field label="Principal / administration bio">
          <textarea rows={3} value={form.principalBio ?? ""}
            onChange={(e) => setForm({ ...form, principalBio: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button type="submit" disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
        {saved && <span className="text-sm text-primary font-medium">Saved ✓</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ImportButton({
  importer,
  label,
}: {
  importer: () => Promise<{ added?: number; skipped: boolean }>;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function run() {
    if (!confirm(`${label}? This adds the existing website content to your database (only if empty).`)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await importer();
      setMsg(res.skipped ? "Already has content — skipped." : `Imported ${res.added ?? ""} items.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }
  return (
    <div className="flex items-center gap-3">
      {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DownloadCloud className="h-3.5 w-3.5" />}
        {label}
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border p-8 sm:p-16 text-center text-muted-foreground">
      <Icon className="mx-auto h-10 w-10 mb-3 opacity-60" />
      {text}
    </div>
  );
}

/* ---------------- ALUMNI ---------------- */
function AlumniAdmin() {
  const [items, setItems] = useState<AlumniDoc[]>([]);
  const [name, setName] = useState("");
  const [where, setWhere] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "alumni"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AlumniDoc, "id">) }))),
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Name is required.");
    if (!where.trim()) return setError("Where/Company/College is required.");
    if (!note.trim()) return setError("Job/Note is required.");
    
    setBusy(true);
    try {
      await addDoc(collection(db, "alumni"), {
        name: name.trim(),
        where: where.trim(),
        note: note.trim(),
        createdAt: serverTimestamp(),
      });
      setName("");
      setWhere("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this alumnus?")) return;
    await deleteDoc(doc(db, "alumni", id));
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 mt-6">
        <h2 className="font-display text-2xl text-ink">Add a new alumnus</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Alumnus Name (e.g. R. Pavani)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Where they are (e.g. Google, Hyderabad)"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Note/Job Title (e.g. Software Engineer)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-5">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Alumnus
          </button>
        </div>
      </form>

      <div className="mt-10 mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Alumni ({items.length})</h2>
        <ImportButton importer={importAlumni} label="Import default alumni" />
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Users} text="No alumni in database yet — click import or add one above." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="relative rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-display text-xl text-ink leading-tight">{it.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.note}</p>
              <p className="mt-1 text-sm text-primary font-medium">{it.where}</p>
              <button
                onClick={() => handleDelete(it.id)}
                className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
