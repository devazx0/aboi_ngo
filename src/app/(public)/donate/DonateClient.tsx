"use client";

import { useState, useId } from "react";
import { useTranslations } from "next-intl";

interface BankDetail {
  labelKey: string;
  value: string;
}

export default function DonateClient() {
  const t = useTranslations("donate");
  const formIdPrefix = useId();

  // State for Cause & Amount Selection
  const [selectedCause, setSelectedCause] = useState<string>("general");
  const [selectedAmount, setSelectedAmount] = useState<string>("30000");
  const [customAmount, setCustomAmount] = useState<string>("");
  
  // State for Active Tab (local, intl, momo)
  const [activeTab, setActiveTab] = useState<"local" | "intl" | "momo">("local");

  // State for Copy Tooltips
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State for Payment Reference Code
  const [referenceCode] = useState<string>(() => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `ABOI-DON-${randomNum}`;
  });

  // State for Notification Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amountSent: "",
    bankUsed: "",
    transRef: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle Copy to Clipboard
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Handle Form Submit
  const handleSubmitNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const causeText = selectedCause === "general" ? t("causeGeneral") :
        selectedCause === "water" ? t("causeWater") :
        selectedCause === "waqf" ? t("causeWaqf") :
        selectedCause === "edu" ? t("causeEdu") : t("causeHealth");

      const amountVal = customAmount || selectedAmount;

      const res = await fetch("/api/donate/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: `${amountVal} XOF`,
          bankUsed: formData.bankUsed,
          transactionRef: formData.transRef || referenceCode,
          notes: formData.notes,
          cause: causeText,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit notification");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        amountSent: "",
        bankUsed: "",
        transRef: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setSubmitError(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const localBankDetails: BankDetail[] = [
    { labelKey: t("bankName"), value: "Bank of Africa (BOA Bénin)" },
    { labelKey: t("accountName"), value: "NGO-ABOI (Ass. Béninoise des Oeuvres Islamiques)" },
    { labelKey: t("accountNumber"), value: "01001-012345678901-45" },
    { labelKey: t("iban"), value: "BJ061 0100 1012 3456 7890 145" },
    { labelKey: t("swift"), value: "AFRIBBJCO" },
    { labelKey: t("branch"), value: "Agence Principale Cotonou, Bénin" },
  ];

  const intlBankDetails: BankDetail[] = [
    { labelKey: t("bankName"), value: "Ecobank Bénin S.A." },
    { labelKey: t("accountName"), value: "NGO-ABOI International Fund" },
    { labelKey: t("accountNumber"), value: "BJ061 0200 9876 5432 1098 321" },
    { labelKey: t("swift"), value: "ECORBJCO" },
    { labelKey: t("iban"), value: "BJ061 0200 9876 5432 1098 321" },
    { labelKey: "Intermediary SWIFT (USD)", value: "CITIUS33 (Citibank N.A. New York)" },
    { labelKey: "Intermediary SWIFT (EUR)", value: "ECOFRPP1 (Ecobank Paris Branch)" },
  ];

  const momoDetails: BankDetail[] = [
    { labelKey: "MTN Mobile Money", value: "+229 0197294351" },
    { labelKey: "Moov Money", value: "+229 0164962217" },
    { labelKey: t("accountName"), value: "ONG ABOI" },
    { labelKey: "Country Code", value: "Bénin (+229)" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-tertiary text-on-primary py-16 px-gutter shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-container-max mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/90 text-on-secondary-container font-label-md text-sm font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{t("badge")}</span>
          </div>

          <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            {t("heroTitle")}
          </h1>

          <p className="font-body-lg text-lg sm:text-xl text-primary-fixed max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="bg-surface/10 backdrop-blur-md px-5 py-2 rounded-lg border border-white/20 text-xs sm:text-sm font-medium text-surface-bright flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-[20px]">workspace_premium</span>
              <span>{t("regBadge")}</span>
            </div>
            <div className="bg-surface/10 backdrop-blur-md px-5 py-2 rounded-lg border border-white/20 text-xs sm:text-sm font-medium text-surface-bright flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-[20px]">savings</span>
              <span>100% Direct Allocation to Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-gutter mt-12 space-y-16">
        
        {/* ── SECTION 1: CAUSE & AMOUNT PRESET SELECTOR ───────────────── */}
        <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-sm space-y-8">
          <div className="border-b border-outline-variant pb-4">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold flex items-center gap-3">
              <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              {t("selectAmountTitle")}
            </h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              {t("selectAmountDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cause Selection */}
            <div className="space-y-4">
              <label htmlFor={`${formIdPrefix}-cause-select`} className="block font-headline-md text-lg text-on-surface font-semibold">
                {t("causeLabel")}
              </label>
              <div className="space-y-2.5">
                {[
                  { id: "general", label: t("causeGeneral"), icon: "diversity_3" },
                  { id: "water", label: t("causeWater"), icon: "water_drop" },
                  { id: "waqf", label: t("causeWaqf"), icon: "account_balance" },
                  { id: "edu", label: t("causeEdu"), icon: "school" },
                  { id: "health", label: t("causeHealth"), icon: "medical_services" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCause(c.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-body-md transition-all ${
                      selectedCause === c.id
                        ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs"
                        : "border-outline-variant hover:border-primary/40 text-on-surface-variant"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[22px] ${selectedCause === c.id ? "text-primary" : "text-on-surface-variant"}`}>
                        {c.icon}
                      </span>
                      <span>{c.label}</span>
                    </div>
                    {selectedCause === c.id && (
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-4">
              <label htmlFor={`${formIdPrefix}-amount-select`} className="block font-headline-md text-lg text-on-surface font-semibold">
                Donation Amount (XOF / FCFA)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { amount: "15000", label: "15,000 FCFA", approx: "~$25" },
                  { amount: "30000", label: "30,000 FCFA", approx: "~$50" },
                  { amount: "60000", label: "60,000 FCFA", approx: "~$100" },
                  { amount: "150000", label: "150,000 FCFA", approx: "~$250" },
                  { amount: "300000", label: "300,000 FCFA", approx: "~$500" },
                ].map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.amount);
                      setCustomAmount("");
                    }}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      selectedAmount === item.amount && !customAmount
                        ? "border-secondary bg-secondary-fixed/30 text-secondary font-bold shadow-xs"
                        : "border-outline-variant hover:border-secondary/40 text-on-surface"
                    }`}
                  >
                    <div className="font-headline-md text-base">{item.label}</div>
                    <div className="font-label-md text-xs text-on-surface-variant">{item.approx}</div>
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="pt-2">
                <label htmlFor={`${formIdPrefix}-custom-amount`} className="block font-label-md text-xs text-on-surface-variant mb-1 font-medium">
                  Or enter a custom amount (FCFA / USD / EUR)
                </label>
                <div className="relative">
                  <input
                    id={`${formIdPrefix}-custom-amount`}
                    type="number"
                    placeholder="e.g. 50000"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("");
                    }}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-body-md"
                  />
                  <span className="absolute right-4 top-3 font-label-md text-sm text-on-surface-variant font-semibold">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Dynamic Reference Code Box */}
              <div className="mt-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    {t("paymentRefLabel")}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-label-md text-xs font-bold">
                    Auto-Generated
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-outline-variant">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-primary">
                    {referenceCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(referenceCode, "referenceCode")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-on-primary font-label-md text-xs hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>{copiedKey === "referenceCode" ? t("copied") : t("copy")}</span>
                  </button>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant italic">
                  💡 {t("paymentRefTip")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: OFFICIAL BANK & TRANSFER ACCOUNTS (TABBED) ────── */}
        <section className="bg-surface rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-sm space-y-8">
          <div className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold flex items-center gap-3">
                <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                {t("bankTabsTitle")}
              </h2>
            </div>

            {/* Tabs Header */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-surface-container-low rounded-xl border border-outline-variant">
              <button
                type="button"
                onClick={() => setActiveTab("local")}
                className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all ${
                  activeTab === "local"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t("tabLocal")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("intl")}
                className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all ${
                  activeTab === "intl"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t("tabIntl")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("momo")}
                className={`px-4 py-2 rounded-lg font-label-md text-sm font-semibold transition-all ${
                  activeTab === "momo"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t("tabMomo")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Details Cards (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeTab === "local" ? localBankDetails : activeTab === "intl" ? intlBankDetails : momoDetails).map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant hover:border-primary/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                        {detail.labelKey}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(detail.value, `detail-${idx}`)}
                        className="text-primary hover:text-primary-container transition-colors p-1"
                        title={t("copy")}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedKey === `detail-${idx}` ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-on-surface break-all">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions Callout */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-primary font-body-md text-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">info</span>
                <div>
                  <strong className="font-semibold">Notice for Donors:</strong> Please ensure that your transfer is made to the exact account name <code className="bg-primary/10 px-1 py-0.5 rounded font-mono text-xs font-bold">NGO-ABOI</code>. Always include your reference code <code className="bg-primary/10 px-1 py-0.5 rounded font-mono text-xs font-bold">{referenceCode}</code> in the transaction description.
                </div>
              </div>
            </div>

            {/* Visual Bank Transfer Slip Card (Right 1 col) */}
            <div className="lg:col-span-1 bg-gradient-to-br from-tertiary to-primary-container text-on-primary p-6 rounded-2xl shadow-md border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="NGO ABOI" className="h-8 w-auto bg-white/90 rounded p-1" />
                    <span className="font-headline-md text-lg font-bold text-white">NGO-ABOI</span>
                  </div>
                  <span className="font-label-md text-xs bg-white/10 px-2.5 py-1 rounded-full text-surface-bright font-semibold">
                    BENIN
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-primary-fixed">
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">Beneficiary</div>
                    <div className="text-sm font-bold text-white">NGO-ABOI</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">BOA Account (RIB)</div>
                    <div className="text-sm font-bold text-secondary-fixed-dim">01001-012345678901-45</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">Payment Reference</div>
                    <div className="text-sm font-bold text-white bg-white/10 px-2 py-1 rounded inline-block">
                      {referenceCode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                <div className="text-[11px] text-white/80">
                  <div>Official IFU: 6202490658768</div>
                  <div className="font-semibold text-secondary-fixed-dim">100% Tax Deductible</div>
                </div>
                <div className="bg-white p-1.5 rounded-lg">
                  {/* SVG QR Code Simulation */}
                  <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,2H10V10H2V2M4,4V8H8V4H4M11,2H13V4H11V2M14,2H22V10H14V2M16,4V8H20V4H16M2,14H10V22H2V14M4,16V20H8V16H4M19,14V17H22V19H19V22H17V19H14V17H17V14H19M11,14V16H13V14H11M11,17V22H13V17H11Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: STEP BY STEP GUIDE ───────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">
              {t("instructionsTitle")}
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Follow these three simple steps to ensure your direct contribution is safely received and verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-xs space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-headline-lg font-bold text-xl">
                1
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("step1Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("step1Desc")}
              </p>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-xs space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center font-headline-lg font-bold text-xl">
                2
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("step2Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("step2Desc")}
              </p>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-xs space-y-3 relative">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-headline-lg font-bold text-xl">
                3
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("step3Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("step3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: TRANSFER CONFIRMATION FORM ────────────────────── */}
        <section className="bg-surface rounded-2xl p-6 sm:p-10 border border-outline-variant shadow-sm space-y-8">
          <div className="border-b border-outline-variant pb-4">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold flex items-center gap-3">
              <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              {t("confirmTitle")}
            </h2>
            <p className="font-body-md text-on-surface-variant mt-1">
              {t("confirmSubtitle")}
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-8 rounded-2xl bg-primary/10 border border-primary text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
              </div>
              <h3 className="font-headline-lg text-2xl font-bold text-primary">
                {t("successTitle")}
              </h3>
              <p className="font-body-md text-on-surface">
                {t("successMessage")}
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-colors"
              >
                Send Another Notification
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitNotification} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submitError && (
                <div className="md:col-span-2 p-4 rounded-xl bg-error-container text-on-error-container font-body-md text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-donor-name`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("donorName")} *
                </label>
                <input
                  id={`${formIdPrefix}-donor-name`}
                  type="text"
                  required
                  placeholder={t("donorNamePlaceholder")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-donor-email`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("donorEmail")} *
                </label>
                <input
                  id={`${formIdPrefix}-donor-email`}
                  type="email"
                  required
                  placeholder={t("donorEmailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-donor-phone`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("donorPhone")}
                </label>
                <input
                  id={`${formIdPrefix}-donor-phone`}
                  type="text"
                  placeholder={t("donorPhonePlaceholder")}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Amount Sent */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-amount-sent`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("amountSent")}
                </label>
                <input
                  id={`${formIdPrefix}-amount-sent`}
                  type="text"
                  placeholder={t("amountSentPlaceholder")}
                  value={formData.amountSent}
                  onChange={(e) => setFormData({ ...formData, amountSent: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Bank/Method Used */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-bank-used`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("bankUsed")}
                </label>
                <input
                  id={`${formIdPrefix}-bank-used`}
                  type="text"
                  placeholder={t("bankUsedPlaceholder")}
                  value={formData.bankUsed}
                  onChange={(e) => setFormData({ ...formData, bankUsed: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Transaction Reference */}
              <div className="space-y-1.5">
                <label htmlFor={`${formIdPrefix}-trans-ref`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("transRef")} *
                </label>
                <input
                  id={`${formIdPrefix}-trans-ref`}
                  type="text"
                  required
                  placeholder={t("transRefPlaceholder")}
                  value={formData.transRef}
                  onChange={(e) => setFormData({ ...formData, transRef: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Notes / Message */}
              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor={`${formIdPrefix}-notes`} className="block font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t("notes")}
                </label>
                <textarea
                  id={`${formIdPrefix}-notes`}
                  rows={3}
                  placeholder={t("notesPlaceholder")}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-primary text-on-primary font-headline-md text-base font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      <span>{t("submitting")}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      <span>{t("submitConfirm")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ── SECTION 5: WHY DIRECT BANK TRANSFERS ────────────────────── */}
        <section className="bg-surface-container-low rounded-2xl p-6 sm:p-10 border border-outline-variant space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">
              {t("whyBankTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">percent</span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("why1Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("why1Desc")}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("why2Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("why2Desc")}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-3">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">receipt_long</span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                {t("why3Title")}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                {t("why3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: FAQ ACCORDION ───────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">
              {t("faqTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-2">
              <h3 className="font-headline-md text-base font-bold text-on-surface flex items-start gap-2">
                <span className="text-primary font-bold">Q.</span>
                <span>{t("faq1Q")}</span>
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant pl-5">
                {t("faq1A")}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-2">
              <h3 className="font-headline-md text-base font-bold text-on-surface flex items-start gap-2">
                <span className="text-primary font-bold">Q.</span>
                <span>{t("faq2Q")}</span>
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant pl-5">
                {t("faq2A")}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-2">
              <h3 className="font-headline-md text-base font-bold text-on-surface flex items-start gap-2">
                <span className="text-primary font-bold">Q.</span>
                <span>{t("faq3Q")}</span>
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant pl-5">
                {t("faq3A")}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-2">
              <h3 className="font-headline-md text-base font-bold text-on-surface flex items-start gap-2">
                <span className="text-primary font-bold">Q.</span>
                <span>{t("faq4Q")}</span>
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant pl-5">
                {t("faq4A")}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
