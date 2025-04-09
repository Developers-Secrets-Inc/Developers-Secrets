'use client'

import * as React from 'react'
import { Settings, User, Sliders, CreditCard, Shield, CrownIcon, CheckIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInformations } from '@/core/user/user-informations'
import { UserRole } from '@/core/user/user-informations/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { revokeUserSubscription } from '@/core/payments/subscriptions'
import { updateUserRole } from '@/core/user/user-informations'

const data = {
  nav: [
    { name: 'General', icon: Settings },
    { name: 'Profile', icon: User },
    { name: 'Preferences', icon: Sliders },
    { name: 'Subscription', icon: CreditCard },
    { name: 'Security', icon: Shield },
  ],
}

type SettingsDialogProps = {
  showSettingsDialog: boolean
  setShowSettingsDialog: (show: boolean) => void
  user: {
    id: string
    informations: {
      name: string
      avatar: string
      initials: string
      role: UserRole
      customerId: string
    }
  }
}

const emailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must contain at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const preferencesFormSchema = z.object({
  notifications: z.object({
    friends: z.boolean(),
  }),
  emails: z.object({
    marketing: z.boolean(),
    affiliates: z.boolean(),
  }),
  theme: z.enum(['light', 'dark', 'system']),
})

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url('Avatar URL must be valid').optional(),
  initials: z.string().max(2, 'Initials must not exceed 2 characters').optional(),
})

const subscriptionFeatures = {
  basic: {
    name: 'Basic',
    description: 'Free tier with essential features',
    features: ['Basic access', 'Community support', 'Core features'],
    icon: CreditCard,
  },
  lite: {
    name: 'Lite',
    description: 'Perfect for personal use',
    features: ['Everything in Basic', 'Priority support', 'Advanced features'],
    icon: CrownIcon,
  },
  pro: {
    name: 'Pro',
    description: 'Enhanced features for professionals',
    features: ['Everything in Lite', '24/7 support', 'Pro features', 'API access'],
    icon: CrownIcon,
  },
  max: {
    name: 'Max',
    description: 'Ultimate access to all features',
    features: ['Everything in Pro', 'Dedicated support', 'Custom features', 'Early access'],
    icon: CrownIcon,
  },
}

const subscriptionTiers = {
  basic: 0,
  lite: 1,
  pro: 2,
  max: 3,
} as const

function EmailForm() {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof emailFormSchema>) {
    // TODO: Implement email update logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="new@email.com" {...field} />
              </FormControl>
              <FormDescription>Enter your new email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Email</Button>
      </form>
    </Form>
  )
}

function PasswordForm() {
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof passwordFormSchema>) {
    // TODO: Implement password update logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </Form>
  )
}

function PreferencesForm() {
  const form = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      notifications: {
        friends: true,
      },
      emails: {
        marketing: true,
        affiliates: true,
      },
      theme: 'system',
    },
  })

  function onSubmit(values: z.infer<typeof preferencesFormSchema>) {
    // TODO: Implement preferences update logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <FormField
            control={form.control}
            name="notifications.friends"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Friend Notifications</FormLabel>
                  <FormDescription>Receive notifications about your friends</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emails</h3>
          <FormField
            control={form.control}
            name="emails.marketing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormDescription>Receive emails about our latest news and offers</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emails.affiliates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Affiliate Emails</FormLabel>
                  <FormDescription>Receive emails from our partners</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose the application appearance</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save Preferences</Button>
      </form>
    </Form>
  )
}

function ProfileForm() {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      avatar: '',
      initials: '',
    },
  })

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // TODO: Implement profile update logic
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch('avatar')} />
              <AvatarFallback>{form.watch('initials') || '??'}</AvatarFallback>
            </Avatar>
            <div className="space-y-4 flex-1">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Your profile picture URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>Your full name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initials</FormLabel>
                  <FormControl>
                    <Input placeholder="JD" maxLength={2} {...field} />
                  </FormControl>
                  <FormDescription>Your initials (max 2 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Save Profile</Button>
      </form>
    </Form>
  )
}

function SecurityForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Button variant="outline" disabled>
          <Shield className="mr-2 h-4 w-4" />
          Configure 2FA
        </Button>
      </div>
      <div className="rounded-lg border p-3">
        <div className="flex items-start space-x-4">
          <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Two-factor authentication is not available yet
            </p>
            <p className="text-sm text-muted-foreground">
              This feature will be available soon. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurrentSubscriptionCard({ role }: { role: UserRole }) {
  const subscription = subscriptionFeatures[role]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <subscription.icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{subscription.name} Plan</h3>
          <p className="text-sm text-muted-foreground">{subscription.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        {subscription.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-x-2">
            <CheckIcon className="h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubscriptionActions({
  role,
  user,
}: {
  role: UserRole
  user: { informations: { customerId?: string | null }; id: string }
}) {
  const subscription = subscriptionFeatures[role]
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleCancelSubscription = async () => {
    if (!user.informations.customerId) {
      setError('No customer ID found')
      return
    }

    try {
      setIsPending(true)
      setError(null)

      await revokeUserSubscription(user.informations.customerId)
      await updateUserRole(user.id, 'basic')

      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription')
      console.error('Error cancelling subscription:', err)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-x-2">
        <Button variant="outline" asChild>
          <Link href="/api/portal">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Subscription
          </Link>
        </Button>
        {role !== 'basic' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending} className="text-white">
                {isPending ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your {subscription.name} subscription? You will be
                  downgraded to the Basic plan at the end of your current billing period.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isPending}
                >
                  {isPending ? 'Cancelling...' : 'Yes, Cancel Subscription'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {error && <p className="text-sm text-destructive text-right">{error}</p>}
    </div>
  )
}

function SubscriptionSelector({ role }: { role: UserRole }) {
  const currentTier = subscriptionTiers[role]
  const [isPending, setIsPending] = React.useState(false)

  const handleSubscriptionChange = async (newRole: UserRole) => {
    setIsPending(true)
    // TODO: Implement subscription change logic
    console.log(`Changing subscription from ${role} to ${newRole}`)
    setIsPending(false)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Change Subscription</CardTitle>
        <CardDescription>Upgrade or downgrade your plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={role}
          onValueChange={(value: UserRole) => handleSubscriptionChange(value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(subscriptionFeatures).map(([planRole, plan]) => {
              const planTier = subscriptionTiers[planRole as UserRole]
              const isUpgrade = planTier > currentTier
              const isDowngrade = planTier < currentTier

              return (
                <SelectItem
                  key={planRole}
                  value={planRole}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-x-2">
                    <plan.icon className="h-4 w-4" />
                    <span>{plan.name}</span>
                  </span>
                  {planRole !== role && (
                    <span
                      className={`text-xs ${
                        isUpgrade ? 'text-green-500' : isDowngrade ? 'text-yellow-500' : ''
                      }`}
                    >
                      {isUpgrade ? '(Upgrade)' : isDowngrade ? '(Downgrade)' : ''}
                    </span>
                  )}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <div className="rounded-lg border p-3">
          <div className="flex items-start space-x-4">
            <CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {currentTier < subscriptionTiers.max ? 'Want to upgrade?' : 'Need help?'}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentTier < subscriptionTiers.max
                  ? 'Select a higher tier to access more features.'
                  : 'Contact our support team for assistance with your subscription.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SettingsDialog({
  showSettingsDialog,
  setShowSettingsDialog,
  user,
}: SettingsDialogProps) {
  const [activeItem, setActiveItem] = React.useState('General')

  return (
    <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>
        <SidebarProvider className="items-start" style={{ ['--sidebar-width' as string]: '12rem' }}>
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === activeItem}
                          onClick={() => setActiveItem(item.name)}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-12 py-2 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeItem}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {activeItem === 'General' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email</CardTitle>
                      <CardDescription>Change your email address</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EmailForm />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PasswordForm />
                    </CardContent>
                  </Card>
                </div>
              ) : activeItem === 'Profile' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
              ) : activeItem === 'Preferences' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PreferencesForm />
                  </CardContent>
                </Card>
              ) : activeItem === 'Security' ? (
                <Card>
                  <CardContent>
                    <SecurityForm />
                  </CardContent>
                </Card>
              ) : activeItem === 'Subscription' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>Your current subscription plan and features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CurrentSubscriptionCard role={user.informations.role} />
                    </CardContent>
                  </Card>
                  <SubscriptionSelector role={user.informations.role} />
                  <div className="mt-6">
                    <SubscriptionActions role={user.informations.role} user={user} />
                  </div>
                </div>
              ) : (
                Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-video max-w-3xl rounded-xl bg-muted/50" />
                ))
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
