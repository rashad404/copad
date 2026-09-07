'use client';

import { useCallback, useEffect, useState } from 'react';
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import type { ResourceConfig } from '@/components/admin/types';
import { getSpecialties, createSpecialty } from '@/api/admin';
import type { MedicalSpecialty } from '@/api/admin';
import { getErrorMessage } from '@/utils/errors';

/**
 * Medical specialties admin.
 *
 * These records hold the system prompts that direct the assistant's clinical
 * behaviour, and until now there was no way to review them outside the
 * database - while any registered user could write them through the public API.
 *
 * The whole screen is this configuration object plus two API calls; the table,
 * form, validation, and the loading, empty and error states come from the
 * shared resource components.
 */
const config: ResourceConfig<MedicalSpecialty> = {
  title: 'Specialties',
  singular: 'specialty',
  idKey: 'id',
  searchKeys: ['name', 'code', 'description'],
  emptyMessage: 'No medical specialties are configured yet.',
  fields: [
    {
      key: 'code',
      label: 'Code',
      type: 'badge',
      required: true,
      placeholder: 'pediatric',
      helpText: 'Stable identifier used by the chat API. Lowercase, no spaces.',
      className: 'w-32',
      validate: (value) =>
        /^[a-z0-9-]+$/.test(String(value ?? ''))
          ? null
          : 'Use lowercase letters, numbers and hyphens only',
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Uşaq həkimi',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'Pediatrician',
    },
    {
      key: 'isActive',
      label: 'Active',
      type: 'boolean',
      className: 'w-24',
    },
    {
      key: 'systemPrompt',
      label: 'System prompt',
      type: 'textarea',
      required: true,
      inTable: false,
      helpText:
        'Sent to the model on every conversation in this specialty. It governs clinical behaviour, so review changes carefully.',
      validate: (value) =>
        String(value ?? '').trim().length >= 20
          ? null
          : 'A system prompt this short will not usefully steer the model',
    },
    {
      key: 'iconUrl',
      label: 'Icon URL',
      type: 'text',
      inTable: false,
      placeholder: 'https://…',
    },
  ],
};

export default function AdminSpecialtiesPage() {
  const [records, setRecords] = useState<MedicalSpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSpecialties();
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load specialties.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <ResourceTable
        config={config}
        records={records}
        loading={loading}
        error={error}
        onRetry={load}
        onCreate={() => setCreating(true)}
      />

      {creating && (
        <ResourceForm
          config={config}
          initial={{ isActive: true }}
          onCancel={() => setCreating(false)}
          onSubmit={async (values) => {
            await createSpecialty(values);
            setCreating(false);
            await load();
          }}
        />
      )}
    </>
  );
}
