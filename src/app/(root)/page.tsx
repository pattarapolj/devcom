import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

  const questions = [
    {_id: "1", title: "How to learn Next.js?", description: "I am new to Next.js and would like to know the best resources to learn it.", 
      tags: [ {_id: "1", name: "Next.js" }, { _id: "2", name: "JavaScript" } ], 
      author: { _id: "1", name: "John Doe", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSO0VubIDlJbtjWF0z5sDK5luQCR5niFDyyQ&s"}, 
      createdAt: new Date("2026-03-01T12:00:00.000Z"),
      upvotes: 10,
      answers: 5,
      views: 100,
    },
    {_id: "2", title: "What is the best way to deploy a Next.js app?", 
      description: "I want to deploy my Next.js app and need guidance on the best practices.", 
      tags: [ {_id: "3", name: "Deployment" }, ], 
      author: { _id: "2", name: "Jane Smith", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSO0VubIDlJbtjWF0z5sDK5luQCR5niFDyyQ&s"}, 
      createdAt: new Date("2024-09-02T12:00:00.000Z"),
      upvotes: 5,
      answers: 2,
      views: 50,
    },
    {_id: "3", title: "How to use Next.js with TypeScript?", description: "I am interested in using TypeScript with Next.js and need help getting started.", tags: [ {_id: "4", name: "TypeScript" }, { _id: "1", name: "Next.js" } ], 
      author: { _id: "3", name: "Alice Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSO0VubIDlJbtjWF0z5sDK5luQCR5niFDyyQ&s"}, 
      createdAt: new Date("2024-09-03T12:00:00.000Z"),
      upvotes: 8,
      answers: 3,
      views: 75,
    },
    {_id: "4", title: "What are the benefits of using Next.js?", description: "I would like to know the advantages of using Next.js for my projects.", tags: [ {_id: "1", name: "Next.js" }, { _id: "5", name: "Benefits" } ], 
      author: { _id: "4", name: "Bob Brown", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSO0VubIDlJbtjWF0z5sDK5luQCR5niFDyyQ&s"}, 
      createdAt: new Date("2024-09-04T12:00:00.000Z"),
      upvotes: 12,
      answers: 4,
      views: 90,
    },
    {_id: "5", title: "How to optimize performance in Next.js?", description: "I need tips on improving the performance of my Next.js application.", tags: [ {_id: "6", name: "Performance" }, { _id: "1", name: "Next.js" } ], 
      author: { _id: "5", name: "Charlie Davis", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSO0VubIDlJbtjWF0z5sDK5luQCR5niFDyyQ&s"}, 
      createdAt: new Date("2024-09-05T12:00:00.000Z"),
      upvotes: 10,
      answers: 5,
      views: 100,
    }
  ]

  interface SearchParams {
    searchParams: Promise<{[key: string]: string}>;
  }

const Home = async ({ searchParams }: SearchParams ) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((
    question) => 
      question.title.toLowerCase().includes(query?.toLowerCase()) &&
      (filter ? question.tags.some(tag => tag.name.toLowerCase() === filter.toLowerCase())
        : true)
  );

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          <Link href={ROUTES.ASK_QUESTION}>
            <span>Create New Question</span>
          </Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}

export default Home;