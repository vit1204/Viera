"use client";

import { useState } from "react";
import { Button } from "../../../../../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../../components/ui/tabs";
import { Separator } from "../../../../../../../components/ui/separator";
import { MessageSquare, Clock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: Date;
}

interface TaskActivityProps {
  taskId: string;
  comments?: Comment[];
}

export default function TaskActivity({ taskId, comments = [] }: TaskActivityProps) {
  const [activeTab, setActiveTab] = useState("comments");
  const [newComment, setNewComment] = useState("");

  const mockComments: Comment[] = [
    {
      id: "1",
      author: "You",
      avatar: "VN",
      content:
        "Starting work on this task. I'll begin with the initial setup and documentation.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      author: "Team Member",
      avatar: "TM",
      content:
        "Great! Let me know if you need any help. I can review the implementation when ready.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Activity Header */}
      <div className="px-8 py-6 border-b border-border">
        <h2 className="text-lg font-semibold">Activity</h2>
      </div>

      {/* Tabs */}
      <div className="px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 space-x-6 border-b border-border">
            <TabsTrigger
              value="comments"
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3"
            >
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger
              value="worklog"
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              Work log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="py-6">
            <div className="space-y-6">
              {/* Comment Input */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    VN
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 rounded border border-border bg-input/30 text-sm focus:outline-none focus:border-primary resize-none min-h-20"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        onClick={() => setNewComment("")}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!newComment.trim()}
                        onClick={() => {
                          setNewComment("");
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-6">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-semibold">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{comment.content}</p>
                      <div className="flex gap-4 pt-2">
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Reply
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="py-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-foreground">Status changed to In Progress</p>
                  <p className="text-xs">You • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-foreground">Task created</p>
                  <p className="text-xs">You • 4 hours ago</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="worklog" className="py-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>No time logged yet</p>
              <Button variant="ghost" className="mt-2">
                Log time
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
