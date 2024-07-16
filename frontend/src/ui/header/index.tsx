import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className=" p-1 text-xs flex justify-end items-center gap-x-2">
      <Link className="hover:text-gray-500" to={"/joinus"}>
        Join Us
      </Link>
      <span>|</span>
      <Link className="hover:text-gray-500" to={"/signin"}>
        Sign In
      </Link>
    </div>
  );
}
