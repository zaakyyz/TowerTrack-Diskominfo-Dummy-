import { forwardRef } from 'react';

type Field = 'nama' | 'telepon' | 'email' | 'kategori' | 'lokasi_tower' | 'pesan';

const fieldNames: Record<Field, string> = {
  nama: 'Nama lengkap',
  telepon: 'Nomor telepon',
  email: 'Email',
  kategori: 'Kategori',
  lokasi_tower: 'Lokasi',
  pesan: 'Pesan',
};

const FormValidationSummary = forwardRef<HTMLDivElement, { validation: Record<Field, boolean> }>(
  ({ validation }, ref) => {
    const invalidFields = (Object.keys(fieldNames) as Field[]).filter((field) => validation[field]);

    if (invalidFields.length === 0) return null;

    return (
      <div ref={ref} tabIndex={-1} role="alert" className="mb-5 rounded-md border border-destructive-border bg-destructive-soft p-4 text-sm text-destructive-strong focus:outline-none">
        <p className="font-semibold">Periksa isian berikut sebelum mengirim:</p>
        <ul className="mt-1 list-disc pl-5">
          {invalidFields.map((field) => <li key={field}>{fieldNames[field]}</li>)}
        </ul>
      </div>
    );
  },
);

FormValidationSummary.displayName = 'FormValidationSummary';

export default FormValidationSummary;
