import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";

export default defineUserConfig({
    head: [
        
    ],
    locales: {
    '/': {
      lang: 'Ru',
    },
    '/en/': {
      lang: 'Eng',
    },
  },
    title: 'GravitLauncher Wiki',
    description: 'GravitLauncher Wiki',
    port: '8080', //Порт на котором запускается VuePress
    bundler: viteBundler({}),
    theme: defaultTheme({
        repo: 'GravitLauncher/Launcher',
        docsRepo: 'https://github.com/GravitLauncher/LauncherWiki',
        docsBranch: 'main',
        docsDir: 'docs',
        editLinkPattern: ':repo/edit/:branch/:path',
        locales: {
            '/': {
                selectLanguageName: 'Russian',
                editLinkText: 'Измените эту страницу на GitHub',
                lastUpdatedText: "Последнее обновление",
                notFound: [
                    "Здесь ничего нет.",
                    "Как мы тут оказались?",
                    "Похоже, у нас есть несколько неработающих ссылок."
                ],
                backToHome: "Вернуться на главную",
                openInNewWindow: "открыть в новом окне",
                toggleDarkMode: "переключить темный режим",
                toggleSidebar: "переключить боковую панель",
                contributors: false,
                contributorsText: "Спонсоры",
            },
            '/en/': {
                editLinkText: 'Change this page to GitHub',
                lastUpdatedText: "Last update",
                notFound: [
                    "There's nothing here.",
                    "How did we get here?",
                    "Looks like we have a few links that don't work."
                ],
                backToHome: "Back to Home",
                openInNewWindow: "open in a new window",
                toggleDarkMode: "go dark",
                toggleSidebar: "switch the sidebar",
                contributors: false,
                contributorsText: "Sponsors",
            },
        },
        logo: 'images/logo.png',
        navbar: [
                {
                    text: 'Руководство',
                    children: [
                        '/ru/install/README.md',
                        '/ru/auth/README.md',
                        '/ru/clientbuild/README.md',
                        '/ru/servers/README.md',
                        '/ru/runtime/README.md',
                        '/ru/other/README.md',
                        '/ru/modules/README.md',
                        '/ru/dev/README.md',
                    ],
                },
                {
                    text: 'Зеркало',
                    link: 'https://mirror.gravitlauncher.com/',
                },
                {
                    text: 'Discord',
                    link: 'https://discord.gg/b9QG4ygY75',
                },
            ],
            '/en/': [
                {
                    text: 'Guide',
                    children: [
                        '/en/install/README.md',
                        '/en/auth/README.md',
                        '/en/clientbuild/README.md',
                        '/en/servers/README.md',
                        '/en/runtime/README.md',
                        '/en/other/README.md',
                        '/en/modules/README.md',
                        '/en/dev/README.md',
                    ],
                },
                {
                    text: 'Mirror',
                    link: 'https://mirror.gravitlauncher.com/',
                },
                {
                    text: 'Discord',
                    link: 'https://discord.gg/b9QG4ygY75',
                },
            ],

        sidebar: {
            '/': [
                {
                    text: 'Руководство',
                    collapsible: false,
                    children: [
                        '/ru/install/README.md',
                        '/ru/auth/README.md',
                        '/ru/clientbuild/README.md',
                        '/ru/servers/README.md',
                        '/ru/runtime/README.md',
                        '/ru/other/README.md',
                        '/ru/modules/README.md',
                        '/ru/dev/README.md',
                    ],
                },
            ],
            '/en/': [
                {
                    text: 'Руководство',
                    collapsible: false,
                    children: [
                        '/en/install/README.md',
                        '/en/auth/README.md',
                        '/en/clientbuild/README.md',
                        '/en/servers/README.md',
                        '/en/runtime/README.md',
                        '/en/other/README.md',
                        '/en/modules/README.md',
                        '/en/dev/README.md',
                    ],
                },
            ],
        },
    }),
    plugins: [
        docsearchPlugin({
            appId: 'H9GISVMWXN',
            apiKey: '256b831b5e9c45c225d0a55f2de0d4b0',
            indexName: 'gravitlauncher1',
            debug: false,
            locales: {
                '/': {
                    placeholder: 'Поиск',
                    translations: {
                        button: {
                            buttonText: 'Поиск',
                        },
                    },
                },
                '/en/': {
                    placeholder: 'Search',
                    translations: {
                        button: {
                            buttonText: 'Search',
                        },
                    },
                },
            },
        }),
    ]
})
