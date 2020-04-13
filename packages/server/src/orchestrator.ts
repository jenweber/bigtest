import * as path from 'path';
import { fork, Operation } from 'effection';
import { Mailbox } from '@bigtest/effection';
import { AgentServer } from '@bigtest/agent';
import { ProjectOptions } from '@bigtest/project';

import { createProxyServer } from './proxy';
import { createCommandServer } from './command-server';
import { createCommandProcessor } from './command-processor';
import { createConnectionServer } from './connection-server';
import { createAgentServer } from './agent-server';
import { createAppServer } from './app-server';
import { createManifestGenerator } from './manifest-generator';
import { createManifestBuilder } from './manifest-builder';
import { createManifestServer } from './manifest-server';

import { Atom } from './orchestrator/atom';

type OrchestratorOptions = {
  atom: Atom;
  delegate?: Mailbox;
  project: ProjectOptions;
}

export function* createOrchestrator(options: OrchestratorOptions): Operation {
  console.log('[orchestrator] starting');

  let connectionServerInbox = new Mailbox();

  let proxyServerDelegate = new Mailbox();
  let commandServerDelegate = new Mailbox();
  let connectionServerDelegate = new Mailbox();
  let agentServerDelegate = new Mailbox();
  let appServerDelegate = new Mailbox();
  let manifestGeneratorDelegate = new Mailbox();
  let manifestBuilderDelegate = new Mailbox();
  let manifestServerDelegate = new Mailbox();

  let agentServer = AgentServer.create({ port: options.project.agent.port, externalURL: process.env['BIGTEST_AGENT_SERVER_URL'] });

  let manifestSrcDir = path.resolve(options.project.cacheDir, 'manifest/src');
  let manifestBuildDir = path.resolve(options.project.cacheDir, 'manifest/build');
  let manifestDistDir = path.resolve(options.project.cacheDir, 'manifest/dist');

  let manifestSrcPath = path.resolve(manifestSrcDir, 'manifest.js');

  yield fork(createAgentServer({
    delegate: agentServerDelegate,
    agentServer
  }));

  yield fork(createProxyServer({
    delegate: proxyServerDelegate,
    port: options.project.proxy.port,
    targetPort: options.project.app.port,
    inject: `<script src="${agentServer.harnessScriptURL}"></script>`,
  }));

  yield fork(createCommandServer({
    delegate: commandServerDelegate,
    atom: options.atom,
    port: options.project.port,
  }));

  yield fork(createConnectionServer({
    inbox: connectionServerInbox,
    delegate: connectionServerDelegate,
    atom: options.atom,
    port: options.project.connection.port,
    proxyPort: options.project.proxy.port,
    manifestPort: options.project.manifest.port,
  }));

  yield fork(createAppServer({
    delegate: appServerDelegate,
    ...options.project.app
  }));

  yield fork(createManifestServer({
    delegate: manifestServerDelegate,
    dir: manifestDistDir,
    port: options.project.manifest.port,
  }));

  yield fork(createManifestGenerator({
    delegate: manifestGeneratorDelegate,
    files: options.project.testFiles,
    destinationPath: manifestSrcPath,
  }));

  console.debug('[orchestrator] wait for manifest generator');
  // wait for manifest generator before starting manifest builder
  yield manifestGeneratorDelegate.receive({ status: 'ready' });
  console.debug('[orchestrator] manifest generator ready');

  yield fork(createManifestBuilder({
    delegate: manifestBuilderDelegate,
    atom: options.atom,
    srcPath: manifestSrcPath,
    distDir: manifestDistDir,
    buildDir: manifestBuildDir,
  }));

  yield function*() {
    yield fork(function*() {
      yield proxyServerDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] proxy server ready');
    });
    yield fork(function*() {
      yield commandServerDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] command server ready');
    });
    yield fork(function*() {
      yield connectionServerDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] connection server ready');
    });
    yield fork(function*() {
      yield appServerDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] app server ready');
    });
    yield fork(function*() {
      yield manifestBuilderDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] manifest builder ready');
    });
    yield fork(function*() {
      yield manifestServerDelegate.receive({ status: 'ready' });
      console.debug('[orchestrator] manifest server ready');
    });
  }

  console.log("[orchestrator] running!");

  let commandUrl = `http://localhost:${options.project.port}`;
  let connectUrl = agentServer.connectURL(`ws://localhost:${options.project.connection.port}`);
  console.log(`[orchestrator] launch agents via: ${connectUrl}`);
  console.log(`[orchestrator] show GraphQL dashboard via: ${commandUrl}`);

  options.delegate && options.delegate.send({ status: 'ready' });

  let commandProcessorInbox = new Mailbox();
  yield connectionServerDelegate.pipe(commandProcessorInbox);
  yield commandServerDelegate.pipe(commandProcessorInbox);

  try {
    yield createCommandProcessor({
      proxyPort: options.project.proxy.port,
      manifestPort: options.project.manifest.port,
      atom: options.atom,
      inbox: commandProcessorInbox,
      delegate: connectionServerInbox,
    });
  } finally {
    console.log("[orchestrator] shutting down!");
  }
}
