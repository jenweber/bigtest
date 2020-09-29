import { Operation } from 'effection';
import { DriverSpec } from '@bigtest/driver';
import * as path from 'path';
import { existsSync } from 'fs';
import * as fs from 'fs';

const CONFIG_FILE_NAME = 'bigtest.json';

const { readFile } = fs.promises;

export function getConfigFilePath(): string | undefined {
  let dir = process.cwd();
  do {
    let configFilePath = path.resolve(dir, CONFIG_FILE_NAME);
    if(existsSync(configFilePath)) {
      return configFilePath;
    }
    dir = path.resolve(dir, '..');
  } while(dir !== '/');
}

export function *loadConfigFile(configFilePath: string): Operation<ProjectOptions> {
  let contents = yield readFile(configFilePath);
  return JSON.parse(contents) as ProjectOptions;
}

export type ProjectOptions = {
  port: number;
  testFiles: string[];
  cacheDir: string;
  watchTestFiles: boolean;
  app: {
    url?: string;
    command?: string;
    env?: Record<string, string>;
    dir?: string;
  };
  proxy: {
    publicUrl: string;
    port: number;
  };
  connection: {
    publicUrl: string;
    port: number;
  };
  manifest: {
    publicUrl: string;
    port: number;
  };
  drivers: Record<string, DriverSpec>;
  launch: string[];
}

export function defaultConfig(configFilePath: string): ProjectOptions {
  return {
    port: 24002,
    app: {
    },
    proxy: {
      publicUrl: "http://localhost:24001",
      port: 24001,
    },
    connection: {
      publicUrl: "ws://localhost:24003",
      port: 24003,
    },
    manifest: {
      publicUrl: "http://localhost:24005",
      port: 24005,
    },
    testFiles: ["./test/**/*.test.{ts,js}"],
    cacheDir: path.resolve(path.dirname(configFilePath), '.bigtest'),
    watchTestFiles: true,
    drivers: {
      chrome: {
        module: "@bigtest/webdriver",
        options: {
          browserName: "chrome",
          headless: false
        }
      },
      "chrome.headless": {
        module: "@bigtest/webdriver",
        options: {
          browserName: "chrome",
          headless: true
        }
      },
      firefox: {
        module: "@bigtest/webdriver",
        options: {
          browserName: "firefox",
          headless: false
        }
      },
      "firefox.headless": {
        module: "@bigtest/webdriver",
        options: {
          browserName: "firefox",
          headless: true
        }
      },
      "safari": {
        module: "@bigtest/webdriver",
        options: {
          browserName: "safari",
          headless: false
        }
      },
    },
    launch: []
  }
};
