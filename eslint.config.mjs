import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
      "ignores": [
        "**/dist",
        "**/out-tsc",
        "**/vitest.config.*.timestamp*"
      ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                            sourceTag: "scope:util",
                            onlyDependOnLibsWithTags: ["scope:util"]
                        },
                        {
                            sourceTag: "scope:ui",
                            onlyDependOnLibsWithTags: ["scope:util"]
                        },
                        {
                            sourceTag: "scope:api",
                            onlyDependOnLibsWithTags: ["scope:util"]
                        },
                        {
                            sourceTag: "scope:app",
                            onlyDependOnLibsWithTags: ["scope:ui", "scope:util", "scope:api"]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
