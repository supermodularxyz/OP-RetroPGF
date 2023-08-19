import { useRouter } from "next/router";
import { useEffect } from "react";
import { Layout } from "~/components/Layout";

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    void router.push("/projects");
  }, [router]);

  return <Layout>redirecting...</Layout>;
}
