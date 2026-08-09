"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Save, Loader2, Settings, Building, Mail, Phone, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/service";

export default function AdminSettingsPage() {
  const t = useTranslations("Admin");
  const { data: settingsData, isLoading, error: fetchError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [orgName, setOrgName] = useState("ABOI NGO");
  const [contactEmail, setContactEmail] = useState("contact@aboi-ngo.org");
  const [contactPhone, setContactPhone] = useState("+229 0197294351 / 0164962217");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ orgName?: string; contactEmail?: string; contactPhone?: string }>({});

  useEffect(() => {
    if (settingsData) {
      if (settingsData.org_name) setOrgName(settingsData.org_name);
      if (settingsData.contact_email) setContactEmail(settingsData.contact_email);
      if (settingsData.contact_phone) setContactPhone(settingsData.contact_phone);
      if (settingsData.maintenance_mode)
        setMaintenanceMode(settingsData.maintenance_mode === "true");
    }
  }, [settingsData]);

  const validateForm = () => {
    const errors: { orgName?: string; contactEmail?: string; contactPhone?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!orgName.trim()) {
      errors.orgName = "Organization name is required.";
    } else if (orgName.trim().length < 2) {
      errors.orgName = "Organization name must be at least 2 characters.";
    }

    if (!contactEmail.trim()) {
      errors.contactEmail = "Contact email address is required.";
    } else if (!emailRegex.test(contactEmail.trim())) {
      errors.contactEmail = "Please enter a valid email address.";
    }

    if (contactPhone.trim() && !/^[+0-9\s-()]{6,20}$/.test(contactPhone.trim())) {
      errors.contactPhone = "Please enter a valid phone number (e.g. +229 97 00 00 00).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      setErrorMessage("Please fix the validation errors before saving settings.");
      return;
    }

    updateSettingsMutation.mutate(
      {
        org_name: orgName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim(),
        maintenance_mode: String(maintenanceMode),
      },
      {
        onSuccess: () => {
          setSuccessMessage("Site settings saved successfully!");
          setTimeout(() => setSuccessMessage(null), 4000);
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Error saving settings.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Site Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <Settings className="text-primary" size={24} />
            <span>{t.has("nav.settings") ? t("nav.settings") : "Settings"}</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-0.5">
            Configure system parameters, organization contact info, and security parameters.
          </p>
        </div>
      </div>

      {/* Alert Notifications */}
      {errorMessage && (
        <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div role="status" className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {fetchError && (
        <div role="alert" className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <span>Failed to load settings from server. Please refresh.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6" noValidate>
        {/* Organization Info Card */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-outline shadow-sm space-y-5">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline pb-3">
            <Building size={18} className="text-primary" />
            <span>Organization Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (fieldErrors.orgName) setFieldErrors((prev) => ({ ...prev, orgName: undefined }));
                }}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-transparent text-on-surface focus:outline-none transition-all ${
                  fieldErrors.orgName
                    ? "border-error focus:border-error"
                    : "border-outline focus:border-primary"
                }`}
              />
              {fieldErrors.orgName && (
                <p className="text-xs text-error font-medium mt-1">{fieldErrors.orgName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Contact Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (fieldErrors.contactEmail) setFieldErrors((prev) => ({ ...prev, contactEmail: undefined }));
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-transparent text-on-surface focus:outline-none transition-all ${
                    fieldErrors.contactEmail
                      ? "border-error focus:border-error"
                      : "border-outline focus:border-primary"
                  }`}
                />
              </div>
              {fieldErrors.contactEmail && (
                <p className="text-xs text-error font-medium mt-1">{fieldErrors.contactEmail}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative max-w-sm">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (fieldErrors.contactPhone) setFieldErrors((prev) => ({ ...prev, contactPhone: undefined }));
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-transparent text-on-surface focus:outline-none transition-all ${
                    fieldErrors.contactPhone
                      ? "border-error focus:border-error"
                      : "border-outline focus:border-primary"
                  }`}
                />
              </div>
              {fieldErrors.contactPhone && (
                <p className="text-xs text-error font-medium mt-1">{fieldErrors.contactPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* System & Maintenance Mode Card */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-outline shadow-sm space-y-5">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline pb-3">
            <Shield size={18} className="text-secondary" />
            <span>System Maintenance</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">Maintenance Mode</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                When enabled, public site visitors will see a maintenance notice.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{updateSettingsMutation.isPending ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
