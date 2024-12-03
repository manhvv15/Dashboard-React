
# iChiba React + Vite + Tailwind CSS


## Installation
```bash
  git clone git@bitbucket.org:janbox/ichiba-react-template.git
  cd ichiba-react-template
  yarn
  yarn dev
```
    
## Setup for another app
- The default application code is `icb`
- Change `VITE_APP_CODE` in `vite.config.ts` file to your application code, for example `ichiba`
- Change `APP_CODE` in `Jenkinsfile` file to your application code, for example `ichiba`
- Rename the folder `public/YOUR_OLD_APP_CODE` to `public/YOUR_NEW_APP_CODE`, for example `public/icb` to `public/ichiba`
- Restart your app