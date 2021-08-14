<div align="center">
  <img width="80" src="./frontend/src/assets/monurls_icon.png" alt="logo" />

  # monurls

</div>

我自己的 Node.js 短链接服务。

## About

写这个项目的初衷是学习如何用 Node.js 做全栈开发（ ~~重复造轮子~~ ），以及写一个简单的、私用的、基本只用 Node.js 的短链接服务。

这个短链接服务使用 Node.js 作为服务端，MariaDB 作为数据库。前端框架为 React，后端框架为 Fastify。

## Functions

- 认证，虽然不怎么安全但聊胜于无，毕竟初衷就是只有我自己能用。
- 缩短链接，可指定短链接和过期时间。
- 短链接管理，可以删除短链接、重新指定短链接和修改过期时间。

## Install

1. 安装 Node.js 并进行以下操作：

```shell
git clone https://github.com/idlist/monurls
npm install
```

2. 在 MariaDB 中创建数据库，并将仓库中的 `config.temp.yaml` 和 `config.backend.temp.yaml` 中的配置项进行相应的调整并分别更名为 `config.yaml` 和 `config.backend.yaml`。

3. 继续进行以下操作：

```shell
npm run prod
```

4. 有需要的话，用 `nginx`、`apache` 或者 `caddy` 等工具进行 `https` 等其他配置。

结束！

## License

MIT

反正没有其他人用，随便挂个 License 啦！