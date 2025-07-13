import { Message } from '@/types/chat';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export class ConversationService {
  private static readonly STORAGE_KEY = 'lumo-conversations';
  private static readonly MAX_CONVERSATIONS = 100;

  public static saveConversation(messages: Message[], title?: string): string {
    const conversations = this.getAllConversations();
    const conversationId = crypto.randomUUID();
    
    const conversation: Conversation = {
      id: conversationId,
      title: title || this.generateTitle(messages),
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: this.extractTags(messages)
    };

    conversations.unshift(conversation);

    // Keep only the most recent conversations
    if (conversations.length > this.MAX_CONVERSATIONS) {
      conversations.splice(this.MAX_CONVERSATIONS);
    }

    this.saveToStorage(conversations);
    return conversationId;
  }

  public static updateConversation(id: string, messages: Message[]): void {
    const conversations = this.getAllConversations();
    const index = conversations.findIndex(conv => conv.id === id);
    
    if (index !== -1) {
      conversations[index].messages = messages;
      conversations[index].updatedAt = new Date().toISOString();
      conversations[index].tags = this.extractTags(messages);
      this.saveToStorage(conversations);
    }
  }

  public static getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations();
    return conversations.find(conv => conv.id === id) || null;
  }

  public static getAllConversations(): Conversation[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public static getConversationSummaries(): ConversationSummary[] {
    const conversations = this.getAllConversations();
    
    return conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      messageCount: conv.messages.length,
      lastMessage: conv.messages[conv.messages.length - 1]?.content.slice(0, 100) + '...' || '',
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      tags: conv.tags
    }));
  }

  public static deleteConversation(id: string): void {
    const conversations = this.getAllConversations();
    const filtered = conversations.filter(conv => conv.id !== id);
    this.saveToStorage(filtered);
  }

  public static searchConversations(query: string): ConversationSummary[] {
    const conversations = this.getAllConversations();
    const lowercaseQuery = query.toLowerCase();
    
    return conversations
      .filter(conv => 
        conv.title.toLowerCase().includes(lowercaseQuery) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(lowercaseQuery)) ||
        conv.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .map(conv => ({
        id: conv.id,
        title: conv.title,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1]?.content.slice(0, 100) + '...' || '',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        tags: conv.tags
      }));
  }

  public static exportConversation(id: string, format: 'json' | 'txt' | 'md' = 'txt'): string {
    const conversation = this.getConversation(id);
    if (!conversation) throw new Error('Conversation not found');

    switch (format) {
      case 'json':
        return JSON.stringify(conversation, null, 2);
      
      case 'md':
        return this.formatAsMarkdown(conversation);
      
      case 'txt':
      default:
        return this.formatAsText(conversation);
    }
  }

  public static downloadConversation(id: string, format: 'json' | 'txt' | 'md' = 'txt'): void {
    const conversation = this.getConversation(id);
    if (!conversation) return;

    const content = this.exportConversation(id, format);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static generateTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50);
      return title.length < firstUserMessage.content.length ? title + '...' : title;
    }
    return `Conversation ${new Date().toLocaleDateString()}`;
  }

  private static extractTags(messages: Message[]): string[] {
    const tags = new Set<string>();
    const content = messages.map(msg => msg.content).join(' ').toLowerCase();
    
    // Simple tag extraction based on common topics
    const tagPatterns = [
      { pattern: /\b(code|coding|programming|javascript|python|react|typescript)\b/g, tag: 'coding' },
      { pattern: /\b(write|writing|story|creative|poem|article)\b/g, tag: 'writing' },
      { pattern: /\b(math|mathematics|calculate|equation|formula)\b/g, tag: 'math' },
      { pattern: /\b(help|question|how to|explain|tutorial)\b/g, tag: 'help' },
      { pattern: /\b(business|marketing|strategy|plan)\b/g, tag: 'business' },
      { pattern: /\b(design|ui|ux|interface|layout)\b/g, tag: 'design' }
    ];

    tagPatterns.forEach(({ pattern, tag }) => {
      if (pattern.test(content)) {
        tags.add(tag);
      }
    });

    return Array.from(tags);
  }

  private static formatAsText(conversation: Conversation): string {
    let output = `Conversation: ${conversation.title}\n`;
    output += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
    output += `Updated: ${new Date(conversation.updatedAt).toLocaleString()}\n`;
    output += `Tags: ${conversation.tags.join(', ')}\n\n`;
    output += '=' .repeat(50) + '\n\n';

    conversation.messages.forEach(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      const role = msg.role === 'user' ? 'You' : 'Lumo.AI';
      output += `[${timestamp}] ${role}:\n${msg.content}\n\n`;
    });

    return output;
  }

  private static formatAsMarkdown(conversation: Conversation): string {
    let output = `# ${conversation.title}\n\n`;
    output += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}  \n`;
    output += `**Updated:** ${new Date(conversation.updatedAt).toLocaleString()}  \n`;
    output += `**Tags:** ${conversation.tags.join(', ')}  \n\n`;
    output += '---\n\n';

    conversation.messages.forEach(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      const role = msg.role === 'user' ? '👤 **You**' : '🤖 **Lumo.AI**';
      output += `## ${role} *(${timestamp})*\n\n${msg.content}\n\n`;
    });

    return output;
  }

  private static saveToStorage(conversations: Conversation[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save conversations:', error);
      }
    }
  }
}
