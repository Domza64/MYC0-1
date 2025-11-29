import { useEffect, useState } from "react";
import type { Author } from "../types/data";
import { authorsApi } from "../lib/api/authors";
import { Link } from "react-router-dom";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    authorsApi.getAll().then(setAuthors);
  }, []);

  return (
    <div>
      <h1>Authors</h1>
      <ul>
        {authors.map((author, index) => (
          <li className="my-2 bg-stone-800 rounded-lg px-4 py-2" key={index}>
            <Link to={`/authors/${author.id}`}>
              <span>{author.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
