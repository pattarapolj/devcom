import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: [
            "next/core-web-vitals",
            "next/typescript",
            "standard",
            "plugin:tailwindcss/recommended",
            "prettier",
        ],
        plugins: ["import"],
        rules: {
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin", // Node.js built-in modules
                        "external", // External libraries
                        "internal", // Internal modules
                        ["parent", "sibling"], // Parent and sibling modules together
                        "index", // Index files
                        "object", // Object imports
                    ],
                    "newlines-between": "always",
                    pathGroups: [
                        {
                            pattern: "@app/**",
                            group: "external",
                            position: "after",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
        },
        ignorePatterns: ["components/ui/**"],
        overrides: [
            {
                files: ["*.ts", "*.tsx"],
                rules: {
                    "no-undef": "off",
                },
            },
        ],
    }),
];

export default eslintConfig;
