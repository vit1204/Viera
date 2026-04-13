import { AlertCircle, Lightbulb, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface InsightCardProps {
  title: string;
  icon: "risk" | "suggestion" | "summary";
  items: string[];
  isLoading?: boolean;
}

const iconMap = {
  risk: <AlertCircle className="w-5 h-5 text-red-500" />,
  suggestion: <Lightbulb className="w-5 h-5 text-amber-500" />,
  summary: <Zap className="w-5 h-5 text-blue-500" />,
};

const titleColorMap = {
  risk: "text-red-600 dark:text-red-400",
  suggestion: "text-amber-600 dark:text-amber-400",
  summary: "text-blue-600 dark:text-blue-400",
};

export function AIInsightCard({
  title,
  icon,
  items,
  isLoading = false,
}: InsightCardProps) {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {iconMap[icon]}
          <CardTitle className={`text-lg ${titleColorMap[icon]}`}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-muted-foreground text-sm font-medium min-w-fit">
                  {icon === "risk" ? "⚠️" : icon === "suggestion" ? "💡" : "✨"}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {icon === "summary"
              ? "No summary available"
              : `No ${icon}s identified`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
