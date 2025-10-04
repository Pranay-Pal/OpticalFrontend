import { useEffect, useState } from 'react';
import { DoctorAPI } from '@/lib/api';
import type { Patient, PrescriptionCreatePayload, PatientsResponse } from '@/lib/types/doctor';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MEASUREMENT_LIMITS, validateEyeMeasurement } from '@/lib/types/doctor';
import { useApiResult } from '@/hooks/useApiResult';

interface FormValues {
  patientId: number | '';
  rightSphere: number | '';
  rightCylinder: number | '';
  rightAxis: number | '';
  rightAdd: number | '';
  leftSphere: number | '';
  leftCylinder: number | '';
  leftAxis: number | '';
  leftAdd: number | '';
}

interface Props { onCreated: (id: number) => void; }

export default function CreatePrescriptionForm({ onCreated }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      patientId: '', rightSphere: '', rightCylinder: '', rightAxis: '', rightAdd: '',
      leftSphere: '', leftCylinder: '', leftAxis: '', leftAdd: ''
    }
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPatients(true);
      try {
        const res: PatientsResponse = await DoctorAPI.patients.getAll();
        if (!cancelled) setPatients(res.data || []);
      } finally { if (!cancelled) setLoadingPatients(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const { run: createRx, loading: creating } = useApiResult(
    (payload: PrescriptionCreatePayload) => DoctorAPI.prescriptions.create(payload),
    { successMessage: 'Prescription created' }
  );

  const onSubmit = async (values: FormValues) => {
    if (values.patientId === '') return;
    const payload: PrescriptionCreatePayload = {
      patientId: Number(values.patientId),
      rightEye: {
        sphere: Number(values.rightSphere),
        cylinder: Number(values.rightCylinder),
        axis: Number(values.rightAxis),
        add: values.rightAdd === '' ? 0 : Number(values.rightAdd)
      },
      leftEye: {
        sphere: Number(values.leftSphere),
        cylinder: Number(values.leftCylinder),
        axis: Number(values.leftAxis),
        add: values.leftAdd === '' ? 0 : Number(values.leftAdd)
      }
    };

    const errorsRight = validateEyeMeasurement('rightEye', payload.rightEye);
    const errorsLeft = validateEyeMeasurement('leftEye', payload.leftEye);
    if (errorsRight.length || errorsLeft.length) {
      throw new Error([...errorsRight, ...errorsLeft].join(', '));
    }
    const res = await createRx(payload);
    if ((res as any).data?.id) onCreated((res as any).data.id);
    reset();
  };

  const rangeHint = (label: string, min: number, max: number) => <span className="text-[10px] text-muted-foreground">{label} {min} to {max}</span>;

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold text-sm">Create Prescription</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Patient</label>
            <select className="border rounded px-2 py-1 text-sm" {...register('patientId', { required: true })} disabled={loadingPatients || creating}>
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.patientId && <p className="text-xs text-destructive">Required</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Right Eye (OD)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input type="number" step="0.25" placeholder="Sphere" {...register('rightSphere', { required: true, min: MEASUREMENT_LIMITS.sphere.min, max: MEASUREMENT_LIMITS.sphere.max })} />
                {rangeHint('Sphere', MEASUREMENT_LIMITS.sphere.min, MEASUREMENT_LIMITS.sphere.max)}
              </div>
              <div>
                <Input type="number" step="0.25" placeholder="Cylinder" {...register('rightCylinder', { required: true, min: MEASUREMENT_LIMITS.cylinder.min, max: MEASUREMENT_LIMITS.cylinder.max })} />
                {rangeHint('Cylinder', MEASUREMENT_LIMITS.cylinder.min, MEASUREMENT_LIMITS.cylinder.max)}
              </div>
              <div>
                <Input type="number" placeholder="Axis" {...register('rightAxis', { required: true, min: MEASUREMENT_LIMITS.axis.min, max: MEASUREMENT_LIMITS.axis.max })} />
                {rangeHint('Axis', MEASUREMENT_LIMITS.axis.min, MEASUREMENT_LIMITS.axis.max)}
              </div>
              <div>
                <Input type="number" step="0.25" placeholder="Add" {...register('rightAdd', { min: MEASUREMENT_LIMITS.add.min, max: MEASUREMENT_LIMITS.add.max })} />
                {rangeHint('Add', MEASUREMENT_LIMITS.add.min, MEASUREMENT_LIMITS.add.max)}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Left Eye (OS)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input type="number" step="0.25" placeholder="Sphere" {...register('leftSphere', { required: true, min: MEASUREMENT_LIMITS.sphere.min, max: MEASUREMENT_LIMITS.sphere.max })} />
                {rangeHint('Sphere', MEASUREMENT_LIMITS.sphere.min, MEASUREMENT_LIMITS.sphere.max)}
              </div>
              <div>
                <Input type="number" step="0.25" placeholder="Cylinder" {...register('leftCylinder', { required: true, min: MEASUREMENT_LIMITS.cylinder.min, max: MEASUREMENT_LIMITS.cylinder.max })} />
                {rangeHint('Cylinder', MEASUREMENT_LIMITS.cylinder.min, MEASUREMENT_LIMITS.cylinder.max)}
              </div>
              <div>
                <Input type="number" placeholder="Axis" {...register('leftAxis', { required: true, min: MEASUREMENT_LIMITS.axis.min, max: MEASUREMENT_LIMITS.axis.max })} />
                {rangeHint('Axis', MEASUREMENT_LIMITS.axis.min, MEASUREMENT_LIMITS.axis.max)}
              </div>
              <div>
                <Input type="number" step="0.25" placeholder="Add" {...register('leftAdd', { min: MEASUREMENT_LIMITS.add.min, max: MEASUREMENT_LIMITS.add.max })} />
                {rangeHint('Add', MEASUREMENT_LIMITS.add.min, MEASUREMENT_LIMITS.add.max)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={creating} size="sm">{creating ? 'Creating...' : 'Create Prescription'}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => reset()} disabled={creating}>Reset</Button>
        </div>
      </form>
    </Card>
  );
}
