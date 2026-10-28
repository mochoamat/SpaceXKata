# Angular & NgRx "SpaceX Explorer" v1.0

A small Angular 21 application that lists past SpaceX launches and shows the details of each one. State is managed with NgRx (store, effects, selectors) and the UI uses Angular Material.

Launch data is served locally from [`public/launches.json`](public/launches.json), so no internet connection or API key is needed at runtime.

## Prerequisites

| Tool    | Version                                         |
| ------- | ----------------------------------------------- |
| Node.js | `^20.19.0`, `^22.12.0` or `>=24.0.0` (Angular 21 requirement) |
| npm     | `11.x` (the project declares `npm@11.6.2`)      |

Check your versions:

```bash
node -v
npm -v
```

Installing the Angular CLI globally is optional: the scripts below use the local copy from `node_modules`.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/mochoamat/SpaceXKata.git
cd SpaceXKata
npm install
```

## Running the application

Start the development server:

```bash
npm start
```

Then open [http://localhost:4200](http://localhost:4200) in your browser. The app reloads automatically when you change a source file.

To use a different port:

```bash
npm start -- --port 4300
```

### Available routes

| Route          | Description                              |
| -------------- | ---------------------------------------- |
| `/`            | List of past launches                    |
| `/launch/:id`  | Details of the launch with that flight number |

## Running the tests

Unit tests run with [Vitest](https://vitest.dev/) through the Angular CLI:

```bash
npm test
```

## Building for production

```bash
npm run build
```

The optimized output is written to `dist/`. To rebuild automatically while developing, use:

```bash
npm run watch
```

## Debugging state

The NgRx Store DevTools are enabled. Install the [Redux DevTools](https://github.com/reduxjs/redux-devtools) browser extension to inspect actions and state while the app is running.

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── launches-list/   # List page
│   │   └── launch-detail/   # Detail page
│   ├── models/              # Launch DTO
│   ├── services/            # SpacexService (reads launches.json)
│   ├── state/               # NgRx actions, reducer, effects, selectors
│   ├── app.config.ts        # Providers (router, HTTP, store, effects)
│   └── app.routes.ts        # Route definitions
├── main.ts
└── styles.scss
public/
└── launches.json            # Local launch data
```
