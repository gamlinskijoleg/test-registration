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
} from "@mui/material";
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
	closestCenter,
} from "@dnd-kit/core";

import { supabase } from "../supabaseClient";

import TaskCard from "./TaskCard";
import TaskContainer from "./TaskContainer";
import { Router, useNavigate } from "react-router-dom";

const STATUS_TITLES = {
	todo: "To Do",
	in_progress: "In Progress",
	done: "Done",
};

export default function TasksPage() {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);
	const [openAdd, setOpenAdd] = useState(false);

	const [selectedTask, setSelectedTask] = useState(null);
	const [openEdit, setOpenEdit] = useState(false);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("todo");
	const [userId, setUserId] = useState(null);

	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editStatus, setEditStatus] = useState("todo");

	const sensors = useSensors(useSensor(PointerSensor));
	const [activeId, setActiveId] = useState(null);

	useEffect(() => {
		async function fetchUserAndTasks() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) setUserId(user.id);

			const { data, error } = await supabase
				.from("tasks")
				.select("*")
				.order("created_at", { ascending: false });

			if (!error) setTasks(data);
		}
		fetchUserAndTasks();
	}, []);

	const addTask = async () => {
		if (!title.trim() || !userId) return alert("Fill the title or login");

		const { data, error } = await supabase
			.from("tasks")
			.insert({
				title,
				description,
				status,
				user_id: userId,
			})
			.select()
			.single();

		if (error) {
			alert("Error adding task");
			console.error(error);
		} else {
			setTasks([data, ...tasks]);
			setOpenAdd(false);
			setTitle("");
			setDescription("");
			setStatus("todo");
		}
	};

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};

	const handleDragEnd = async (event) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over) return;

		if (active.id !== over.id) {
			setTasks((tasks) =>
				tasks.map((task) =>
					task.id === active.id ? { ...task, status: over.id } : task
				)
			);

			const { error } = await supabase
				.from("tasks")
				.update({ status: over.id })
				.eq("id", active.id);

			if (error) console.error("Error updating status:", error);
		}
	};

	const openEditModal = (task) => {
		setSelectedTask(task);
		setEditTitle(task.title);
		setEditDescription(task.description || "");
		setEditStatus(task.status);
		setOpenEdit(true);
	};

	const saveEdit = async () => {
		if (!editTitle.trim()) return alert("Title cannot be empty");

		const { error } = await supabase
			.from("tasks")
			.update({
				title: editTitle,
				description: editDescription,
				status: editStatus,
			})
			.eq("id", selectedTask.id);

		if (error) {
			alert("Error saving task");
			console.error(error);
		} else {
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
		}
	};

	return (
		<Container sx={{ mt: 4 }}>
			<Button
				variant="contained"
				onClick={() => setOpenAdd(true)}
				sx={{ mb: 3 }}
			>
				Add Task
			</Button>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div style={{ display: "flex", gap: 16 }}>
					{Object.entries(STATUS_TITLES).map(
						([statusKey, statusLabel]) => (
							<Paper
								key={statusKey}
								sx={{
									flex: 1,
									p: 2,
									minHeight: 300,
									backgroundColor: "#fafafa",
								}}
								elevation={3}
							>
								<Typography variant="h6" sx={{ mb: 2 }}>
									{statusLabel}
								</Typography>
								<TaskContainer id={statusKey}>
									{tasks
										.filter(
											(task) => task.status === statusKey
										)
										.map(({ id, title }) => (
											<TaskCard
												key={id}
												id={id}
												title={title}
												onRightClick={() =>
													openEditModal(
														tasks.find(
															(t) => t.id === id
														)
													)
												}
											/>
										))}
								</TaskContainer>
							</Paper>
						)
					)}
				</div>
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
					<Button onClick={() => setOpenAdd(false)}>Скасувати</Button>
					<Button variant="contained" onClick={addTask}>
						Sent to database
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				fullWidth
			>
				<DialogTitle>Деталі задачі</DialogTitle>
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
					<Button onClick={() => setOpenEdit(false)}>
						Скасувати
					</Button>
					<Button variant="contained" onClick={saveEdit}>
						Зберегти
					</Button>
				</DialogActions>
			</Dialog>
			<Button
				variant="outlined"
				sx={{ marginTop: 10 }}
				onClick={() => navigate("/dashboard")}
			>
				Назад
			</Button>
		</Container>
	);
}
