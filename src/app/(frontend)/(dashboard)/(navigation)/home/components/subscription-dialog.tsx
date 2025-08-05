"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, Check, Crown, Zap, BookOpen, Users, Trophy, Code, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SubscriptionDialogProps {
  open: boolean
  onClose: () => void
}

export const SubscriptionDialog = ({ open, onClose }: SubscriptionDialogProps) => {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleClose = () => {
    onClose()
    setStep(1)
    // Remove the subscribed parameter from URL
    router.replace('/home')
  }

  const handleContinue = () => {
    if (step < stepContent.length) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const stepContent = [
    {
      title: "🎉 Bienvenue dans l'équipe Pro !",
      description: "Vous avez franchi une étape importante. Découvrez tout ce que vous débloquez maintenant.",
      content: (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Statut Pro Activé</h3>
            <p className="text-sm text-muted-foreground mt-2">Accès premium débloqué</p>
          </div>
        </div>
      )
    },
    {
      title: "📚 Contenu Illimité",
      description: "Explorez notre bibliothèque complète de ressources premium.",
      content: (
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <BookOpen className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Tous les cours premium</h4>
              <p className="text-xs text-muted-foreground">+50 cours avancés</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Code className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Défis exclusifs</h4>
              <p className="text-xs text-muted-foreground">Challenges avancés chaque semaine</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Outils professionnels</h4>
              <p className="text-xs text-muted-foreground">IDE cloud et sandbox avancés</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
      )
    },
    {
      title: "🤝 Communauté & Support",
      description: "Rejoignez notre communauté privée et bénéficiez d'un support prioritaire.",
      content: (
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 text-purple-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Discord Premium</h4>
              <p className="text-xs text-muted-foreground">Accès aux canaux privés</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Star className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Mentors dédiés</h4>
              <p className="text-xs text-muted-foreground">Support prioritaire 24/7</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Trophy className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Certifications</h4>
              <p className="text-xs text-muted-foreground">Badges et certificats officiels</p>
            </div>
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
      )
    },
    {
      title: "🚀 Prêt à commencer ?",
      description: "Votre aventure Pro commence maintenant. Explorons ensemble !",
      content: (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Tout est prêt !</h3>
          <p className="text-sm text-muted-foreground">
            Commencez par explorer les nouveaux cours premium ou rejoignez la communauté.
          </p>
        </div>
      )
    }
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {stepContent[step - 1].title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {stepContent[step - 1].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {stepContent[step - 1].content}
        </div>

        <div className="flex items-center justify-center space-x-1.5 mb-4">
          {[...Array(stepContent.length)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "bg-primary size-1.5 rounded-full transition-all",
                index + 1 === step ? "bg-primary w-6" : "opacity-20"
              )}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Passer
            </Button>
          </DialogClose>
          <Button
            className="group"
            type="button"
            onClick={handleContinue}
          >
            {step < stepContent.length ? (
              <>
                Suivant
                <ArrowRightIcon
                  className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  aria-hidden="true"
                />
              </>
            ) : (
              "Commencer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
