import { Inject, Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PostHog } from "posthog-node";

export const POSTHOG_CONFIG = Symbol("POSTHOG_CONFIG");

export type PostHogConfig = {
  apiKey?: string;
  host: string;
};

@Injectable()
export class PostHogService implements OnModuleDestroy {
  private client: PostHog | null = null;

  constructor(@Inject(POSTHOG_CONFIG) private readonly config: PostHogConfig) {}

  async isFeatureEnabled(
    flagKey: string,
    distinctId: string,
    groups?: Record<string, string>,
  ): Promise<boolean> {
    const client = this.getClient();
    if (!client) {
      return false;
    }

    return (await client.isFeatureEnabled(flagKey, distinctId, { groups })) ?? false;
  }

  async getFeatureFlagValue<T extends string | boolean>(
    flagKey: string,
    distinctId: string,
    defaultValue: T,
    groups?: Record<string, string>,
  ): Promise<T> {
    const client = this.getClient();
    if (!client) {
      return defaultValue;
    }

    const value = await client.getFeatureFlag(flagKey, distinctId, { groups });
    return (value as T) ?? defaultValue;
  }

  async getFeatureFlagPayload<T = unknown>(
    flagKey: string,
    distinctId: string,
    groups?: Record<string, string>,
  ): Promise<T | undefined> {
    const client = this.getClient();
    if (!client) {
      return undefined;
    }

    const payload = await client.getFeatureFlagPayload(flagKey, distinctId, undefined, { groups });
    return payload as T | undefined;
  }

  async getAllFlags(
    distinctId: string,
    groups?: Record<string, string>,
  ): Promise<Record<string, string | boolean>> {
    const client = this.getClient();
    if (!client) {
      return {};
    }

    return client.getAllFlags(distinctId, { groups });
  }

  capture(distinctId: string, eventName: string, properties?: Record<string, unknown>): void {
    this.getClient()?.capture({ distinctId, event: eventName, properties });
  }

  identify(distinctId: string, properties?: Record<string, unknown>): void {
    this.getClient()?.identify({ distinctId, properties });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.shutdown();
      this.client = null;
    }
  }

  private getClient(): PostHog | null {
    if (!this.config.apiKey) {
      return null;
    }

    if (!this.client) {
      this.client = new PostHog(this.config.apiKey, {
        host: this.config.host,
        flushAt: 20,
        flushInterval: 10_000,
      });
    }

    return this.client;
  }
}
