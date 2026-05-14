export interface User {
  _id: string;
  name: string;
  email?: string;
  profilePic?: string;
  isPremium: boolean;
  authMethod: 'email' | 'google' | 'guest';
}

export interface Template {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  isPremium: boolean;
}
