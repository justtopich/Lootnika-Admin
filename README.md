# Lootnika Admin

Control panel for my another project [Lootnika](https://github.com/justtopich/lootnika) ETL framework based on react 

functional components and hooks.



## Requirements

- Node 16.x
- yarn
- TypeScript 14.x
- Ant Design 4.x



## Configuration

Available parameters in `/src/config/config.ts`:

* **API_URL** - change Lootnika url that be using when running in develop mode
* **demoMode** - in this mode all request are replacing to fake http request with fake response.



## Running the app

First install dependencies with `yarn install`

To run the application in development mode:

```shell
yarn run start
```

Application will start on **3060** port and connecting to Lootnika on **API_URL**.

