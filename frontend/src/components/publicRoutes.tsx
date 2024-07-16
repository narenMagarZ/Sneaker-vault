import { chdir } from "process";
import useAuth from "../hooks/useAuth";
import { redirect } from "react-router-dom";

export default function PublicRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authToken, user } = useAuth();
  const token = window.localStorage.getItem("token") || "";
  authToken(token);
  console.log(user);
  if (user) {
    redirect("/");
  }
  return <>{children}</>;
}
