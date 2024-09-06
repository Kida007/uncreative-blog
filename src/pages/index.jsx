import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function BlogIndex({ posts }) {
  return (
    <div className="container mx-auto max-w-4xl py-6 lg:py-10 px-4">
      <div className="space-y-4">
        <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl">
          Ad Analytics Insights
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore the latest in ad performance metrics and optimization
          strategies.
        </p>
      </div>
      <hr className="my-8" />
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col space-y-2"
            >
              {post.image && (
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="rounded-md border bg-muted transition-colors object-cover"
                  />
                </div>
              )}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
              )}
              <Link href={`/posts/${post.slug}`} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(".mdx", ""),
      title: data.title,
      date: data.date,
      description: data.description,
      image: data.image,
    };
  });

  // Sort posts by date
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      posts,
    },
  };
}
