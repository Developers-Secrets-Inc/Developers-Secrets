# Authentification

On utilises Supabase Auth pour gérer l'authentification dans la plateforme

## Utilisateur

1. Les préférences (thème, notifications, langue, etc.) sont stockées dans la table dédiée ou directement intégrées dans l'objet utilisateur.
2. On a un type `User` qui gère tout pour les utilisateurs

**Quelles sont les informations stockées pour un utilisateur ?**

- On a toutes les informations de base stockées par Supabase Auth
- On doit stocker les préférences utilisateur
  - On doit stocker la langue qu'il préfère (fr, en, es, etc.)
  - On doit stocker le thème qu'il préfère (light, dark, system)
  - On doit stocker les notifications qu'il souhaite recevoir
    - On doit stocker les notifications de la plateforme
      - Notifications pour les nouveaux articles
      - Notifications pour les réponses aux commentaires
      - Notifications pour les mises à jour de cours
    - On doit stocker les préférences emails
      - Newsletter hebdomadaire
      - Emails marketing
      - Emails de sécurité (toujours activés)
      - Fréquence des emails (quotidien, hebdomadaire, mensuel)
- On doit stocker les différentes permissions de l'utilisateur
  - Rôles (admin, modérateur, utilisateur standard)
  - Permissions spécifiques (créer du contenu, éditer du contenu, supprimer du contenu)
  - Accès aux sections premium
- On doit savoir si l'utilisateur est premium ou non
  - Date de début d'abonnement
  - Date de fin d'abonnement
  - Type d'abonnement (mensuel, annuel)
  - Historique des paiements
  - Méthode de paiement utilisée
- Informations de profil supplémentaires
  - Pseudo/nom d'utilisateur (unique)
  - Nom complet
  - Bio/description
  - Avatar/photo de profil
  - Site web personnel
  - Liens vers réseaux sociaux
  - Date de naissance
  - Localisation/pays

### Structure des données

1. On doit créer une nouvelle collection PayloadCMS appelée `UserPreferences` avec les champs suivants:

   - `userId`: string
   - `language`: enum ('fr', 'en', 'es', etc.)
   - `theme`: enum ('light', 'dark', 'system')
   - `platformNotifications`: objet avec des booléens pour chaque type de notification (on doit comprendre quels sont les types de notifications qu'on veut afficher)
   - `emailPreferences`: objet avec des paramètres pour les emails
   - `lastUpdated`: timestamp

2. On doit créer une nouvelle collection PayloadCMS appelée `UserPermissions` avec les champs suivants:

   - `userId`: string
   - `role`: enum ('admin', 'moderator', 'user')
   - `permissions`: relation avec la collection Permissions (multiple)
   - `lastUpdated`: timestamp

3. On doit créer une nouvelle collection PayloadCMS appelée `Permissions` avec les champs suivants:

   - `name`: string (unique)
   - `description`: string
   - `scope`: string (domaine d'application de la permission)
   - `isActive`: booléen

4. On doit créer une nouvelle collection PayloadCMS appelée `UserSubscription` avec les champs suivants:

   - `userId`: string
   - `isPremium`: booléen
   - `subscriptionType`: enum ('monthly', 'yearly', 'lifetime')
   - `startDate`: date
   - `endDate`: date
   - `autoRenew`: booléen
   - `paymentMethod`: string
   - `paymentHistory`: relation avec la collection PaymentHistory (multiple)

5. On doit créer une nouvelle collection PayloadCMS appelée `UserProfile` avec les champs suivants:

   - `userId`: string
   - `username`: string (unique)
   - `fullName`: string
   - `bio`: text
   - `avatar`: media (image)
   - `website`: string (URL)
   - `socialLinks`: objet avec les liens vers les réseaux sociaux
   - `dateOfBirth`: date
   - `location`: string
   - `createdAt`: timestamp
   - `updatedAt`: timestamp

6. On doit créer une nouvelle collection PayloadCMS appelée `PaymentHistory` avec les champs suivants:
   - `userId`: string
   - `amount`: nombre (montant du paiement)
   - `currency`: string (EUR, USD, etc.)
   - `status`: enum ('completed', 'pending', 'failed', 'refunded')
   - `paymentMethod`: string (carte, PayPal, etc.)
   - `transactionId`: string (identifiant unique de la transaction)
   - `description`: string (description du paiement)
   - `paymentDate`: date
   - `metadata`: objet JSON (données supplémentaires)

### Hooks et middleware

## Créer un compte

1. Chaque utilisateur doit avoir un pseudo.
2. On peut créer un compte avec Google ou GitHub comme provider OAuth2

- On a la route `/auth/signup/page.tsx` pour créer un compte.







## Se connecter

- On a la route `/auth/signin/page.tsx` pour se connecter.



## Réinitialiser son mot de passe

- On a la route `/auth/reset-password/page.tsx` pour réinitialiser son mot de passe.



## Profil utilisateur




## Paramètres utilisateur

- On a la route `/settings/page.tsx` pour gérer les paramètres utilisateur.


  ```tsx
  // /components/settings/profile-settings.tsx
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useForm } from 'react-hook-form'
  import { z } from 'zod'
  import { Button } from '@/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
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
  import { Textarea } from '@/components/ui/textarea'
  import { AvatarUpload } from '@/components/ui/avatar-upload'
  import { updateUserProfile } from '@/lib/supabase/user'
  import { toast } from '@/components/ui/use-toast'

  const profileFormSchema = z.object({
    username: z.string().min(3).max(30),
    fullName: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    website: z.string().url().optional().or(z.literal('')),
    avatar: z.string().optional(),
    socialLinks: z
      .object({
        twitter: z.string().url().optional().or(z.literal('')),
        github: z.string().url().optional().or(z.literal('')),
        instagram: z.string().url().optional().or(z.literal('')),
      })
      .optional(),
  })

  export function ProfileSettings({ profile }) {
    const form = useForm({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        username: profile.username,
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar: profile.avatar || '',
        socialLinks: profile.socialLinks || {
          twitter: '',
          github: '',
          instagram: '',
        },
      },
    })

    async function onSubmit(data) {
      try {
        await updateUserProfile(data)
        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations de profil ont été mises à jour avec succès.',
        })
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour de votre profil.',
          variant: 'destructive',
        })
      }
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations de profil</CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles et comment les autres vous voient sur la
            plateforme.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <AvatarUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Cette image sera affichée sur votre profil et dans vos commentaires.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>Votre identifiant unique sur la plateforme.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Votre nom tel qu'il apparaîtra sur votre profil.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Parlez-nous de vous..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Une courte description qui apparaîtra sur votre profil.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris, France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://votresite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel>Réseaux sociaux</FormLabel>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Twitter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="GitHub URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Instagram URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    )
  }
  ```

## Déconnexion
