import { z } from "zod";
import type { ProviderConfig, FieldDefinition } from "./types/common";
import { assembleSchema, extractDefaultValues } from "./types/provider";

// Registry of all available providers
export const providerRegistry: Record<string, ProviderConfig> = {};

// Helper function to get provider configuration
export function getProviderConfig(providerName?: string): ProviderConfig | undefined {
  if (!providerName) return undefined;
  return providerRegistry[providerName.toLowerCase()];
}

// Add new storage provider
export function addProvider(providerName: string, providerConfig: ProviderConfig) {
  providerRegistry[providerName.toLowerCase()] = providerConfig;
}

// Helper function to get provider schema
export function getProviderSchema(providerName: string) {
  const config = getProviderConfig(providerName);
  if (!config) {
    return z.object({}); // Empty schema for unknown providers
  }
  const fieldDefinitions = config.fields.filter(
    (field): field is FieldDefinition => "type" in field && field.type !== "message",
  );
  return assembleSchema(fieldDefinitions);
}

// Helper function to get default values for a provider
export function getProviderDefaultValues(providerName: string): Record<string, any> {
  const config = getProviderConfig(providerName);
  if (!config) {
    return {}; // Empty defaults for unknown providers
  }
  const fieldDefinitions = config.fields.filter(
    (field): field is FieldDefinition => "type" in field && field.type !== "message",
  );
  return extractDefaultValues(fieldDefinitions);
}

// Helper function to get all available providers
export function getAvailableProviders(): ProviderConfig[] {
  return Object.values(providerRegistry);
}

// Helper function to get provider by name
export function getProviderByName(name: string): ProviderConfig | undefined {
  return providerRegistry[name.toLowerCase()];
}
