"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.getAllRecipes = exports.getRecipe = exports.createRecipe = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var schema_ts_1 = require("../db/schema.ts");
var createRecipe = function (userId, name, ingredients, steps) { return __awaiter(void 0, void 0, void 0, function () {
    var newRecipe, _i, ingredients_1, ingredientName, existingIngredient, ingredientId, newIngredient, _a, _b, _c, index, step;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, schema_ts_1.db
                    .insert(schema_ts_1.recipes)
                    .values({ userId: userId, name: name })
                    .returning()];
            case 1:
                newRecipe = (_d.sent())[0];
                _i = 0, ingredients_1 = ingredients;
                _d.label = 2;
            case 2:
                if (!(_i < ingredients_1.length)) return [3 /*break*/, 9];
                ingredientName = ingredients_1[_i];
                return [4 /*yield*/, schema_ts_1.db
                        .select()
                        .from(schema_ts_1.ingredients)
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.ingredients.name, ingredientName))
                        .limit(1)];
            case 3:
                existingIngredient = (_d.sent()).at(0);
                ingredientId = void 0;
                if (!!existingIngredient) return [3 /*break*/, 5];
                return [4 /*yield*/, schema_ts_1.db
                        .insert(schema_ts_1.ingredients)
                        .values({ name: ingredientName })
                        .returning()];
            case 4:
                newIngredient = (_d.sent())[0];
                ingredientId = newIngredient.id;
                return [3 /*break*/, 6];
            case 5:
                ingredientId = existingIngredient.id;
                _d.label = 6;
            case 6: return [4 /*yield*/, schema_ts_1.db
                    .insert(schema_ts_1.recipesToIngredients)
                    .values({ recipeId: newRecipe.id, ingredientId: ingredientId })];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9:
                _a = 0, _b = steps.entries();
                _d.label = 10;
            case 10:
                if (!(_a < _b.length)) return [3 /*break*/, 13];
                _c = _b[_a], index = _c[0], step = _c[1];
                return [4 /*yield*/, schema_ts_1.db.insert(schema_ts_1.steps).values({
                        stepNumber: index,
                        instruction: step,
                        recipeId: newRecipe.id,
                    })];
            case 11:
                _d.sent();
                _d.label = 12;
            case 12:
                _a++;
                return [3 /*break*/, 10];
            case 13: return [4 /*yield*/, (0, exports.getRecipe)(newRecipe.id)];
            case 14: return [2 /*return*/, _d.sent()];
        }
    });
}); };
exports.createRecipe = createRecipe;
var getRecipe = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, ingredients, steps;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, schema_ts_1.db
                    .select({ id: schema_ts_1.recipes.id, name: schema_ts_1.recipes.name })
                    .from(schema_ts_1.recipes)
                    .where((0, drizzle_orm_1.eq)(schema_ts_1.recipes.id, id))
                    .limit(1)];
            case 1:
                recipe = (_a.sent()).at(0);
                if (recipe === undefined) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, schema_ts_1.db
                        .select({ name: schema_ts_1.ingredients.name })
                        .from(schema_ts_1.ingredients)
                        .innerJoin(schema_ts_1.recipesToIngredients, (0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.ingredientId, schema_ts_1.ingredients.id))
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.recipeId, id))];
            case 2:
                ingredients = _a.sent();
                if (ingredients.length === 0) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, schema_ts_1.db
                        .select({ instruction: schema_ts_1.steps.instruction })
                        .from(schema_ts_1.steps)
                        .innerJoin(schema_ts_1.recipes, (0, drizzle_orm_1.eq)(schema_ts_1.recipes.id, schema_ts_1.steps.recipeId))
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.steps.recipeId, id))];
            case 3:
                steps = _a.sent();
                if (steps.length === 0) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, {
                        id: recipe.id,
                        name: recipe.name,
                        ingredients: ingredients.map(function (ingredient) { return ingredient.name; }),
                        instructions: steps.map(function (step) { return step.instruction; }),
                    }];
        }
    });
}); };
exports.getRecipe = getRecipe;
var getAllRecipes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var recipeRows, recipes, _i, recipeRows_1, row, recipeId, recipeName, steps;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, schema_ts_1.db
                    .select()
                    .from(schema_ts_1.recipes)
                    .innerJoin(schema_ts_1.recipesToIngredients, (0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.recipeId, schema_ts_1.recipes.id))
                    .innerJoin(schema_ts_1.ingredients, (0, drizzle_orm_1.eq)(schema_ts_1.ingredients.id, schema_ts_1.recipesToIngredients.ingredientId))];
            case 1:
                recipeRows = _a.sent();
                recipes = {};
                _i = 0, recipeRows_1 = recipeRows;
                _a.label = 2;
            case 2:
                if (!(_i < recipeRows_1.length)) return [3 /*break*/, 5];
                row = recipeRows_1[_i];
                recipeId = row.recipes.id;
                recipeName = row.recipes.name;
                if (!recipes[recipeId]) {
                    recipes[recipeId] = {
                        id: recipeId,
                        name: recipeName,
                        ingredients: [],
                        instructions: [],
                    };
                }
                recipes[recipeId].ingredients.push(row.ingredients.name);
                return [4 /*yield*/, schema_ts_1.db
                        .select({
                        order: schema_ts_1.steps.stepNumber,
                        instruction: schema_ts_1.steps.instruction,
                    })
                        .from(schema_ts_1.steps)
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.steps.recipeId, recipeId))
                        .innerJoin(schema_ts_1.recipes, (0, drizzle_orm_1.eq)(schema_ts_1.recipes.id, schema_ts_1.steps.recipeId))];
            case 3:
                steps = _a.sent();
                recipes[recipeId].instructions = steps
                    .toSorted(function (a, b) { return a.order - b.order; })
                    .map(function (step) { return step.instruction; });
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, Object.values(recipes)];
        }
    });
}); };
exports.getAllRecipes = getAllRecipes;
var deleteRecipe = function (recipeId) { return __awaiter(void 0, void 0, void 0, function () {
    var associatedIngredients, _i, associatedIngredients_1, ingredientId, recipeAssociations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, schema_ts_1.db
                    .select({ ingredientId: schema_ts_1.recipesToIngredients.ingredientId })
                    .from(schema_ts_1.recipesToIngredients)
                    .where((0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.recipeId, recipeId))];
            case 1:
                associatedIngredients = _a.sent();
                if (associatedIngredients.length === 0) {
                    throw new Error('Recipe should have ingredients associated with it, but none were found.');
                }
                return [4 /*yield*/, schema_ts_1.db
                        .delete(schema_ts_1.recipesToIngredients)
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.recipeId, recipeId))];
            case 2:
                _a.sent();
                _i = 0, associatedIngredients_1 = associatedIngredients;
                _a.label = 3;
            case 3:
                if (!(_i < associatedIngredients_1.length)) return [3 /*break*/, 7];
                ingredientId = associatedIngredients_1[_i].ingredientId;
                return [4 /*yield*/, schema_ts_1.db
                        .select({ count: (0, drizzle_orm_1.count)() })
                        .from(schema_ts_1.recipesToIngredients)
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.recipesToIngredients.ingredientId, ingredientId))];
            case 4:
                recipeAssociations = _a.sent();
                if (!(recipeAssociations[0].count === 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, schema_ts_1.db
                        .delete(schema_ts_1.ingredients)
                        .where((0, drizzle_orm_1.eq)(schema_ts_1.ingredients.id, ingredientId))];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, schema_ts_1.db.delete(schema_ts_1.recipes).where((0, drizzle_orm_1.eq)(schema_ts_1.recipes.id, recipeId))];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteRecipe = deleteRecipe;
