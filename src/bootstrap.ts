import "reflect-metadata";
import "./di"

import('./index')
  .then((module) =>
    module.start()
  );