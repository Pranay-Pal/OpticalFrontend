import { useState } from "react";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { logoutWithAttendance } from "@/store/authSlice";
import type { AppDispatch } from "@/store";

const AttendanceLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDialogChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setError(null);
      setMessage(null);
      setIsLoading(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await dispatch(logoutWithAttendance()).unwrap();
      setMessage("Logout recorded successfully. Redirecting...");
      setTimeout(() => {
        handleDialogChange(false);
        window.location.href = "/staff-login";
      }, 1200);
    } catch (err) {
      setError((err as Error).message || "Failed to log attendance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Record & Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Attendance & Logout</DialogTitle>
          <DialogDescription>
            Your logout time will be recorded before ending the session. Make sure you have completed all pending tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTitle>Current Session</AlertTitle>
            <AlertDescription>
              Logging out will capture your logout time for attendance tracking. You&apos;ll be redirected to the login page afterwards.
            </AlertDescription>
          </Alert>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Logout failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {message ? (
            <Alert className="border-green-500 text-green-700">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Confirm & Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceLogout;
