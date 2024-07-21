# This is a web socket implementations demo project

## How to start the project on localhost

We can launch this command to start docker-compose in the background. 
```shell
make up
```

We can launch this command to check the logs of docker container.
```shell
make logs
```

We can launch this command to stop docker container.
```shell
make stop
```

Please use this command for checking all the commands
```shell
make help
```

## The environment values
I added the environment variables in the docker-compose file to simulate a Kubernetes context.
We can also use a .env file to have these configurations in the environment.

## The restful apis
- API global Price Index 'http://127.0.0.1:3000/v1/orderbook/global-price-index'
- API mid-prices of all these providers 'http://127.0.0.1:3000/v1/orderbook/mid-prices'
- API health for the health checking like k8s 'http://127.0.0.1:3000/health'
- API OpenAPI doc http://127.0.0.1:3000/api
- Front websocket demo http://127.0.0.1:3000/websocket

I integrated API versioning. So for the business apis, we should add 'v1' to the url. 
On the localhost, we can check them from [openapi doc](http://127.0.0.1:3000/api).


## Web socket Demo
I created a template to have the websocket demo (app/views/index.hbs).
This page will send event to the server and the server will send event1 and event2 as well.
We can check them on the console.

## The data resource
I fetch all these data resource form websocket. This is the documents:
- Binance: https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams
- Houbi https://huobiapi.github.io/docs/spot/v1/en/#market-depth
- Kraken https://docs.kraken.com/websockets-v2/#book

I used the Nestjs Websocket to integrate them.

## Observability (Logging)
In this project, I used pino-logger to generate logs in JSON format. 
The logs contain necessary information such as `log level`, `time`, `pid`, `context`, `msg`, and `payload`. 
With this information, we can easily push the logs into Kibana or similar tools and create index mappings in our logging system. 
We can also integrate Prometheus to gather metrics.

```json lines
{"level":30,"time":1719665643967,"pid":171,"hostname":"5a001c827ff4","context":"KrakenOrderBookGateway","msg":"Receive Kraken midPrice info","midPrice":61026.45,"provider":"kraken"}
{"level":30,"time":1719665643966,"pid":171,"hostname":"5a001c827ff4","context":"BinanceOrderBookGateway","msg":"Receive Binance midPrice info","midPrice":61011.945,"provider":"binance"}
{"level":30,"time":1719665642064,"pid":171,"hostname":"5a001c827ff4","context":"HuobiOrderBookGateway","msg":"Receive Huobi midPrice info","midPrice":61011.645000000004,"provider":"huobi"}
```

## test
I added some unit tests to test the application. You can launch this command to test the application.

```shell
make test
```

If we want to have the coverage about these tests, we should use this command.
```shell
make test-cov
```

## Git Hook
I added a git hook using husky. 
For using husky GitHook, we should install the library on the **root** of the project.
This is a git pre-commit hook, it will launch the test and lint command before the Git Commit.

### Install the husky library
```shell
pnpm i
```

After a commit, if Docker wasn't started, the pre-commit hook start Docker at first.
Then the hook launches lint and unit test.

```text
Start docker, please wait a little!
[+] Running 2/2
 ⠿ Network websocket-demo-app-1     Created                                                                                                                               0.0s
 ⠿ Container websocket-demo-app-1  Started                                                                                                                               0.2s

> websocket-demo@0.0.1 lint /app
> eslint "{src,apps,libs,test}/**/*.ts" --fix


> websocket-demo@0.0.1 test /app
> jest
```

If Docker was started, the hook launches lint and unit test directly.
```text
Docker has been started. The tests will be launched!

> websocket-demo@0.0.1 lint /app
> eslint "{src,apps,libs,test}/**/*.ts" --fix


> websocket-demo@0.0.1 test /app
> jest
```

## How to integrate new provider
Ideally, we should use always websocket to fetch the data.
All classes should inherit an abstract class `OrderBookWebSocketAbstract`.
If you want to check the details, please read [this doc](app/src/orderbook/websockets/README.md).

## Deploy this project to the production.
I prepared a Dockerfile with a target `production`. We can use it to build an image.
If we use k8s or similar tools to deploy the application, it will very easy to pull the docker image and launch it .

## Persist the data (Database and caches)
If we want to persist the data, we can add a database to store all these order books. 
In this case, we could also integrate Redis as a cache to improve I/O performance.


## Author Info
* [@Chunlin Wang](https://www.linkedin.com/in/chunlin-wang-b606b159/)
* [GitHub ChunlinWang](https://github.com/chunlinwang?tab=repositories)