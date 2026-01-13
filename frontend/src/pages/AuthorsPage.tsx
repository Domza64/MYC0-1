import { useEffect, useState } from "react";
import type { Author } from "../types/data";
import { authorsApi } from "../lib/api/authors";
import AuthorCard from "../components/ui/cards/AuthorCard";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    authorsApi.getAll().then(setAuthors);
  }, []);

  return (
    <div className="max-w-400">
      <h1 className="mb-4">Authors</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {authors.map((author, index) => (
          <li key={index} className="max-w-[420px] w-full justify-self-start">
            <AuthorCard author={author} />
          </li>
        ))}
      </ul>
    </div>
  );
}
