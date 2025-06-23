import { supabase } from "./supabaseClient";

const supabaseTasks = {
	async setPictureFileIntoStorage(filePath: string, file: File) {
		return await supabase.storage.from("photos").upload(filePath, file);
	},

	async SetPictureInTable(userId: string, filePath: string) {
		return await supabase.from("photos").insert({
			user_id: userId,
			path: filePath,
		});
	},

	getPublicUrl(filePath: string) {
		const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
		return data;
	},

	async addTask(
		userId: string,
		title: string,
		description: string,
		status: string
	) {
		const res = await supabase
			.from("tasks")
			.insert({ user_id: userId, title, description, status })
			.select()
			.single();
		return res;
	},

	async UpdateTaskOnDrag(status: string, id: string) {
		const res = await supabase
			.from("tasks")
			.update({ status })
			.eq("id", id);
		return res;
	},

	async UpdateTask(
		title: string,
		description: string,
		status: string,
		id: string
	) {
		const res = await supabase
			.from("tasks")
			.update({ title, description, status })
			.eq("id", id);
		return res;
	},

	async getPhotos(userId: string) {
		const res = await supabase
			.from("photos")
			.select("path")
			.eq("user_id", userId);
		return res;
	},

	async getPublicImageUrl(path: string) {
		const { data } = supabase.storage.from("photos").getPublicUrl(path);
		return data;
	},

	async getTasks(userId: string) {
		const res = await supabase
			.from("tasks")
			.select("*")
			.eq("user_id", userId);
		return res;
	},

	async deleteTask(taskId: string) {
		return await supabase.from("tasks").delete().eq("id", taskId);
	},
};

export default supabaseTasks;
