import { Operation, spawn } from 'effection';
import { subscribe, ChainableSubscription } from '@effection/subscription';
import { Mailbox } from '@bigtest/effection';
import { Atom } from '@bigtest/atom';
import { OrchestratorState } from './orchestrator/state';
import { AgentConnection, createAgentHandler, Command, TestEvent } from '@bigtest/agent';
import { consoleReporter } from '@bigtest/reporter';

interface ConnectionServerOptions {
  inbox: Mailbox<Command>;
  delegate: Mailbox;
  atom: Atom<OrchestratorState>;
  port: number;
  proxyPort: number;
  manifestPort: number;
};

export function* createConnectionServer(options: ConnectionServerOptions): Operation {
  let reporter = consoleReporter({ prefix: '[connection]' });
  let handler: ChainableSubscription<AgentConnection, void> = yield createAgentHandler(options.port);

  options.delegate.send({ status: "ready" });

  while(true) {
    let connection: AgentConnection = yield handler.expect();
    yield spawn(function*() {
      reporter.info(`connected ${connection.agentId}`);
      let agent = options.atom.slice('agents', connection.agentId);

      agent.set({ ...connection.data, agentId: connection.agentId });

      yield spawn(function*(): Operation<void> {
        while (true) {
          let message = yield options.inbox.receive({ agentId: connection.agentId });
          reporter.debug('sending message to agent', connection.agentId, message);
          connection.send(message);
        }
      });

      yield subscribe(connection.events).forEach(function*(message: TestEvent) {
        reporter.debug('got message from agent', connection.agentId, message);
        options.delegate.send({ ...message, agentId: connection.agentId });
      });

      agent.remove();
    });
  }
}
