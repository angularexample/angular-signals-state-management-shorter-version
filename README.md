# AngularSignalState

Example of State Management using pure signals.
This version compares to:

* [Angular 20 Signals State](https://github.com/angularexample/angular20-signal-state)

The difference is that in this version the store methods, actions, reducers, and effects, are collapsed into a single method. 

Also, the facade service is removed.

This is the simplest version of the Signal State pattern.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## To Run This App

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Steps Taken to Create This App

### Install Latest Angular CLI

Install or update your global Angular CLI to the latest version.

```
npm i -g @angular/cli
```

### Create New Angular App

Use the Angular CLI to create a new Angular app.

Open a terminal window, go the the directory which will be the parent of your new workspace directory, and run this command:

```
ng new angular-signal-state
```

Accept all the default options, except choose the following:

* SCSS
* Zoneless

Open the new workspace in your IDE.

Open a new terminal window, and make sure your are in the new workspace directory. The rest of the commands will be run from this terminal window.


### Install Angular Material

Angular Material is needed for the loading spinner.

Install Angular Material:

```
    ng add @angular/material
```

Accept all the default options.

## Replace Jasmine and Karma with Jest

We will be replacing Jasmine and Karma with Jest.

### Remove Jasmine and Karma packages

Remove all the Jasmine and Karma packages from `package.json`.

```
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.9.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
```

### Install Jest

Install Jest and the Jest Angular preset and the dependencies.

```
npm install --save-dev jest @types/jest jest-preset-angular jest-environment-jsdom
```

### Add Jest Configuration

#### Create jest.config.js File

Create a `jest.config.js` file in the root of the project.

```javascript
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transform: {
        '^.+\\.ts$': 'ts-jest', // Only transform .ts files
    },
    transformIgnorePatterns: [
        '/node_modules/(?!flat)/', // Exclude modules except 'flat' from transformation
    ],
};
```

#### Create setup-jest.ts File

Create a `setup-jest.ts` file in the root of the project.

If not using Zone.js, add the following to the setup-jest.ts file.
```javascript
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
```

If using Zone.js, add the following to the setup-jest.ts file.
```typescript
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
```

#### Update test Section in angular.json

Update the test section in the angular.json file.

```
"test": {
  "builder": "@angular-devkit/build-angular:jest",
  "options": {
    "tsConfig": "tsconfig.spec.json"
  }
}
```

#### Add esModuleInterop to tsconfig.json

Add the following to the `tsconfig.json` file under the `compilerOptions` section.

```
"esModuleInterop": true
```

#### Update tsconfig.spec.json

In the `tsconfig.spec.json` file, update the `compilerOptions` section as follows:

```
{
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest"]
  },
}
```

#### Update scripts in package.json

In the `scripts` section of the `package.json` file, change the `test` property to `jest`.

```
    "test": "jest"
```

