import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import LandingView from "./LandingView";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("[Home] Gagal memuat session user:", error);
  }

  // Ambil session data yang aman
  const userData = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  } : undefined;

  return (
    <LandingView user={userData} />
  );
}
