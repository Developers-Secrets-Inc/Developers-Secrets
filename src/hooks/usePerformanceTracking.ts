'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

// Interface pour les options de suivi des performances
interface PerformanceTrackingOptions {
  componentName: string
  trackRenders?: boolean
  trackMounts?: boolean
  trackUpdates?: boolean
  trackUnmounts?: boolean
  trackInteractions?: boolean
  trackMemory?: boolean
  reportThreshold?: number // en ms
  sampleRate?: number // entre 0 et 1
  debugMode?: boolean
}

// Interface pour les métriques de performance
interface PerformanceMetrics {
  componentName: string
  renderCount: number
  mountTime?: number
  updateTimes: number[]
  interactionTimes: Record<string, number[]>
  memoryUsage?: number
  lastRenderDuration?: number
  totalRenderTime: number
  averageRenderTime: number
}

/**
 * Hook avancé pour le suivi des performances des composants React
 * Utilise l'API Performance et les Refs pour suivre les métriques sans affecter les performances
 */
export function usePerformanceTracking({
  componentName,
  trackRenders = true,
  trackMounts = true,
  trackUpdates = true,
  trackUnmounts = false,
  trackInteractions = false,
  trackMemory = false,
  reportThreshold = 16, // 16ms = 1 frame à 60fps
  sampleRate = 0.1, // Échantillonnage de 10% par défaut
  debugMode = false,
}: PerformanceTrackingOptions): {
  metrics: PerformanceMetrics
  trackInteraction: (name: string) => () => void
  trackOperation: <T>(name: string, operation: () => T) => T
  ref: React.RefObject<HTMLElement>
} {
  // Vérifier si nous sommes côté client
  const [isClient, setIsClient] = useState(false)
  
  // Référence pour l'élément DOM
  const ref = useRef<HTMLElement>(null)
  
  // Référence pour les métriques de performance
  const metricsRef = useRef<PerformanceMetrics>({
    componentName,
    renderCount: 0,
    updateTimes: [],
    interactionTimes: {},
    totalRenderTime: 0,
    averageRenderTime: 0,
  })
  
  // Référence pour le temps de début du rendu
  const renderStartTimeRef = useRef<number>(0)
  
  // Déterminer si ce rendu doit être échantillonné (uniquement côté client)
  const shouldSample = useRef(true) // Valeur par défaut sûre pour SSR
  
  // Initialiser les valeurs côté client uniquement
  useEffect(() => {
    setIsClient(true)
    shouldSample.current = Math.random() < sampleRate
    renderStartTimeRef.current = performance.now()
  }, [sampleRate])
  
  // Fonction pour suivre une interaction utilisateur
  const trackInteraction = useCallback(
    (name: string) => {
      return () => {
        if (!isClient || !trackInteractions || !shouldSample.current) return

        const startTime = performance.now()

        // Retourner une fonction pour mesurer la fin de l'interaction
        return () => {
          const endTime = performance.now()
          const duration = endTime - startTime

          if (!metricsRef.current.interactionTimes[name]) {
            metricsRef.current.interactionTimes[name] = []
          }

          metricsRef.current.interactionTimes[name].push(duration)

          if (debugMode && duration > reportThreshold) {
            console.debug(`[Performance] Interaction "${name}" took ${duration.toFixed(2)}ms`)
          }
        }
      }
    },
    [isClient, trackInteractions, reportThreshold, debugMode]
  )
  
  // Fonction pour suivre une opération
  const trackOperation = useCallback(
    <T>(name: string, operation: () => T): T => {
      if (!isClient || !trackInteractions || !shouldSample.current) return operation()

      const startTime = performance.now()
      try {
        return operation()
      } finally {
        const endTime = performance.now()
        const duration = endTime - startTime

        if (!metricsRef.current.interactionTimes[name]) {
          metricsRef.current.interactionTimes[name] = []
        }

        metricsRef.current.interactionTimes[name].push(duration)

        if (debugMode && duration > reportThreshold) {
          console.debug(`[Performance] Operation "${name}" took ${duration.toFixed(2)}ms`)
        }
      }
    },
    [isClient, trackInteractions, reportThreshold, debugMode]
  )
  
  // Effet pour le suivi du montage et du démontage
  useEffect(() => {
    if (!isClient) return
    
    // Suivre le montage
    if (trackMounts && shouldSample.current) {
      metricsRef.current.mountTime = performance.now()
      
      if (debugMode) {
        console.debug(`[Performance] Component "${componentName}" mounted`)
      }
    }
    
    // Suivre le démontage
    return () => {
      if (trackUnmounts && shouldSample.current) {
        const unmountTime = performance.now()
        const lifetimeDuration = unmountTime - (metricsRef.current.mountTime || unmountTime)
        
        if (debugMode) {
          console.debug(
            `[Performance] Component "${componentName}" unmounted after ${lifetimeDuration.toFixed(2)}ms`
          )
          console.debug(`[Performance] Final metrics for "${componentName}":`, metricsRef.current)
        }
      }
    }
  }, [isClient, componentName, trackMounts, trackUnmounts, debugMode])
  
  // Effet pour le suivi des rendus
  useEffect(() => {
    if (!isClient || !trackRenders || !shouldSample.current) return
    
    // Calculer la durée du rendu
    const renderEndTime = performance.now()
    const renderDuration = renderEndTime - renderStartTimeRef.current
    
    // Mettre à jour les métriques
    metricsRef.current.renderCount++
    metricsRef.current.lastRenderDuration = renderDuration
    metricsRef.current.totalRenderTime += renderDuration
    metricsRef.current.averageRenderTime = 
      metricsRef.current.totalRenderTime / metricsRef.current.renderCount
    
    if (trackUpdates && metricsRef.current.renderCount > 1) {
      metricsRef.current.updateTimes.push(renderDuration)
    }
    
    // Journaliser si la durée dépasse le seuil
    if (debugMode && renderDuration > reportThreshold) {
      console.debug(
        `[Performance] Component "${componentName}" render #${
          metricsRef.current.renderCount
        } took ${renderDuration.toFixed(2)}ms`
      )
    }
    
    // Suivre l'utilisation de la mémoire si demandé
    if (trackMemory && 'memory' in performance) {
      // @ts-ignore - L'API memory n'est pas standard
      metricsRef.current.memoryUsage = performance.memory?.usedJSHeapSize
    }
    
    // Enregistrer le temps de début du prochain rendu
    renderStartTimeRef.current = performance.now()
  }, [isClient, componentName, trackRenders, trackUpdates, trackMemory, reportThreshold, debugMode])
  
  return {
    metrics: metricsRef.current,
    trackInteraction,
    trackOperation,
    ref,
  }
}