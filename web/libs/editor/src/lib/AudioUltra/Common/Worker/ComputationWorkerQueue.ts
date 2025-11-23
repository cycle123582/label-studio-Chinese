import type { BatchProgress, TaskPriority } from "./ComputationQueue";

type Task = {
  id: string;
  taskFn: () => Promise<any>; // Task function remains async
};

// Info about a batch stored within the worker
type WorkerBatchInfo = {
  id: string;
  metadata: any;
  pendingTasks: Task[];
  totalTasks: number; // Initial total number of tasks
  processedTasks: number;
};

// Result returned by processChunk
export interface ChunkProcessingResult {
  tasksProcessed: number; // How many tasks were actually processed in this chunk?
  completedBatchIds: string[]; // Array of Batch IDs completed during this chunk
}

const DEFAULT_WORKER_CHUNK_SIZE = 5; // Renamed constant

// This class is now purely synchronous from the caller's perspective
// It does NOT extend Events or emit anything.
export class ComputationWorkerQueue {
  // Store batches added to this specific worker
  private pendingBatches: WorkerBatchInfo[] = [];
  private name: string;
  private chunkSize: number; // Tasks per chunk for this worker

  // Global counters for this worker
  private totalTasksAdded = 0;
  private totalTasksProcessed = 0;

  public onBatchComplete?: (batchId: string, metadata: any) => void;
  public onProgress?: (batches: BatchProgress[], priority: TaskPriority) => void;
  private readonly priority: TaskPriority;

  constructor(name: string, chunkSize: number = DEFAULT_WORKER_CHUNK_SIZE, priority?: TaskPriority) {
    // Removed: super();
    this.name = name;
    this.chunkSize = Math.max(1, chunkSize);
    this.priority = priority ?? (name as TaskPriority);
  }

  addBatch(batchId: string, tasks: Task[], metadata: any) {
    if (tasks.length === 0) return;

    const totalTasks = tasks.length;

    const batchInfo: WorkerBatchInfo = {
      id: batchId,
      metadata,
      pendingTasks: [...tasks],
      totalTasks: totalTasks,
      processedTasks: 0,
    };
    this.pendingBatches.push(batchInfo);
    this.totalTasksAdded += totalTasks;
  }

  /**
   * Processes up to 'chunkSize' tasks from the pending batches sequentially.
   * Can process tasks across batch boundaries within a single chunk.
   * Returns info about the work done.
   */
  async processChunk(): Promise<ChunkProcessingResult> {
    let tasksProcessedInChunk = 0;
    const completedBatchIdsInChunk: string[] = [];

    // Keep processing tasks as long as we haven't hit the chunk limit, AND there are batches with tasks remaining.
    while (tasksProcessedInChunk < this.chunkSize && this.hasPendingTasks()) {
      // Get the current front batch
      const currentBatch: WorkerBatchInfo = this.pendingBatches[0];

      // Should not happen if hasPendingTasks is true, but safeguard
      if (!currentBatch || currentBatch.pendingTasks.length === 0) {
        console.error(
          `[WorkerQueue ${this.name}] Inconsistency: hasPendingTasks() true, but no tasks found in front batch ${currentBatch?.id}. Removing problematic batch.`,
        );
        if (currentBatch) this.pendingBatches.shift(); // Remove an empty / problematic batch
        continue; // Try the next batch if any
      }

      // Get the next task from the current batch
      const taskToStart = currentBatch.pendingTasks.shift(); // Take a task from the front

      // Safeguard if shift returns undefined (shouldn't happen if length > 0)
      if (!taskToStart) {
        console.error(
          `[WorkerQueue ${this.name}] Logic Error: Failed to shift task from non-empty pendingTasks of batch ${currentBatch.id}.`,
        );
        continue; // Skip to the next iteration / batch
      }

      tasksProcessedInChunk++;
      this.totalTasksProcessed++;
      currentBatch.processedTasks++;

      try {
        await taskToStart.taskFn();
      } catch (error) {
        console.error(`[WorkerQueue ${this.name}] Task ${taskToStart.id} (batch ${currentBatch.id}) failed:`, error);
      }
      // Task function is awaited, errors logged, but processing continues.

      // Check if the current batch is now complete *after* processing the task
      if (currentBatch.pendingTasks.length === 0) {
        completedBatchIdsInChunk.push(currentBatch.id);
        if (this.onBatchComplete) {
          this.onBatchComplete(currentBatch.id, currentBatch.metadata);
        }
        this.pendingBatches.shift(); // Remove completed batch from the front
      }
      // Continue the while loop to potentially process more tasks up to chunkSize
    }

    this.emitProgress();
    return {
      tasksProcessed: tasksProcessedInChunk,
      completedBatchIds: completedBatchIdsInChunk,
    };
  }

  /** Checks if there are any tasks remaining across all batches */
  hasPendingTasks(): boolean {
    // Efficiently check if any batch in the queue still has tasks left
    return this.pendingBatches.some((batch) => batch.pendingTasks.length > 0);
  }

  /** Removes all pending batches and resets counters */
  clear() {
    this.pendingBatches = [];
    this.totalTasksAdded = 0;
    this.totalTasksProcessed = 0;
    this.emitProgress();
  }

  // Removed: pause, _checkIdle, isIdle, activeTaskCount

  // --- Getters ---
  get pendingBatchCount(): number {
    // Count batches that actually have tasks left
    return this.pendingBatches.filter((b) => b.pendingTasks.length > 0).length;
  }

  get pendingTaskCount(): number {
    // Sum up tasks across all batches
    return this.pendingBatches.reduce((sum, batch) => sum + batch.pendingTasks.length, 0);
  }

  get globalTasksAdded(): number {
    return this.totalTasksAdded;
  }

  get globalTasksProcessed(): number {
    return this.totalTasksProcessed;
  }

  public cancelBatchesByPriority(priorities: TaskPriority[]) {
    this.pendingBatches = this.pendingBatches.filter((batch) => !priorities.includes(batch.metadata?.priority));
  }

  public getAllBatchProgresses(priority: TaskPriority): BatchProgress[] {
    return this.pendingBatches.map((batch) => ({
      id: batch.id,
      priority,
      metadata: batch.metadata,
      totalTasks: batch.totalTasks,
      activeTasks: batch.pendingTasks.length,
      completedTasks: batch.processedTasks,
      queuedTasks: batch.pendingTasks.length,
      percentage: batch.totalTasks > 0 ? Math.round((batch.processedTasks / batch.totalTasks) * 100) : 0,
    }));
  }

  private emitProgress() {
    if (this.onProgress) {
      this.onProgress(this.getAllBatchProgresses(this.priority), this.priority);
    }
  }
}
