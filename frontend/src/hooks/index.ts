// Query Hooks (for fetching data)
export { useCampaigns } from './useCampaigns';
export { useCampaign } from './useCampaign';
export { useContacts } from './useContacts';
export { useTemplates } from './useTemplates';

// Mutation Hooks (for modifying data)
export { useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from './useCampaignMutations';
export { useCreateContact, useImportContacts, useUpdateContact, useDeleteContact } from './useContactMutations';
export { useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from './useTemplateMutations';
export { useCheckCampaign, useLaunchCampaign, useSendTestEmail } from './useMailMutations';

// Type exports
export type { Campaign } from './useCampaigns';
export type { Contact } from './useContacts';
export type { Template } from './useTemplates';
