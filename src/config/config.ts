export const githubPage = "https://github.com/justtopich";
export const devMode:boolean = process.env.NODE_ENV !== 'production';
export const API_URL:string = devMode ? 'http://localhost:8080/' : 'http://localhost:8080/'
