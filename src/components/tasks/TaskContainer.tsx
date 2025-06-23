import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface TaskContainerProps {
	id: string;
	children: ReactNode;
}

export default function TaskContainer({ id, children }: TaskContainerProps) {
	const { isOver, setNodeRef } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			id={id}
			style={{
				minHeight: "240px",
				pointerEvents: "auto",
				backgroundColor: isOver ? "#e0f7fa" : undefined,
			}}
		>
			{children}
		</div>
	);
}
