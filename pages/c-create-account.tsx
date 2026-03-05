import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { getSupabaseC } from "../lib/c-supabaseClient";

const AntdInput = dynamic(
  () => import("../components/ui/AntdInput"),
  { ssr: false }
);

const LoginButton = dynamic(
  () => import("../components/LoginButton"),
  { ssr: false }
);

const SignInWithGoogle = dynamic(
  () => import("../components/SignInWithGoogle"),
  { ssr: false }
);

import UserSvgIcon from "../components/plasmic/ez_marketing_platform_sacanagem/icons/PlasmicIcon__UserSvg";
import LockSvgIcon from "../components/plasmic/ez_marketing_platform_sacanagem/icons/PlasmicIcon__LockSvg";

export default function CCreateAccount() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          "https://www.ezmarketing.space/c-edit-profile",
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-code-verification-create-account");
  }

  async function handleGoogleSignUp() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://www.ezmarketing.space/c-edit-profile",
      },
    });
  }

  return (
    <>
      <Head>
        <title>Create account</title>
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
        {/* LOGO — 700x100 */}
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

        {/* CARD — 800 x 547 */}
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
              textAlign: "center",
            }}
          >
            Create corporative account
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
              type="email"
              value={email}
              onChange={setEmail}
            />

            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              placeholder="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />

            <Field
              icon={<LockSvgIcon width={24} height={24} />}
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
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
              onClick={handleCreateAccount}
              isDisabled={loading}
              style={{ width: 248, height: 37 }}
            >
              {loading ? "Creating..." : "Sign up"}
            </LoginButton>

            {/* CHECKBOX */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 10,
                gap: 6,
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
              />
              <span>
                I accept the{" "}
                <a
                  href="#"
                  style={{
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  terms and conditions
                </a>
              </span>
            </div>

            {/* 👇 ÚNICA LINHA DIFERENTE 👇 */}
            <SignInWithGoogle
              onClick={handleGoogleSignUp}
              style={{ width: 248, height: 37 }}
            >
              Sign up with Google
            </SignInWithGoogle>
          </div>

          {/* FOOTER */}
          <div style={{ fontSize: 14 }}>
            Already have account?
            <Link
              href="/c-login"
              style={{ marginLeft: 4, fontWeight: 600 }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Field helper — 504x32 ===== */

function Field({
  icon,
  placeholder,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
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
      <AntdInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
}
