'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { toast } from 'sonner';
import { Board, Task } from '../../../types/api.types';
import { useMoveTaskMutation } from '../../../redux/api/tasksApi';
import { generateOrderBetween } from '../../../lib/fractional-index';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';

interface Props {
  boards: Board[];
  projectId: string;
}

export function KanbanBoard({ boards, projectId }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [moveTask] = useMoveTaskMutation();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const task = boards.flatMap((b) => b.tasks ?? []).find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find which board the task is being dropped into
    let targetBoardId = overId;
    let targetBoard = boards.find((b) => b.id === overId);

    if (!targetBoard) {
      // Dropped over a task — find that task's board
      targetBoard = boards.find((b) => b.tasks?.some((t) => t.id === overId));
      if (targetBoard) targetBoardId = targetBoard.id;
    }

    if (!targetBoard) return;

    const tasks = targetBoard.tasks ?? [];
    const overIndex = tasks.findIndex((t) => t.id === overId);
    const prevOrder = overIndex > 0 ? tasks[overIndex - 1].order : null;
    const nextOrder = overIndex >= 0 ? tasks[overIndex].order : null;
    const newOrder = generateOrderBetween(prevOrder, nextOrder);

    try {
      await moveTask({ id: taskId, targetBoardId, order: newOrder, projectId }).unwrap();
    } catch {
      toast.error('Failed to move task');
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full p-6 overflow-x-auto">
        {boards.map((board) => (
          <BoardColumn key={board.id} board={board} projectId={projectId} />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}