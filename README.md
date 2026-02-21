# Getting started

1. Download the project
   git clone git@github.com:s15-coder/Todoporbogota.git
   cd Todoporbogota

2. If you want to work in the frontend

   ```
   cd frontend/todoporbogota
   npm install
   npm run dev
   ```

   Once these command are executed you are ready to get working on the frontend.

3. If you want to work in the backend

   This command will build the latest state of the frontend and will set it inside `backend/todoporbogota/view` as this is the way the frontend is served.

   ```
   sh .scripts/build-deploy.sh
   ```

   Then execute:

   ```
   cd backend/todoporbogota
   npm install
   npm run dev
   ```

   You're set to get working in the backend

# How to deploy

You need to be aware that whenever the backend is being deployed, the fronted too. ONLY deploy in the master branch, since all code in this branch should be stable.

```
sh .scripts/build-deploy.sh
vercel
```

All the questions prompted from here should be related only to your account.
