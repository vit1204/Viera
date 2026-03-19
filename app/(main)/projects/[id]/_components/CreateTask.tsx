"use client";

import { Button } from "../../../../../components/ui/button";
import { Calendar } from "../../../../../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { createTask } from "../../../../../lib/actions/task.action";
import { findWorkspaceMembers } from "@/lib/actions/workspaceMember.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { WorkspaceMember, users } from "@prisma/client";

const priorities = ["HIGH", "MEDIUM", "LOW"] as const;
const statuses = ["in_progress", "done", "in_review", "todo", "idea"] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignment: z.array(z.string()).optional(),
  priority: z.enum(priorities),
  status: z.enum(statuses),
  dueDate: z.date(),
});

interface members extends WorkspaceMember {
  user: users & { profiles: { id: string; username?: string } | null };
}

export default function CreateTaskDialog() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<
    members[] | null | undefined
  >(null);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  
  async function loadMembers() {
      try {
        const members = await findWorkspaceMembers();
        console.log(members)
        setWorkspaceMembers(members as members[]);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được danh sách thành viên");
      } finally {
        setLoading(false);
      }
    }

    if (open) {           
      loadMembers();
    }
  }, [open]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignment: [],
      priority: "MEDIUM",
      status: "idea",
      dueDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!id) {
      toast.error("Failed to find project.");
      return;
    }
    const response = await createTask({ ...values, projectId: id.toString() });
    if (response.success) toast.success(response.message);
    toast.error(response.message);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="button">Create task</button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new task for a project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Textarea placeholder="Task description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Assignment (multi-select mock) */}
            {loading && workspaceMembers ? (
              <Loader className="animate-spin" />
            ) : (
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
                      {loading ? (
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
                  </FormItem>
                )}
              />
            )}


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
                      {priorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Status */}
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
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          className="pl-3 text-left font-normal"
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
                        onSelect={(date) => field.onChange(date ?? new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="w-full justify-start flex sm:justify-start">
              <button className="button" type="submit">
                Create
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
