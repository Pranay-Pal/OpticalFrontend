import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue, 
  className = "" 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  className?: string;
}) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs mt-1">
          <p className="text-muted-foreground">{description}</p>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">{Math.abs(trendValue)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
