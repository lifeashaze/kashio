"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Globe, Languages, Clock, Calendar } from "lucide-react";

interface PreferencesStepProps {
  language: string;
  timezone: string;
  dateFormat: string;
  onLanguageChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onDateFormatChange: (value: string) => void;
  onUseBrowserDefaults: () => void;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2026)", region: "US" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2026)", region: "Europe" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2026-12-31)", region: "ISO" },
];

export function PreferencesStep({
  language,
  timezone,
  dateFormat,
  onLanguageChange,
  onTimezoneChange,
  onDateFormatChange,
  onUseBrowserDefaults,
}: PreferencesStepProps) {
  const selectedLanguage = LANGUAGES.find((l) => l.code === language);
  const selectedTimezone = TIMEZONES.find((t) => t.value === timezone);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Customize language, timezone, and date display
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onUseBrowserDefaults}
        className="w-full"
        size="sm"
      >
        <Globe className="w-4 h-4 mr-2" />
        Use Browser Defaults
      </Button>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">
            Language
          </Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger id="language" className="h-11">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-sm font-medium">
            Timezone
          </Label>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger id="timezone" className="h-11">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Date Format</Label>
        <RadioGroup value={dateFormat} onValueChange={onDateFormatChange} className="grid gap-2">
          {DATE_FORMATS.map((format) => {
            const isSelected = dateFormat === format.value;
            return (
              <div
                key={format.value}
                className={`flex items-center space-x-3 border rounded-md px-3 py-2.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/5 border-primary"
                    : "hover:bg-accent"
                }`}
                onClick={() => onDateFormatChange(format.value)}
              >
                <RadioGroupItem value={format.value} id={format.value} />
                <Label htmlFor={format.value} className="font-normal cursor-pointer flex-1 text-sm">
                  {format.label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground mb-2">Current Settings</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Language</span>
            <span className="font-medium">{selectedLanguage?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timezone</span>
            <span className="font-medium">{selectedTimezone?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date Format</span>
            <span className="font-medium font-mono text-xs">{dateFormat}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
