import { useState } from "react";
import API from "../utils";
import { useNavigate } from "react-router-dom";
type User = {
  id: string;
  name: string;
  email: string;
};

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  async function authToken(token: string) {
    try {
      const res = await API("/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUser(res.data.user);
      } else navigate("/signin", { replace: true });
    } catch (err) {
      navigate("/signin", { replace: true });
    }
  }
  return { authToken, user };
}
