import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import LoginButton from "../components/LoginButton";
import SignInWithGoogle from "../components/SignInWithGoogle";
import { getSupabaseC } from "../lib/c-supabaseClient";

import UserSvgIcon from "../components/plasmic/ez_marketing_platform_sacanagem/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform_sacanagem/icons/PlasmicIcon__LockSvg";

// ✅ SEM SSR
const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const AntdPassword = dynamic(
  () => import("antd").then((mod) => mod.Input.Password),
  { ssr: false }
);

export default function CLogin() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin() {
    setError(null);

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error || !data.session) {
      setError("Invalid login credentials");
      return;
    }

    // ✅ ENTREGA O TOKEN PRO PLASMIC (COMPANY)
    localStorage.setItem(
      "sb-company-access-token",
      data.session.access_token
    );

    router.push("/find-a-affiliate");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://www.ezmarketing.space/find-a-affiliate",
      },
    });
  }

  return (
    <>
      <Head>
        <title>Login</title>
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
        {/* LOGO */}
        <img
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="ezmarketing"
          style={{
            width: 700,
            height: 100,
            objectFit: "contain",
            marginBottom: 25,
          }}
        />

        {/* CARD */}
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
          {/* TITLE */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Login
          </div>

          {/* FORM */}
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
              icon={<UserSvgIcon width={24} height={24} />}
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            <PasswordField
              icon={<LockSvgIcon width={24} height={24} />}
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />

            <div
              style={{
                width: 504,
                display: "flex",
                justifyContent: "flex-end",
                fontSize: 12,
              }}
            >
              <Link href="/c-reset-password">Forgot password?</Link>
            </div>
          </div>

          {/* ERROR */}
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

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <LoginButton
              onClick={handleLogin}
              isDisabled={loading}
              style={{ width: 248, height: 37 }}
            >
              {loading ? "Logging in..." : "Login"}
            </LoginButton>

            <SignInWithGoogle
              onClick={handleGoogleLogin}
              style={{ width: 248, height: 37 }}
            >
              Login with Google
            </SignInWithGoogle>
          </div>

          {/* FOOTER */}
          <div style={{ fontSize: 14 }}>
            New to Ez Marketing?{" "}
            <Link href="/c-create-account">
              <strong>Create account</strong>
            </Link>
          </div>
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
        display: "flex", // ← AQUI ESTAVA O ERRO
        alignItems: "center",
        gap: 10,
        paddingLeft: 25,
        paddingRight: 25,
        boxSizing: "border-box",
      }}
    >
      {icon}
      <AntdInput
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}

function PasswordField({
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
