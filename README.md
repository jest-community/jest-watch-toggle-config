# Jest Watch Toggle Plugin

[![Build Status](https://travis-ci.org/jest-community/jest-watch-toggle.svg?branch=master)](https://travis-ci.org/jest-community/jest-watch-toggle) [![npm version](https://badge.fury.io/js/jest-watch-toggle.svg)](https://badge.fury.io/js/jest-watch-toggle)

<div align="center">
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://cdn.worldvectorlogo.com/logos/jest.svg">
  </a>
  <h1>jest-watch-toggle</h1>
  <p>Toggle your Jest boolean config settings at will</p>
</div>

![Watch](FIXME:GIF)

## Usage

### Install

Install `jest`_(it needs Jest 23.4+)_ and `jest-watch-toggle`

```bash
yarn add --dev jest jest-watch-toggle

# or with NPM

npm install --save-dev jest jest-watch-toggle
```

### Add it to your Jest config

Since Jest 23.3, you can provide per-instance watch plugin configuration. Jest 23.4 opens up the list of global configuration settings that can be altered by watch plugins. Together, these evolutions let us use this same plugin in multiple ways, as along as the targeted configuration setting is boolean.

There are three mandatory configuration items you need to provide:

1.  `key` is the keyboard key that will be bound to this plugin instance, toggling the setting you’re interested in.
2.  `prompt` is the plugin prompt displayed in the watch menu. In this text, you can use the `%ONOFF%` placeholder, that will be dynamically replaced by either `on` or `off`, depending on the resulting setting value.
3.  `setting` is the boolean Jest configuration setting you want to toggle. Boolean settings available for configuration through watch plugins, as of Jest 23.4, include [`bail`](https://jestjs.io/docs/en/configuration#bail-boolean), [`collectCoverage`](https://jestjs.io/docs/en/configuration#collectcoverage-boolean), `noSCM`, [`notify`](https://jestjs.io/docs/en/configuration#notify-boolean), `onlyFailures`, [`passWithNoTests`](https://jestjs.io/docs/en/cli#passwithnotests) and [`verbose`](https://jestjs.io/docs/en/configuration#verbose-boolean).

Here’s an example for toggling both test verbosity (details of passed/failed tests) and code coverage collection with this plugin.

In your `package.json`:

```json
{
  "jest": {
    "watchPlugins": [
      [
        "jest-watch-toggle",
        {
          "key": "v",
          "prompt": "turn %ONOFF% tests verbosity",
          "setting": "verbose"
        }
      ],
      [
        "jest-watch-toggle",
        {
          "key": "e",
          "prompt": "turn %ONOFF% code coverage collection",
          "setting": "collectCoverage"
        }
      ]
    ]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  watchPlugins: [
    [
      'jest-watch-toggle',
      {
        key: 'v',
        prompt: 'turn %ONOFF% tests verbosity',
        setting: 'verbose',
      },
    ],
    [
      'jest-watch-toggle',
      {
        key: 'e',
        prompt: 'turn %ONOFF% code coverage collection',
        setting: 'collectCoverage',
      },
    ],
  ],
}
```

### Run Jest in watch mode

```bash
yarn jest --watch

# or with NPM

npx jest --watch
```
