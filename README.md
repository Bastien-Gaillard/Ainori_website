# Ainori

## Sommaire:

    * L'application
    * Technologies
    * Prérequis
    * Installation
    * Structure
    * Contributeurs
    

## L'application

Ainori est une application de covoiturage pour les élèves du centre de formation Nextech.
Elle a plusieurs fonctionnalités :
   - Pour les utilisateurs :

          * Connexion au site via leurs identifiants
          * Création d'un trajet
          * Inscription à un trajet
          * Dé-inscription d'un trajet
          * Gestion de ses véhicules
          * Visualisation de l'historique de ses trajets
          * Gestion de son profil
          * Messagerie

   - Pour les administrateurs :

          * Connexion au site via leurs identifiants
          * Visualisation de l'intégralité des trajets
          * Visualisation de l'historique de tous les trajets
          * Gestion de son profil
          * Gestion de ses véhicules
          * Messagerie
  
## Technologies
 
### React
Permet de créer la page et les composant de l'application en utilisant du Javascript (coté front).
<br/>La documentation : https://fr.legacy.reactjs.org/
### Node.js / Express
Permet de créer l'api utilisé par l'application (coté back).
<br/>La documentation : https://nodejs.org/en
                   https://expressjs.com/fr/
### Socket.io
Permet une communication bidirectionelle utilisée pour créer la messagerie instantanée
<br/>La documentation : https://socket.io/
### Mui
Permet d'importer des composants préconçus afin de simplifier l'intégration et la gestion du style.
<br/>La documentation : https://mui.com/material-ui/getting-started/overview/
### Email.js
Permet de gérer l'envoi des mails pour les mot de passe oublié 
<br/> La documentation : https://www.emailjs.com/docs/
## Prerequis

### Node.js 
Pour commencer il faudra installer Node.js version 18.16.0 
<br/> Le lien de téléchargement : https://nodejs.org/en/download

## Installation

### Cloner le projet : 

Ouvrez l'inviter de commande puis executer la commande suivante : ```git clone https://github.com/Bastien-Gaillard/Ainori_web.git```

Cela vous permettra d'avoir le projet sur votre ordinateur 

### Installer les dépendances

Il faut maintenant installer les dépendances tel que express, mui, etc.
<br/>Pour cela, allez dans votre dossier : ```cd ./Ainori_web```
<br/> Puis cela executez la commande suivante : ```npm install --f```

### Connecter la base de donnée 

A la racine du projet, créez un fichier ```.env```

Ajouter à l'interieur le code suivant : 
<br/>
```
DATABASE_URL="mysql://Windev:DMib8e6ntl5YMZCUv3se@51.91.249.126:3306/ainori"
ACCESS_TOKEN_SECRET=4242XX424208
REFRESH_TOKEN_SECRET=424200000X1
```

### Executer le projet 

Pour lancer le projet en mode développeur executer la commande suivante : ```npm run dev```
<br/>Pour y acceder aller sur le lien suivant : http://localhost:3001/

<br/><br/>
**Compte administrateur :**<br/>
email: bastien.gaillard@formation-technologique.fr <br/>
password: Azerty_1234
<br/><br/>
**Compte utilisateur :**<br/>
email: thomas.barron@formation-technologique.fr <br/>
password: Azerty_1234

## Structure

La structure du projet (les fichiers importants) : 

├── prisma                       <br/>
│   ├── schema.prisma            <br/>
├── public                       <br/>
├── server                       <br/>
│   ├── index.js                 <br/>
│   ├── routes                   <br/>
├── src                          <br/>
│   ├── composants               <br/>
├── package.json

<br/>schema.prisma :          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Schema de la base de données orienté objet
<br/>public :                 &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; Dossier pour stocker les images, fichier, etc
<br/>server -> index.js :     &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;Fichier qui permet de créer l'api du serveur ainsi que de gérer les routes et sessions (express, node.js, socket.io)
<br/>server -> routes :       &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;Dossier contenant les fichiers javascript des routes de l'api (express, node.js)
<br/>src -> composants :      &nbsp;&nbsp; &nbsp;Les composants qui s'affiche sur le site web (react)
<br/>package.json :           &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Contient les commandes tel que 'npm run dev' ainsi que toutes les dépendances


## Contributeurs 
  
  GAILLARD Bastien   <br/>
  LALLEMENT Lilian   <br/>
  BARRON Thomas      <br/>
