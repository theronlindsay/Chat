import { writable } from 'svelte/store';
import type { ChatMessage, OllamaModel } from './ollama';

// Store for available Ollama models
export const models = writable<OllamaModel[]>([]);

// Store for the currently selected model
export const selectedModel = writable<string>('');

// Store for chat messages
export const messages = writable<ChatMessage[]>([]);

// Store for loading states
export const isLoadingModels = writable<boolean>(false);
export const isSendingMessage = writable<boolean>(false);

// Store for connection status
export const isConnected = writable<boolean>(false);

// Store for error messages
export const errorMessage = writable<string>('');

// Store for web search toggle
export const webSearchEnabled = writable<boolean>(true);

// Store for current server URL
export const currentServerUrl = writable<string>('');

// Helper function to add a message to the chat
export function addMessage(message: ChatMessage) {
  messages.update(msgs => [...msgs, message]);
}

// Helper function to clear all messages
export function clearMessages() {
  messages.set([]);
}

// Helper function to clear errors
export function clearError() {
  errorMessage.set('');
}
