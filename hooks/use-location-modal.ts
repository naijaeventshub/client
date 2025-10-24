'use client';

import { useState, useCallback, useRef } from 'react';

export function useLocationModal() {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const formRef = useRef<any>(null);

  const setFormRef = useCallback((ref: any) => {
    formRef.current = ref;
  }, []);

  const handleFieldUpdate = useCallback((fieldName: string, value: any) => {
    if (formRef.current && formRef.current.setFieldValue) {
      formRef.current.setFieldValue(fieldName, value);
    }
  }, []);

  const handleLocationCreated = useCallback(
    (locationData: any, locationId: string) => {
      if (formRef.current && formRef.current.setFieldValue) {
        formRef.current.setFieldValue('location_uuid', locationId);
        formRef.current.setFieldValue('location_data', locationData);
        // Map common fields if they exist in the parent form
        formRef.current.setFieldValue('street', locationData.street);
        formRef.current.setFieldValue('city', locationData.city);
        formRef.current.setFieldValue('state', locationData.state);
        formRef.current.setFieldValue('country', locationData.country);
      }
    },
    []
  );

  return {
    locationModalOpen,
    setLocationModalOpen,
    handleLocationCreated,
    handleFieldUpdate,
    formRef,
    setFormRef,
  };
}
