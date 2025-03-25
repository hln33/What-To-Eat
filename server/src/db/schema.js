"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionTable = exports.userTable = exports.steps = exports.ingredients = exports.recipesToIngredients = exports.recipes = exports.db = void 0;
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var libsql_1 = require("drizzle-orm/libsql");
exports.db = (0, libsql_1.drizzle)(process.env.DB_FILE_NAME);
/* RECIPES */
exports.recipes = (0, sqlite_core_1.sqliteTable)('recipes', {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    userId: (0, sqlite_core_1.int)('user_id')
        .references(function () { return exports.userTable.id; }, { onDelete: 'cascade' })
        .notNull(),
    name: (0, sqlite_core_1.text)().notNull(),
});
exports.recipesToIngredients = (0, sqlite_core_1.sqliteTable)('recipes_to_ingredients', {
    recipeId: (0, sqlite_core_1.int)('recipe_id')
        .references(function () { return exports.recipes.id; })
        .notNull(),
    ingredientId: (0, sqlite_core_1.int)('ingredient_id')
        .references(function () { return exports.ingredients.id; })
        .notNull(),
}, function (table) { return [(0, sqlite_core_1.primaryKey)({ columns: [table.recipeId, table.ingredientId] })]; });
exports.ingredients = (0, sqlite_core_1.sqliteTable)('ingredients', {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)().notNull().unique(),
});
exports.steps = (0, sqlite_core_1.sqliteTable)('steps', {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    stepNumber: (0, sqlite_core_1.int)().notNull(),
    instruction: (0, sqlite_core_1.text)().notNull(),
    recipeId: (0, sqlite_core_1.int)('recipe_id')
        .references(function () { return exports.recipes.id; }, { onDelete: 'cascade' })
        .notNull(),
});
/* USERS & SESSIONS */
exports.userTable = (0, sqlite_core_1.sqliteTable)('user', {
    id: (0, sqlite_core_1.int)().primaryKey({ autoIncrement: true }),
    username: (0, sqlite_core_1.text)().unique().notNull(),
    passwordHash: (0, sqlite_core_1.text)('password_hash').notNull(),
});
exports.sessionTable = (0, sqlite_core_1.sqliteTable)('session', {
    id: (0, sqlite_core_1.text)().primaryKey(),
    userId: (0, sqlite_core_1.int)('user_id')
        .notNull()
        .references(function () { return exports.userTable.id; }),
    expiresAt: (0, sqlite_core_1.int)('expires_at', {
        mode: 'timestamp',
    }).notNull(),
});
