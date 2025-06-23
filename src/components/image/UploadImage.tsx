import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
	Button,
	Container,
	Typography,
	Box,
	LinearProgress,
	Alert,
	Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useProtectedRoute from "../../hooks/useProtectedRoute";
import { useNavigate } from "react-router-dom";
import supabaseTasks from "../../services/tasks";
import supabaseUser from "../../services/auth";

const UploadImage = () => {
	useProtectedRoute();
	const navigate = useNavigate();

	const [uploading, setUploading] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [userId, setUserId] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { data, error } = await supabaseUser.GetUser();
			if (error) {
				console.error("Failed to get user:", error);
				return;
			}
			if (data?.user?.id) {
				setUserId(data.user.id);
			}
		};
		fetchUser();
	}, []);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files ? Array.from(event.target.files) : [];
		if (files.length === 0 || !userId) return;

		setUploading(true);
		setMessages([]);
		setErrors([]);

		const newMessages: string[] = [];
		const newErrors: string[] = [];

		for (const file of files) {
			const fileName = file.name;
			const filePath = `user-${userId}/${fileName}`;

			const { data: uploadData, error: uploadError } =
				await supabaseTasks.setPictureFileIntoStorage(filePath, file);

			if (uploadError) {
				newErrors.push(
					`⚠️ ${file.name}: UPLOAD ERROR, ${uploadError.message}`
				);
				continue;
			}

			const { error: insertError } =
				await supabaseTasks.SetPictureInTable(userId, filePath);

			if (insertError) {
				newErrors.push(
					`⚠️ ${file.name}: Saved to storage but DB insert failed.`
				);
				continue;
			}

			const { publicUrl } = supabaseTasks.getPublicUrl(filePath);
			if (publicUrl) {
				newMessages.push(`✅ ${file.name} uploaded.`);
			}
		}

		setMessages(newMessages);
		setErrors(newErrors);
		setUploading(false);
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ p: 4, mt: 6, textAlign: "center" }}>
				<Typography variant="h5" mb={3}>
					Upload Images
				</Typography>

				<input
					type="file"
					accept="image/*"
					multiple
					hidden
					ref={fileInputRef}
					onChange={handleFileChange}
				/>

				<Button
					variant="contained"
					startIcon={<CloudUploadIcon />}
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading || !userId}
					fullWidth
					sx={{ mb: 2 }}
				>
					{uploading ? "Uploading..." : "Select Images"}
				</Button>

				{uploading && <LinearProgress sx={{ mt: 2 }} />}

				{messages.length > 0 && (
					<Box mt={3}>
						{messages.map((msg, index) => (
							<Alert
								key={index}
								severity="success"
								sx={{ mb: 1 }}
							>
								{msg}
							</Alert>
						))}
					</Box>
				)}

				{errors.length > 0 && (
					<Box mt={3}>
						{errors.map((err, index) => (
							<Alert key={index} severity="error" sx={{ mb: 1 }}>
								{err}
							</Alert>
						))}
					</Box>
				)}

				<Button
					variant="outlined"
					onClick={() => navigate("/dashboard")}
					disabled={uploading || !userId}
					fullWidth
					startIcon={<CloudUploadIcon />}
				>
					Назад
				</Button>
			</Paper>
		</Container>
	);
};

export default UploadImage;
