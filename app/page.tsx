'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subTasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState<{ [key: string]: string }>({});

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subTasks: [],
        isExpanded: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (taskId: string, title: string) => {
    setEditingTaskId(taskId);
    setEditingTitle(title);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: editingTitle } : task
      ));
    }
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpanded = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubTask = (taskId: string) => {
    const title = newSubTaskTitle[taskId]?.trim();
    if (title) {
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        title,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subTasks: [...task.subTasks, newSubTask] }
          : task
      ));
      setNewSubTaskTitle({ ...newSubTaskTitle, [taskId]: '' });
    }
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: task.subTasks.filter(st => st.id !== subTaskId) }
        : task
    ));
  };

  const updateSubTaskStatus = (taskId: string, subTaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === subTaskId ? { ...st, status } : st
            )
          }
        : task
    ));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-200 text-gray-700';
      case 'Running': return 'bg-blue-200 text-blue-700';
      case 'Completed': return 'bg-green-200 text-green-700';
    }
  };

  const statusOptions: TaskStatus[] = ['Pending', 'Running', 'Completed'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <main className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TODO管理アプリ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            タスクとサブタスクを管理しましょう
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {task.subTasks.length > 0 && (
                    <button
                      onClick={() => toggleTaskExpanded(task.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {task.isExpanded ? '▼' : '▶'}
                    </button>
                  )}

                  <div className="flex-1">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                        onBlur={() => saveTaskEdit(task.id)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <h3
                        onClick={() => startEditingTask(task.id, task.title)}
                        className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {task.title}
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} border-0 cursor-pointer`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>

                {task.isExpanded && task.subTasks.length > 0 && (
                  <div className="mt-4 ml-8 space-y-2">
                    {task.subTasks.map(subTask => (
                      <div
                        key={subTask.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <span className="flex-1 text-gray-800 dark:text-gray-200">
                          {subTask.title}
                        </span>
                        <select
                          value={subTask.status}
                          onChange={(e) => updateSubTaskStatus(task.id, subTask.id, e.target.value as TaskStatus)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subTask.status)} border-0 cursor-pointer`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteSubTask(task.id, subTask.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSubTaskTitle[task.id] || ''}
                    onChange={(e) => setNewSubTaskTitle({ ...newSubTaskTitle, [task.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addSubTask(task.id)}
                    placeholder="サブタスクを追加..."
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => addSubTask(task.id)}
                    className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                  >
                    サブタスク追加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            タスクがありません。上のフォームから追加してください。
          </div>
        )}
      </main>
    </div>
  );
}
