import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Maybe it's on vacation?</p>
      <p>
        <Link
          to={"/"}
          className="text-rose-700 underline cursor-grab hover:text-rose-500 transition-colors duration-300"
        >
          Go home
        </Link>{" "}
        or
        <button
          onClick={() => window.history.back()}
          className="text-rose-700 ml-1 underline cursor-grab hover:text-rose-500 transition-colors duration-300"
        >
          go back
        </button>
      </p>
    </div>
  );
}
