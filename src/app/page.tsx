"use client";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, checkAuthLoading } = useAuth();
  const { brandPrimary } = useColor();
  const router = useRouter();

  useEffect(() => {
    if (!checkAuthLoading) {
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [checkAuthLoading, isAuthenticated, router]);

  return (
    <Spin
      fullscreen
      size="large"
      tip="Loading..."
      style={{ color: brandPrimary }}
    />
  );
}
