# fullstack-social-app

## Notes

- 组件分类：按DDD中 “域” 概念划分组件
- 其实整个项目的划分都是按 "领" 划分的
- 目前共用的组件都放在了 “Layout” 下
- 不管前端和后端分层都很浅，特别是后端不像以往分三层，直接把控制器层和业务层放到了一起
- 把通用业务和逻辑都放到 “utils” 下面
- 多用 `try-catch` 处理异步
- `connectDb` 时报错则直接 `process.exit(1);`
- 其实手写 `DnD` 也不难，多构思零依赖的组件

## Menu

```bash
.
├── README.md
├── api
├── components
├── config.env.example
├── middleware
├── models
├── next.config.js
├── node_modules
├── package.json
├── pages
├── public
├── server.js
├── utilsClient
├── utilsServer
└── yarn.lock

9 directories, 7 files
```

## Links

- [https://nextjs.org/docs/advanced-features/custom-app]

6-10 0_5
