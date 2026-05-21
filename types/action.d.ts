export interface SignInWithOAuthParams {
  authProvider: 'google' | 'github';
  authProviderId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image?: string;
  }
}

export interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
}