export type AccessSnapshot = {
  roles: string[];
  permissions: string[];
};

export type RoleRecord = {
  id: string;
  name: string;
  guardName: string;
  description: string | null;
  isDefault: boolean;
};
