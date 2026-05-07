"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import { Task } from "@prisma/client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

import { updateTask } from "@/lib/actions/task.action";
import { findWorkspaceMembers } from "@/lib/actions/workspaceMember.action";
import { WorkspaceMember, users } from "@prisma/client";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done", "idea", "in_review"]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  dueDate: z.date().optional(),
  assignment: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

// Format status for display
const formatStatusDisplay = (status: string): string => {
  return status.replace(/_/g, " ").toUpperCase();
};

interface members extends WorkspaceMember {
  user: users & { profiles: { id: string; username?: string; email?: string } | null };
}

function EditTaskForm({ task }: { task: Task }) {
  const [workspaceMembers, setWorkspaceMembers] = useState<members[] | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoadingMembers(true);
        const members = await findWorkspaceMembers();
        setWorkspaceMembers(members as members[]);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được danh sách thành viên");
      } finally {
        setLoadingMembers(false);
      }
    }

    loadMembers();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      status: task.status as any,
      priority: task.priority as any,
      assignment: [],
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined, 
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateTask(task.id, data);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assignment */}
        <FormField
          control={form.control}
          name="assignment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Select
                onValueChange={(value) => field.onChange([value])}
                value={field.value?.[0] || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingMembers ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  ) : workspaceMembers && workspaceMembers.length > 0 ? (
                    workspaceMembers.map((user) => {
                      const userId = user.user.profiles?.id || user.user.id;
                      const email = user.user.profiles?.email || "Unknown user";
                      return (
                        <SelectItem key={user.id} value={userId}>
                          {email}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <div className="py-2 px-2 text-sm text-gray-500">
                      No members available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TODO">{formatStatusDisplay("TODO")}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{formatStatusDisplay("IN_PROGRESS")}</SelectItem>
                  <SelectItem value="DONE">{formatStatusDisplay("DONE")}</SelectItem>
                  <SelectItem value="IDEA">{formatStatusDisplay("IDEA")}</SelectItem>
                  <SelectItem value="IN_REVIEW">{formatStatusDisplay("IN_REVIEW")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="pl-3 text-left font-normal w-full"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

export default EditTaskForm;