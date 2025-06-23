import React, { useState, useEffect } from "react";
import {
	Container,
	Button,
	Paper,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Box,
	Alert,
	Snackbar,
} from "@mui/material";
import {
	Add as AddIcon,
	Save as SaveIcon,
	Close as CloseIcon,
	ArrowBack as ArrowBackIcon,
	Edit as EditIcon,
} from "@mui/icons-material";

import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
	closestCenter,
	DragStartEvent,
	DragEndEvent,
} from "@dnd-kit/core";

import TaskCard from "./TaskCard";
import TaskContainer from "./TaskContainer";
import { useNavigate } from "react-router-dom";
import supabaseUser from "../../services/auth";
import supabaseTasks from "../../services/tasks";

const STATUS_TITLES: Record<string, string> = {
	todo: "To Do",
	in_progress: "In Progress",
	done: "Done",
};

interface Task {
	id: string;
	title: string;
	description?: string;
	status: string;
	user_id: string;
}

export default function TasksPage() {
	const navigate = useNavigate();

	const [tasks, setTasks] = useState<Task[]>([]);
	const [openAdd, setOpenAdd] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [openEdit, setOpenEdit] = useState(false);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("todo");
	const [userId, setUserId] = useState<string | null>(null);

	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editStatus, setEditStatus] = useState("todo");

	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");

	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

	const sensors = useSensors(useSensor(PointerSensor));
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserId = async () => {
			const res = await supabaseUser.GetUser();
			if (res.data?.user?.id) setUserId(res.data.user.id);
		};
		fetchUserId();
	}, []);

	useEffect(() => {
		if (!userId) return;
		const fetchTasks = async () => {
			const { data, error } = await supabaseTasks.getTasks(userId);
			if (!error && data) setTasks(data);
			else setErrorMessage("Failed to fetch tasks.");
		};
		fetchTasks();
	}, [userId]);

	const addTask = async () => {
		if (!title.trim() || !userId) {
			setErrorMessage("Fill in the title or login.");
			return;
		}

		const { data, error } = await supabaseTasks.addTask(
			userId,
			title,
			description,
			status
		);

		if (!error && data) {
			setTasks([data, ...tasks]);
			setOpenAdd(false);
			setTitle("");
			setDescription("");
			setStatus("todo");
			setSuccessMessage("Task added successfully.");
		} else {
			setErrorMessage("Error adding task.");
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over || active.id === over.id) return;

		setTasks((prev) =>
			prev.map((task) =>
				task.id === active.id
					? { ...task, status: over.id as string }
					: task
			)
		);

		const { error } = await supabaseTasks.UpdateTaskOnDrag(
			over.id as string,
			active.id as string
		);
		if (error) setErrorMessage("Error updating status.");
	};

	const openEditModal = (task: Task) => {
		setSelectedTask(task);
		setEditTitle(task.title);
		setEditDescription(task.description || "");
		setEditStatus(task.status);
		setOpenEdit(true);
	};

	const saveEdit = async () => {
		if (!editTitle.trim() || !selectedTask) {
			setErrorMessage("Title cannot be empty");
			return;
		}

		const { error } = await supabaseTasks.UpdateTask(
			editTitle,
			editDescription,
			editStatus,
			selectedTask.id
		);

		if (!error) {
			setTasks((tasks) =>
				tasks.map((t) =>
					t.id === selectedTask.id
						? {
								...t,
								title: editTitle,
								description: editDescription,
								status: editStatus,
						  }
						: t
				)
			);
			setOpenEdit(false);
			setSuccessMessage("Task updated successfully.");
		} else {
			setErrorMessage("Error saving task.");
		}
	};

	const handleDeleteTask = (id: string) => {
		setTaskToDelete(id);
		setConfirmDeleteOpen(true);
	};

	const confirmDelete = async () => {
		if (!taskToDelete) return;

		const { error } = await supabaseTasks.deleteTask(taskToDelete);
		if (error) {
			setErrorMessage("Failed to delete task.");
			return;
		}

		setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
		setConfirmDeleteOpen(false);
		setTaskToDelete(null);
		setSuccessMessage("Task deleted successfully.");
	};

	const cancelDelete = () => {
		setConfirmDeleteOpen(false);
		setTaskToDelete(null);
	};

	return (
		<Container sx={{ mt: 4 }}>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
			>
				<Typography variant="h4" fontWeight={600}>
					Task Manager
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setOpenAdd(true)}
				>
					Add Task
				</Button>
			</Box>

			{!!errorMessage && (
				<Alert
					severity="error"
					onClose={() => setErrorMessage("")}
					sx={{ mb: 2 }}
				>
					{errorMessage}
				</Alert>
			)}
			{!!successMessage && (
				<Alert
					severity="success"
					onClose={() => setSuccessMessage("")}
					sx={{ mb: 2 }}
				>
					{successMessage}
				</Alert>
			)}

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<Box
					sx={{
						display: "grid",
						gap: 3,
						gridTemplateColumns: "repeat(3, 1fr)",
					}}
				>
					{Object.entries(STATUS_TITLES).map(
						([statusKey, statusLabel]) => (
							<Paper
								key={statusKey}
								sx={{
									p: 2,
									minHeight: 300,
									backgroundColor: "#f3f4f6",
									border: "1px solid #ddd",
									borderRadius: 2,
								}}
								elevation={2}
							>
								<Typography
									variant="h6"
									fontWeight="bold"
									color="primary"
									sx={{ mb: 2 }}
								>
									{statusLabel}
								</Typography>
								<TaskContainer id={statusKey}>
									{tasks
										.filter(
											(task) => task.status === statusKey
										)
										.map((task) => (
											<TaskCard
												key={task.id}
												id={task.id}
												title={task.title}
												onRightClick={() =>
													openEditModal(task)
												}
												onDelete={() =>
													handleDeleteTask(task.id)
												}
											/>
										))}
								</TaskContainer>
							</Paper>
						)
					)}
				</Box>
			</DndContext>

			<Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
				<DialogTitle>Додати задачу</DialogTitle>
				<DialogContent>
					<TextField
						label="Заголовок"
						fullWidth
						margin="normal"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextField
						label="Опис"
						fullWidth
						multiline
						rows={3}
						margin="normal"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<TextField
						select
						label="Статус"
						fullWidth
						margin="normal"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<MenuItem value="todo">To Do</MenuItem>
						<MenuItem value="in_progress">In Progress</MenuItem>
						<MenuItem value="done">Done</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button
						startIcon={<CloseIcon />}
						onClick={() => setOpenAdd(false)}
					>
						Скасувати
					</Button>
					<Button
						startIcon={<SaveIcon />}
						variant="contained"
						onClick={addTask}
					>
						Зберегти
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				fullWidth
			>
				<DialogTitle>Редагувати задачу</DialogTitle>
				<DialogContent>
					<TextField
						label="Заголовок"
						fullWidth
						margin="normal"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
					/>
					<TextField
						label="Опис"
						fullWidth
						multiline
						rows={3}
						margin="normal"
						value={editDescription}
						onChange={(e) => setEditDescription(e.target.value)}
					/>
					<TextField
						select
						label="Статус"
						fullWidth
						margin="normal"
						value={editStatus}
						onChange={(e) => setEditStatus(e.target.value)}
					>
						<MenuItem value="todo">To Do</MenuItem>
						<MenuItem value="in_progress">In Progress</MenuItem>
						<MenuItem value="done">Done</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button
						startIcon={<CloseIcon />}
						onClick={() => setOpenEdit(false)}
					>
						Скасувати
					</Button>
					<Button
						startIcon={<SaveIcon />}
						variant="contained"
						onClick={saveEdit}
					>
						Зберегти
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
				<DialogTitle>Підтвердити видалення</DialogTitle>
				<DialogContent>
					<Typography>
						Ви впевнені, що хочете видалити це завдання?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={cancelDelete}>Скасувати</Button>
					<Button
						color="error"
						onClick={confirmDelete}
						variant="contained"
					>
						Видалити
					</Button>
				</DialogActions>
			</Dialog>

			<Button
				variant="outlined"
				startIcon={<ArrowBackIcon />}
				sx={{ mt: 6 }}
				onClick={() => navigate("/dashboard")}
			>
				Назад
			</Button>
		</Container>
	);
}
