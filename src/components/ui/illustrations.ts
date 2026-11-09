export const illustrationNames = ["website", "interface", "product", "styling"] as const;

export type IllustrationName = (typeof illustrationNames)[number];
