import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils"; // You'll need to implement these
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/callout";
import { components } from "@/components/mdx";

export default function Post({ source, frontMatter }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background"></header>
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl py-6 lg:py-10 px-4">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-[-200px] top-14 hidden xl:inline-flex"
            )}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            See all posts
          </Link>
          <div>
            {frontMatter.date && (
              <time
                dateTime={frontMatter.date}
                className="block text-sm text-muted-foreground"
              >
                Published on{" "}
                {format(parseISO(frontMatter.date), "MMMM dd, yyyy")}
              </time>
            )}
            <h1 className="mt-2 font-extrabold text-4xl leading-tight lg:text-5xl">
              {frontMatter.title}
            </h1>
            <div className="mt-4 flex space-x-4">
              <Link
                href={`https://twitter.com/markroberts`}
                className="flex items-center space-x-2 text-sm"
              >
                <div className="overflow-hidden rounded-full bg-white">
                  <img
                    className="aspect-square h-[42px] w-[42px] grayscale"
                    alt="Mark Roberts"
                    src="https://avatar.vercel.sh/personal.png"
                  />
                </div>
                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium">Mark Roberts</p>
                  <p className="text-[12px] text-muted-foreground">
                    @markroberts
                  </p>
                </div>
              </Link>
            </div>
          </div>
          {frontMatter.image && (
            <Image
              src={frontMatter.image}
              alt={frontMatter.title}
              width={720}
              height={405}
              className="my-8 rounded-md border bg-muted transition-colors"
              priority
            />
          )}
          <div className="prose prose-lg">
            <MDXRemote {...source} components={components} />
          </div>
          <hr className="mt-12" />
          <div className="flex justify-center py-6 lg:py-10">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              See all posts
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDirectory);
  console.log(filenames);

  const paths = filenames.map((filename) => ({
    params: {
      id: filename.replace(/\.mdx$/, ""),
    },
  }));

  return {
    paths,
    fallback: false, // fallback can be true for dynamic paths
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  const { content, data } = matter(postData.content);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
}

// Helper function to fetch post data
async function getPostData(id) {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  return {
    id,
    content: fileContents,
  };
}
