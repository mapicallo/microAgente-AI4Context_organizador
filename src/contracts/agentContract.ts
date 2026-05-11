/**
 * AI4Context Agent Contract — borrador (Fase 0).
 * Inspirado en capacidades MCP-style sin depender del runtime MCP.
 */

/** Transporte previsto para connectors */
export type AgentTransport = 'local' | 'api' | 'web_tab' | 'mcp';

/** Nivel de confianza para catálogo / marketplace futuro */
export type AgentTrustLevel = 'official' | 'verified' | 'community';

/**
 * Metadatos declarativos de un agente conectable (catálogo curado o JSON firmado).
 * Los ejecutores concretos siguen en registry + manifests hasta integración completa.
 */
export type AgentContract = {
  /** Identificador estable, ej. ai4context.ma.echo */
  id: string;
  /** Versión semántica del contrato expuesto */
  version: string;
  capabilities: string[];
  transport: AgentTransport;
  /** Permisos MV3 / host que puede necesitar el connector */
  permissions: string[];
  trustLevel: AgentTrustLevel;
  /** Título para UI (reemplazar por i18n centralizado si crece) */
  titleEs: string;
  titleEn: string;
};
