import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StaffAPI } from "@/lib/api";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  address: string;
}

const initialForm: FormState = { name: "", phone: "", address: "" };

const phoneRegex = /^[0-9+()\-\s]{6,20}$/;

const CustomerCreate = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required"; else if (!phoneRegex.test(form.phone.trim())) e.phone = "Invalid phone";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true); setApiError(null); setSuccess(false);
      await StaffAPI.customers.create({ name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() });
      setSuccess(true);
      setForm(initialForm);
      firstInputRef.current?.focus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create customer";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600">Create a new customer account</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {apiError && (
              <Alert variant="destructive"><AlertDescription>{apiError}</AlertDescription></Alert>
            )}
            {success && !apiError && (
              <Alert className="border-green-500/40">
                <AlertDescription className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Customer created successfully. <Link to="/staff-dashboard/customers" className="underline">View all</Link>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-sm font-medium" htmlFor="name">Name<span className="text-red-500">*</span></label>
                <Input id="name" ref={firstInputRef} value={form.name} onChange={(e) => handleChange('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name? 'name-error': undefined} placeholder="Customer name" autoComplete="off" />
                {errors.name && <p id="name-error" className="text-xs text-red-600">{errors.name}</p>}
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-sm font-medium" htmlFor="phone">Phone<span className="text-red-500">*</span></label>
                <Input id="phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone? 'phone-error': undefined} placeholder="Phone number" autoComplete="tel" />
                {errors.phone && <p id="phone-error" className="text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-sm font-medium" htmlFor="address">Address<span className="text-red-500">*</span></label>
                <Textarea id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} aria-invalid={!!errors.address} aria-describedby={errors.address? 'address-error': undefined} placeholder="Street, City, State" rows={3} />
                {errors.address && <p id="address-error" className="text-xs text-red-600">{errors.address}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="min-w-[130px]">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Customer
              </Button>
              <Button type="button" variant="outline" disabled={submitting} onClick={() => { setForm(initialForm); setErrors({}); setApiError(null); firstInputRef.current?.focus(); }}>Reset</Button>
            </div>
            <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCreate;
