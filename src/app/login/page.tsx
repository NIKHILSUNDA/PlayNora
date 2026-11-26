import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Login or Sign up – PlayNora" };
export default function LoginPage() {
  return <Suspense fallback={null}><AuthForm /></Suspense>;
}
