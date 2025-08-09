export interface User {
  password: string;
  email: string;
  user_metadata:UserProfile
}


export interface UserProfile {
  display_name: string | null
  avatar_url: string | null
}