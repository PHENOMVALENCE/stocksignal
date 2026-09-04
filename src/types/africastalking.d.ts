declare module "africastalking" {
  import type { AfricasTalkingClient } from "@/services/africas-talking/types";

  interface AfricasTalkingOptions {
    apiKey: string;
    username: string;
  }

  export default function initialize(
    options: AfricasTalkingOptions,
  ): AfricasTalkingClient;
}
