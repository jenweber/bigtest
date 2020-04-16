import React, { FC } from "react";
import {
  MemoryRouter, Route,
  // @ts-ignore
  Routes
} from "react-router-dom";
import { ListDetail } from "./ListDetail";
import { FocusManager } from "./FocusManager";
import { Home } from "./Home";
// import { RunTest } from './RunTest';
import { RunFailCLI, RunPassCLI, RunFailCI, RunPassCI } from './RunTest';

interface AppProps {
}

export const App: FC<AppProps> = ({ }) => {
  return (
    <FocusManager>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list-detail/*" element={<ListDetail />} />
          {/* <Route path="/run-test" element={<RunTest />} /> */}
          <Route path="/run-fail-example-cli" element={<RunFailCLI />} />
          <Route path="/run-pass-example-cli" element={<RunPassCLI />} />
          <Route path="/run-fail-example-ci" element={<RunFailCI />} />
          <Route path="/run-pass-example-ci" element={<RunPassCI />} />
        </Routes>
      </MemoryRouter>
    </FocusManager>
  );
};
