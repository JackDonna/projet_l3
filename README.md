# projet_l3 - RPA

  <summary>Sommaire</summary>
  <ol>
    <li><a href="#getting-started">Getting Started</a></li>
    <li>
      <a href="#rest-api">rest api</a>
      <ul>
        <li><a href="#teacher-controllers">teacher controllers</a></li>
      </ul>
      <ul>
        <li><a href="#event-controllers">event controllers</a></li>
      </ul>
      <ul>
        <li><a href="#absence-controllers">absence controllers</a></li>
      </ul>
      <ul>
        <li><a href="#proposition-controllers">proposition controllers</a></li>
      </ul>
      <ul>
        <li><a href="#diffusion-controllers">diffusion controllers</a></li>
      </ul>
    </li>
    <li><a href="#contacts">Contacts</a></li>
  </ol>

## getting started
Bienvenue sur la documentation de l'API REST de notre projet. Suivez ces étapes pour configurer et exécuter le projet sur votre machine locale.

### Accéder au Site Web
Vous pouvez accéder à notre site web <a href="rdp.dptinfo-usmb.fr">ici</a>.

### Cloner le Projet
Pour commencer, vous devez cloner le dépôt Git de notre projet. Ouvrez votre terminal et exécutez la commande suivante :
```sh
git clone https://github.com/votre-utilisateur/votre-projet.git
```
Assurez-vous de remplacer votre-utilisateur et votre-projet par les noms appropriés de votre compte GitHub et du dépôt.

### Installer les Dépendances
Une fois le projet cloné, naviguez dans le répertoire du projet et installez les dépendances nécessaires avec la commande npm install :

```sh
cd votre-projet
npm install
```
Cette commande installera toutes les dépendances définies dans le fichier `package.json`.

### Lancer le Projet
Après avoir installé les dépendances, vous pouvez lancer le projet en utilisant la commande npm start :

```sh
npm start
```
Cette commande démarrera le serveur et vous pourrez accéder à votre application localement.

### Résumé des Commandes
Voici un résumé des commandes pour vous aider à démarrer rapidement :

#### Cloner le projet :

```sh
git clone https://github.com/votre-utilisateur/votre-projet.git
```
#### Naviguer dans le répertoire du projet :

```sh
cd votre-projet
```
#### Installer les dépendances :

```sh
npm install
```
#### Lancer le projet :

```sh
npm start
```
En suivant ces étapes, vous serez prêt à explorer et développer notre projet sur votre environnement local. Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à consulter la documentation supplémentaire ou à contacter l'équipe de support.

## rest api
Voici la specification des routes du REST API de notre application avec les requêtes ainsi que les méthodes utilisés.

### teacher controllers
#### Sign In
- Route: `/teacher/sign_in/:mail/:password`
- Méthode: GET
- Description: Permet à un enseignant de se connecter avec son email et mot de passe.
- Paramètres:
  - mail: Email de l'enseignant.
  - password: Mot de passe de l'enseignant.
#### Sign In as Admin
- Route: `/teacher/sign_in_as_admin/:mail/:password`
- Méthode: GET
- Description: Permet à un administrateur de se connecter avec son email et mot de passe.
- Paramètres:
  - mail: Email de l'administrateur.
  - password: Mot de passe de l'administrateur.
#### Get Unavailable Teachers
- Route: `/teacher/getUnavailableTeachers`
- Méthode: GET
- Description: Récupère la liste des enseignants indisponibles.
#### Search Teacher
- Route: `/teacher/getTeacher/:name`
- Méthode: GET
- Description: Recherche un enseignant par nom.
- Paramètres:
  - name: Nom de l'enseignant à rechercher.
#### Validate Teacher
- Route: `/teacher/validate`
- Méthode: POST
- Description: Valide l'inscription d'un enseignant.
#### Sign Up
- Route: `/teacher/sign_up`
- Méthode: POST
- Description: Inscrit un nouvel enseignant.

### event controllers
#### Get Timetable
- Route: `/event/get_timetable`
- Méthode: GET
- Description: Récupère l'emploi du temps.
#### Insert Timetable
- Route: `/event/insert_timetable`
- Méthode: POST
- Description: Insère un nouvel emploi du temps.
#### Update Event
- Route: `/event/update/:id`
- Méthode: POST
- Description: Met à jour un événement existant.
- Paramètres:
  - id: ID de l'événement à mettre à jour.
#### Delete Event
- Route: `/event/delete/:id`
- Méthode: DELETE
- Description: Supprime un événement existant.
- Paramètres:
  - id: ID de l'événement à supprimer.

### absence controllers
#### Insert Absence
- Route: `/absence/insert`
- Méthode: POST
- Description: Insère une nouvelle absence.
#### Filtre Absence
- Route: `/absence/filtre`
- Méthode: POST
- Description: Filtre et diffuse les absences.
#### Get Your Absences
- Route: `/absence/getYourAbsences`
- Méthode: GET
- Description: Récupère les absences de l'utilisateur.

### proposition controllers
#### New Proposition
- Route: `/proposition/new_proposition`
- Méthode: POST
- Description: Insère une nouvelle proposition.
#### Get Proposed Teacher
- Route: `/proposition/teacher_on_absence/:absenceID`
- Méthode: GET
- Description: Récupère les enseignants proposés pour une absence.
- Paramètres:
  - absenceID: ID de l'absence.
#### Accept Proposition
- Route: `/proposition/acceptProposition`
- Méthode: POST
- Description: Accepte une proposition.
#### Get Your Replace
- Route: `/proposition/getYourReplace/:absenceID`
- Méthode: GET
- Description: Récupère votre remplaçant pour une absence.
- Paramètres:
  - absenceID: ID de l'absence.
#### Get Teacher Replace
- Route: `/proposition/getTeacherReplace`
- Méthode: GET
- Description: Récupère les remplacements des enseignants.

### diffusion controllers
#### Delete Teacher on Diffusion
- Route: `/diffusion/deleteTeacher`
- Méthode: POST
- Description: Supprime un enseignant de la diffusion.
#### Diffusions Provisor
- Route: `/diffusion/diffusionsProvisor/:id_abs`
- Méthode: GET
- Description: Récupère les diffusions pour un provisor.
- Paramètres:
  - id_abs: ID de l'absence.
#### Get My Diffusions
- Route: `/diffusion/getMyDiffusion`
- Méthode: GET
- Description: Récupère vos diffusions.

## contacts
