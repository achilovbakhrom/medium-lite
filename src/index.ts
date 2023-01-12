import { container } from 'tsyringe';
import { Application } from "./server/application";

export async function start() {
  const application = container.resolve(Application);
  await application.listen();
}