export const githubPage = "https://github.com/justtopich";
export const devMode:boolean = process.env.NODE_ENV !== 'production';
export const API_URL:string = devMode ? 'http://localhost:8080/' : window.location.origin
export const demoMode:boolean = false;
export const version:string = "v.0.5.1";
