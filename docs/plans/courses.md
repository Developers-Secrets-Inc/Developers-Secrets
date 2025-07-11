# Plan de développement – Système de formations

## 1. Modélisation des entités et relations

### 1.1. Entités principales

- **Course** (Formation)
  - id, slug, name, description, difficulty (enum), tags, status (draft/review/published), archived (bool), visibility (roles), prerequisites (array de Course), chapters (array de Chapter)
- **Chapter** (Chapitre)
  - id, slug, name, description, courseId (FK), order, parts (array de Part), prerequisites (array de Chapter)
- **Part** (Partie)
  - id, slug, name, description, chapterId (FK), order, solution, engagement, exercice (Challenge | Quiz | undefined)
- **UserCourseProgress**
  - userId, courseId, startedAt, completedAt, lastVisitedAt, isFavorite, unlocked (bool), unlockedByTest (bool), percentComplete
- **UserChapterProgress**
  - userId, chapterId, status (locked/unlocked/completed)
- **UserPartProgress**
  - userId, partId, status (locked/unlocked/completed)
- **Tag** (optionnel, pour catégorisation)

### 1.2. Relations

- Course 1—N Chapter
- Chapter 1—N Part
- Chapter N—N Chapter (prérequis)
- Course N—N Course (prérequis)
- User N—N Course (via UserCourseProgress)
- User N—N Chapter (via UserChapterProgress)
- User N—N Part (via UserPartProgress)

---

## 2. Organisation des dossiers

- `/courses/courses/` : logique serveur pour les formations (server actions, types, helpers)
- `/courses/chapters/` : logique serveur pour les chapitres
- `/courses/parts/` : logique serveur pour les parties
- `/courses/progress/` : logique serveur pour la progression utilisateur
- `/courses/tags/` : logique serveur pour les tags (optionnel)
- (Aucun endpoint HTTP, pas de `/app/api/`)

---

## 3. Fonctions serveur à implémenter (server actions)

### 3.1. Courses
- `getAllCourses({ filters, pagination, userId })`
- `getCourseBySlug(slug, userId)`
- `createCourse(data)`
- `updateCourse(id, data)`
- `archiveCourse(id)`
- `setCourseStatus(id, status)`
- `getCoursePrerequisitesStatus(courseId, userId)`
- `getUserCourseProgress(courseId, userId)`
- `toggleFavoriteCourse(courseId, userId)`

### 3.2. Chapters
- `getChaptersByCourse(courseId)`
- `getChapterBySlug(courseId, chapterSlug, userId)`
- `getUserChapterProgress(chapterId, userId)`
- `getChapterPrerequisitesStatus(chapterId, userId)`

### 3.3. Parts
- `getPartsByChapter(chapterId)`
- `getPartBySlug(chapterId, partSlug, userId)`
- `getUserPartProgress(partId, userId)`
- `submitPartExercise(partId, userId, payload)`

### 3.4. Progression
- `startCourse(courseId, userId)`
- `completeCourse(courseId, userId)`
- `visitCourse(courseId, userId)`
- `unlockCourseByTest(courseId, userId)`
- `updateProgressOnPartCompletion(partId, userId)`

---

## 4. Pages à développer (dans `/app/courses`)

- `/courses` : liste des formations (filtrage, recherche, favoris, progression)
- `/courses/[course_slug]` : détail d’une formation (infos, progression, chapitres, accès, statut, favoris)
- `/courses/[course_slug]/[chapter_slug]` : détail d’un chapitre (liste des parties, progression, statut, prérequis)
- `/courses/[course_slug]/[chapter_slug]/[part_slug]` : détail d’une partie (contenu, exercice, validation, progression)

---

## 5. Permissions & visibilité

- Gestion de la visibilité des formations selon le rôle utilisateur (via gestion des utilisateurs, pas dans le domaine formation)
- Accès aux formations archivées réservé à certains rôles (contrôlé par la logique utilisateur)
- Statut de déblocage (prérequis ou test d’entrée)

---

## 6. Progression utilisateur

- Calcul du pourcentage de complétion d’une formation (via progression des chapitres/parties)
- Stockage des dates de début, fin, visites, favoris
- Statut de chaque formation/chapitre/partie pour l’utilisateur (bloqué/débloqué/complet)

---

## 7. Tests & validation

- Tests unitaires sur la logique de progression, de déblocage, de permissions
- Tests d’intégration sur les flux principaux (inscription, navigation, progression)

---

## 8. Documentation & checklist

- Diagramme entité-relation
- Checklist de conformité aux formes normales (voir règle Cursor)
- Documentation des server actions
