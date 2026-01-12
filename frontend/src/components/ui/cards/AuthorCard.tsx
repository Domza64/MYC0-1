import { Link } from "react-router-dom";
import type { Author } from "../../../types/data";
import { FaUser } from "react-icons/fa6";

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <Link to={`/authors/${author.id}`} className="flex flex-col w-full">
      <div className="w-full aspect-square rounded-full overflow-hidden">
        {author.image ? (
          <img
            src={"images/" + author.image}
            alt={author.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-stone-800 text-stone-400">
            <FaUser className="text-4xl" />
          </div>
        )}
      </div>
      <span className="pt-1 w-full truncate text-center">{author.name}</span>
    </Link>
  );
}
