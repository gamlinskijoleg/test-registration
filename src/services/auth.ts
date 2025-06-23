import { supabase } from "./supabaseClient";

const supabaseUser = {
	async GetUser() {
		const res = await supabase.auth.getUser();
		return res;
	},

	async UpdateUserPassword(password: string) {
		const res = await supabase.auth.updateUser({
			password,
		});
		return res;
	},

	async Login(email: string, password: string) {
		const res = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return res;
	},

	async Register(email: string, password: string) {
		const res = await supabase.auth.signUp({
			email,
			password,
		});
		return res;
	},

	async resetPasswordForEmail(email: string) {
		const res = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: "http://localhost:3000/resetPasswordEnterCode",
		});
		return res;
	},

	async LogOut() {
		const res = await supabase.auth.signOut();
		return res;
	},
};

export default supabaseUser;
