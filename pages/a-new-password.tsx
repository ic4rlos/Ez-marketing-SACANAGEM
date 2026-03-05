import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import LoginButton from "../components/LoginButton";
import { getSupabaseA } from "../lib/a-supabaseClient";

import LockSvgIcon from "../components/plasmic/ez_marketing_platform_sacanagem/icons/PlasmicIcon__LockSvg";

// ✅ SEM SSR — PADRÃO JÁ FUNCIONAL
const AntdPassword = dynamic(
  () => import("antd").then((mod) => mod.Input.Password),
  { ssr: false }
);

export default function ANewPassword() {
  const router = useRouter();
  const supabase = getSupabaseA();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSaveNewPassword() {
    setError(null);

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error || !data.user) {
      setError(error?.message || "Failed to update password");
      return;
    }

    // ✅ PEGA A SESSÃO ATUAL (ELA EXISTE NESSE PONTO)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      localStorage.setItem(
        "sb-agency-access-token",
        session.access_token
      );
    }

    // ✅ REDIRECT NORMAL
    router.push("/a-find-a-business");
  }

  return (
    <>
      <Head>
        <title>Create a new password</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "#d9d9d9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/plasmic/ez_marketing_platform_sacanagem/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            height: 100,
            objectFit: "contain",
            marginBottom: 25,
          }}
        />

        <div
          style={{
            width: 800,
            height: 547,
            background: "#ffffff",
            borderRadius: 51,
            padding: "65px 100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Create a new password
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              placeholder="New password"
              value={password}
              onChange={setPassword}
            />

            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: 12,
                color: "red",
                fontStyle: "italic",
              }}
            >
              {error}
            </div>
          )}

          <LoginButton
            onClick={handleSaveNewPassword}
            isDisabled={loading}
            style={{ width: 248, height: 37 }}
          >
            {loading ? "Saving..." : "Save new password"}
          </LoginButton>
        </div>
      </div>
    </>
  );
}

/* ===== FIELD ===== */

function Field({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        width: 504,
        height: 32,
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingLeft: 25,
        paddingRight: 25,
        boxSizing: "border-box",
      }}
    >
      {icon}
      <AntdPassword
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}
