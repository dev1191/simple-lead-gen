import { useSupabaseUser } from '#imports';

export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  if (process.server) return

  if (to.path.startsWith('/profile') && !user.value) {
    return navigateTo('/auth/login');
  }
});