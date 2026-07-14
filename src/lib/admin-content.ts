import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type EventDoc = {
  id: string;
  title: string;
  date: string;
  place: string;
  desc: string;
  imageUrl?: string;
  publicId?: string;
  createdAt?: { seconds: number } | null;
};

export type AchievementDoc = {
  id: string;
  year: string;
  title: string;
  text: string;
  imageUrl?: string;
  publicId?: string;
  createdAt?: { seconds: number } | null;
};

export type AlumniDoc = {
  id: string;
  name: string;
  where: string;
  note: string;
  createdAt?: { seconds: number } | null;
};


export type AboutContent = {
  mission?: string;
  vision?: string;
  principalQuote?: string;
  principalBio?: string;
};

export function useCollection<T>(name: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, name), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [name]);
  return { items, loading };
}

export function useAboutContent() {
  const [data, setData] = useState<AboutContent | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "content", "about"), (snap) => {
      setData((snap.data() as AboutContent) ?? {});
    });
    return () => unsub();
  }, []);
  return data;
}
