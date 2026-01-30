"use client";

import {
  Globe,
  DollarSign,
  Clock,
  Bell,
  Shield,
  Link2,
  Smartphone,
  Lock,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
  };
}

export function ProfileContent({ user }: ProfileContentProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Profile & Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Information */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Account Information</h2>
          <p className="text-sm text-muted-foreground">Your basic account details</p>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your regional and display preferences
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <DollarSign className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Default Currency</p>
                  <p className="text-xs text-muted-foreground">Used for expense tracking</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                USD <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Globe className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">Interface language</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                English <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Clock className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Timezone</p>
                  <p className="text-xs text-muted-foreground">Used for date/time display</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                UTC-8 <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Connect external services to track expenses anywhere
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Telegram */}
          <Card className="group relative overflow-hidden border-[#0088cc]/20 transition-all hover:border-[#0088cc]/40 hover:shadow-lg hover:shadow-[#0088cc]/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[#0088cc]/5 transition-transform group-hover:scale-110" />
            <CardContent className="relative p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0088cc]/10">
                    <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0088cc" }}>
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c.18 3.994-.99 6.683-2.96 8.66-1.97 1.977-4.66 3.14-8.66 2.96l-.496-.043c.41-.14.81-.32 1.18-.54.94-.56 1.71-1.34 2.24-2.26.53-.92.81-1.98.81-3.06 0-3.31-2.69-6-6-6-.55 0-1.08.09-1.58.25C1.77 6.03 2 4.77 2 3.45c0-.41.03-.82.1-1.22C3.73.94 5.77 0 8 0c4.27 0 7.93 2.66 9.44 6.42.08.21.16.43.23.65.35 1.08.53 2.22.53 3.38z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Telegram</p>
                    <p className="text-xs text-muted-foreground">@kashio_bot</p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 sm:self-start">
                  Connected
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Log expenses via Telegram</p>
            </CardContent>
          </Card>

          {/* Discord */}
          <Card className="group relative overflow-hidden border-[#5865F2]/20 transition-all hover:border-[#5865F2]/40 hover:shadow-lg hover:shadow-[#5865F2]/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[#5865F2]/5 transition-transform group-hover:scale-110" />
            <CardContent className="relative p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/10">
                    <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#5865F2" }}>
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Discord</p>
                    <p className="text-xs text-muted-foreground">Bot commands</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full shrink-0 sm:w-auto sm:self-start">
                  <Link2 className="mr-1.5 size-3.5" />
                  Connect
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Track expenses in Discord</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account security and active sessions
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Lock className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Change
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Shield className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Enable
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Smartphone className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Active Sessions</p>
                  <p className="text-xs text-muted-foreground">Devices where you're signed in</p>
                </div>
              </div>
              <div className="space-y-2 sm:ml-12">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                      <svg className="size-4 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-medium">MacBook Pro</p>
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">San Francisco, US • Last active now</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" disabled className="shrink-0">
                    <LogOut className="size-3.5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                      <Smartphone className="size-4 text-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">iPhone 15 Pro</p>
                      <p className="text-xs text-muted-foreground">San Francisco, US • 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <LogOut className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Choose what you want to be notified about
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Bell className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Expense Reminders</p>
                  <p className="text-xs text-muted-foreground">Daily reminder to log expenses</p>
                </div>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <DollarSign className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Budget Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when approaching budget limits
                  </p>
                </div>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Bell className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Weekly Summary</p>
                  <p className="text-xs text-muted-foreground">Receive weekly spending report</p>
                </div>
              </div>
              <Switch className="shrink-0" />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Bell className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Product Updates</p>
                  <p className="text-xs text-muted-foreground">News about features and updates</p>
                </div>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data & Privacy */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Data & Privacy</h2>
          <p className="text-sm text-muted-foreground">
            Control your data and privacy settings
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Shield className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Data Sharing</p>
                  <p className="text-xs text-muted-foreground">Share anonymous usage data</p>
                </div>
              </div>
              <Switch defaultChecked className="shrink-0" />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Download className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download all your expense data</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Export
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                  <Trash2 className="size-4 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and data
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="shrink-0">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
