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

        try {
            if (isRegistering.value) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                alert('Registration successful! Check your email to confirm.');
                isRegistering.value = false;
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                await router.push('/admin/dashboard');
            }
        } catch (err: any) {
            console.error('Auth error:', err.message);
            switch (err.message) {
                case 'Invalid login credentials':
                    toast.error(err.message)

                    break;
                case 'Email already registered':
                    toast.error(err.message)
                    break;
                case 'Email not confirmed':
                    toast.error(err.message)
                    break;
                case 'User already registered':
                    toast.error(err.message)
                    break;
                case 'Invalid email or password':
                    toast.error(err.message)
                    break;
                default:
                    toast.error(err.message)
                    break;
            }
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
        logout,
    };
});
