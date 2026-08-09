"use client";

import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl">
      <div className="mb-xl text-center md:text-left">
        <h1 className="font-display-lg text-display-lg text-on-background mb-sm">
          {t("title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left Column: Info */}
        <div className="lg:col-span-5 flex flex-col gap-xl">
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-md">
              {t("becomePartner")}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              {t("howToCollaborate")}
            </p>
            <ul className="space-y-sm">
              {[
                {
                  icon: "handshake",
                  key: "technical",
                },
                {
                  icon: "payments",
                  key: "financial",
                },
                {
                  icon: "account_balance",
                  key: "waqf",
                },
              ].map((item) => (
                <li
                  key={item.key}
                  className="flex items-start gap-sm"
                >
                  <span className="material-symbols-outlined text-primary-container mt-1">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-background">
                      {t(`${item.key}Title`)}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {t(`${item.key}Desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="h-px w-full bg-outline-variant" />

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-md">
              {t("contactDetails")}
            </h2>
            <div className="space-y-md bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
              {[
                {
                  icon: "location_on",
                  key: "headquarters",
                },
                {
                  icon: "call",
                  key: "phone",
                },
                {
                  icon: "mail",
                  key: "email",
                },
                {
                  icon: "schedule",
                  key: "officeHours",
                },
                {
                  icon: "badge",
                  key: "ifu",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-background">
                      {t(item.key)}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {t(`${item.key}Value`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl p-md lg:p-lg border border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.05)] h-full">
            <h3 className="font-headline-md text-headline-md text-on-background mb-lg">
              {t("sendMessage")}
            </h3>
            <form
              action="#"
              className="space-y-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-background mb-xs"
                    htmlFor="name"
                  >
                    {t("fullName")}
                  </label>
                  <input
                    className="w-full h-12 rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-background px-3"
                    id="name"
                    name="name"
                    placeholder={t("fullNamePlaceholder")}
                    type="text"
                  />
                </div>
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-background mb-xs"
                    htmlFor="structure"
                  >
                    {t("structureType")}
                  </label>
                  <select
                    className="w-full h-12 rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-background px-3"
                    id="structure"
                    name="structure"
                    defaultValue=""
                  >
                    <option disabled value="">
                      {t("structurePlaceholder")}
                    </option>
                    <option value="ngo">{t("optionNgo")}</option>
                    <option value="corporation">{t("optionCorporation")}</option>
                    <option value="government">{t("optionGovernment")}</option>
                    <option value="individual">{t("optionIndividual")}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-background mb-xs"
                    htmlFor="email"
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    className="w-full h-12 rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-background px-3"
                    id="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                    type="email"
                  />
                </div>
                <div>
                  <label
                    className="block font-label-md text-label-md text-on-background mb-xs"
                    htmlFor="phone"
                  >
                    {t("phoneNumber")}
                  </label>
                  <input
                    className="w-full h-12 rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-background px-3"
                    id="phone"
                    name="phone"
                    placeholder={t("phonePlaceholder")}
                    type="tel"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block font-label-md text-label-md text-on-background mb-xs"
                  htmlFor="subject"
                >
                  {t("subject")}
                </label>
                <select
                  className="w-full h-12 rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-background px-3"
                  id="subject"
                  name="subject"
                  defaultValue=""
                >
                  <option disabled value="">
                    {t("subjectPlaceholder")}
                  </option>
                  <option value="technical">
                    {t("subjTechnical")}
                  </option>
                  <option value="financial">
                    {t("subjFinancial")}
                  </option>
                  <option value="waqf">{t("subjWaqf")}</option>
                  <option value="general">{t("subjGeneral")}</option>
                </select>
              </div>
              <div>
                <label
                  className="block font-label-md text-label-md text-on-background mb-xs"
                  htmlFor="message"
                >
                  {t("message")}
                </label>
                <textarea
                  className="w-full rounded border-outline-variant bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md text-on-surface-variant resize-none px-3 py-2"
                  id="message"
                  name="message"
                  placeholder={t("messagePlaceholder")}
                  rows={5}
                />
              </div>
              <div className="pt-sm">
                <button
                  className="w-full md:w-auto bg-primary-container text-on-primary hover:bg-primary transition-colors duration-200 px-lg py-sm rounded font-label-md text-label-md flex items-center justify-center gap-xs"
                  type="submit"
                >
                  {t("submitRequest")}
                  <span className="material-symbols-outlined text-sm">
                    send
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
