import ROUTES from "./routes"

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message: "Looks like the database is taking a nap. Wake it up with some data!",
  button: {
    text: "Add Data",
    href: ROUTES.HOME
  }
}

export const DEFAULT_ERROR = {
  title: "Oops! Something went wrong.",
  message: "Our servers are currently taking a coffee break. Please try again later.",
  button: {
    text: "Try Again",
    href: ROUTES.HOME
  }
}

export const EMPTY_QUESTIONS = {
  title: "Ahh, the silence of an empty question list.",
  message: "It seems like there are no questions here. Be the first to ask something interesting!",
  button: {
    text: "Ask a Question",
    href: ROUTES.ASK_QUESTION
  }
}