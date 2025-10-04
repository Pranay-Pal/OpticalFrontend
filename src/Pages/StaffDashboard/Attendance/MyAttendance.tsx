import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Info, PauseCircle, RefreshCcw, Timer } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { StaffAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceRecord {
  id: number;
  staffId: number;
  loginTime: string;
  logoutTime?: string | null;
}

const formatDate = (value: string | number | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDurationText = (start?: string, end?: string | null) => {
  if (!start) return "-";
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const diffMs = endDate.getTime() - startDate.getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) return "-";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
};

const MyAttendance = () => {
  const { user } = useAuth() as { user: { id?: number; name?: string } | null };
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const staffId = user?.id;

  const filteredRecords = useMemo(() => {
    if (!startDate && !endDate) return records;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return records.filter((record) => {
      const login = new Date(record.loginTime);
      if (start && login < start) return false;
      if (end) {
        const endBoundary = new Date(end);
        endBoundary.setHours(23, 59, 59, 999);
        if (login > endBoundary) return false;
      }
      return true;
    });
  }, [records, startDate, endDate]);

  const { totalMinutes, totalDurationLabel } = useMemo(() => {
    if (!filteredRecords.length) {
      return { totalMinutes: 0, totalDurationLabel: "0h" };
    }

    const minutes = filteredRecords.reduce((total, record) => {
      const start = record.loginTime ? new Date(record.loginTime) : null;
      const end = record.logoutTime ? new Date(record.logoutTime) : null;

      if (!start || Number.isNaN(start.getTime())) return total;
      const diff = (end && !Number.isNaN(end.getTime()) ? end.getTime() : Date.now()) - start.getTime();
      if (diff <= 0) return total;

      return total + diff / (1000 * 60);
    }, 0);

    const hours = Math.floor(minutes / 60);
    const minutesRemainder = Math.round(minutes % 60);

    return {
      totalMinutes: minutes,
      totalDurationLabel: `${hours}h ${minutesRemainder}m`,
    };
  }, [filteredRecords]);

  const summary = useMemo(() => {
    if (!filteredRecords.length) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        ongoingSessions: 0,
        averageDuration: "0m",
      };
    }

    const completedSessions = filteredRecords.filter((record) => Boolean(record.logoutTime)).length;
    const ongoingSessions = filteredRecords.length - completedSessions;
    const averageMinutes = filteredRecords.length ? totalMinutes / filteredRecords.length : 0;
    const avgHours = Math.floor(averageMinutes / 60);
    const avgMinutes = Math.round(averageMinutes % 60);
    const averageDuration = avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${Math.round(averageMinutes)}m`;

    return {
      totalSessions: filteredRecords.length,
      completedSessions,
      ongoingSessions,
      averageDuration,
    };
  }, [filteredRecords, totalMinutes]);

  const formatFilterLabel = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchAttendance = useCallback(async () => {
    if (!staffId) {
      setError("Unable to determine staff information. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await StaffAPI.attendance.getByStaff(staffId);
      setRecords(Array.isArray(data) ? data : []);
      setLastRefreshed(new Date());
    } catch (err) {
      setError((err as Error).message || "Failed to load attendance records");
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId) {
      void fetchAttendance();
    }
  }, [fetchAttendance, staffId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">My Attendance</h2>
          <p className="text-sm text-muted-foreground">
            Track your daily check-in and check-out history.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          {lastRefreshed ? (
            <span className="text-xs text-muted-foreground">
              Updated {lastRefreshed.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          ) : null}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); }}>
              Clear filters
            </Button>
            <Button variant="default" onClick={() => void fetchAttendance()} disabled={isLoading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load attendance</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {!error && (startDate || endDate) ? (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertTitle className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4" />
            Filtered view
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Showing records {startDate ? `from ${formatFilterLabel(startDate)}` : "from the beginning"}
            {endDate ? ` to ${formatFilterLabel(endDate)}` : " onwards"}.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{summary.totalSessions}</span>
            <span className="text-xs text-muted-foreground">records</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{summary.completedSessions}</span>
            <span className="text-xs text-muted-foreground">check-outs</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <PauseCircle className="h-4 w-4 text-yellow-500" />
              Ongoing
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{summary.ongoingSessions}</span>
            <span className="text-xs text-muted-foreground">open</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Timer className="h-4 w-4 text-primary" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{summary.averageDuration}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Daily summary
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-40"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-40"
            />
            <div className="text-sm font-medium text-muted-foreground">
              Total: <span className="text-foreground">{totalDurationLabel}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Login time</TableHead>
                <TableHead>Logout time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading attendance records...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length ? (
                filteredRecords.map((record) => {
                  const loginDate = record.loginTime ? new Date(record.loginTime) : null;
                  const dateLabel = loginDate
                    ? loginDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-";

                  return (
                    <TableRow key={record.id}>
                      <TableCell>{dateLabel}</TableCell>
                      <TableCell>{formatDate(record.loginTime)}</TableCell>
                      <TableCell>{formatDate(record.logoutTime ?? "")}</TableCell>
                      <TableCell>{getDurationText(record.loginTime, record.logoutTime)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No attendance records found for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAttendance;
