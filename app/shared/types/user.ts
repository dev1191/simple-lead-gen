export interface User {
  password: string;
  email: string;
  user_metadata:UserProfile
}


export interface UserProfile {
  id:string;
  display_name: string | null
  avatar_url: string | null
}