// roles.js
export const roles = {
    ADMIN: 'admin',
    USER: 'user',
};

// Define permissions for each role
export const permissions = {
    [roles.ADMIN]: ['create_recipes', 'edit_recipes', 'delete_recipes', 'view_users'],
    [roles.USER]: ['create_recipes', 'view_recipes'],
};
