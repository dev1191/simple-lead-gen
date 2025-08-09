// stores/auth.ts
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useSupabaseClient, useSupabaseUser } from '#imports';
import { toast } from "@steveyuowo/vue-hot-toast";


export const useAuthStore = defineStore('auth', () => {
    const supabase = useSupabaseClient();
    const router = useRouter();

    const user = useSupabaseUser();
    const error = ref<string | null>(null);
    const isRegistering = ref(false);

    const userAuthStatus = computed(() => !!user.value);

    async function handleAuth(email: string, password: string) {
        error.value = null;
        const id = toast.loading('Loading...');

        try {
            if (isRegistering.value) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                setTimeout(() => {
                    toast.update(id, {
                        type: "success",
                        message: 'Registration successful! Check your email to confirm.'
                    })
                }, 1000)
                isRegistering.value = false;
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                setTimeout(() => {
                    toast.update(id, {
                        type: "success",
                        message: "Login successful!"
                    })
                }, 1000)

                await router.push('/admin/dashboard');
            }
        } catch (err: any) {
            ;

            console.error('Auth error:', err.message);
            switch (err.message) {
                case 'Invalid login credentials':
                case 'Email already registered':
                case 'Email not confirmed':
                case 'User already registered':
                case 'Invalid email or password':
                    toast.error(err.message);
                    break;
                default:
                    toast.error(err.message || 'An error occurred. Please try again.');
                    break;
            }
        }
    }


    // New updateUser function
  async function updateUser(updates: { email?: string; password?: string; data?: Record<string, any> }) {
    error.value = null;
    const id = toast.loading('Updating user info...');

    try {
      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;

      setTimeout(() => {
        toast.update(id, {
          type: "success",
          message: "User info updated successfully!"
        });
      }, 1000);
    } catch (err: any) {
      console.error('Update user error:', err.message);
      toast.error(err.message || "Failed to update user");
      error.value = err.message || "Failed to update user";
    }
  }

    async function logout() {
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            await router.push('/auth/login');
        } catch (err: any) {
            console.error('error check :', err.message);
            error.value = err.message || 'not found';
        }
    }

    return {
        user,
        error,
        isRegistering,
        userAuthStatus,
        handleAuth,
        updateUser,
        logout,
    };
});
