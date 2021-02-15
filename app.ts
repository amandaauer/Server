import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";
import * as assert from "assert";
import { v4 as uuidv4 } from 'uuid';
export namespace Firework {
  // interface RocketData  {
  //   name: string;
  //   type: string;
  //   intensity: string;
  //   lifetime: string;
  //   color: string;        
  // }
  let server: Http.Server = Http.createServer();
  let port: number | string | undefined = process.env.PORT;
  if (port == undefined)
        port = 5001;
  const dbName: string = "rockets";
  let databaseUrl: string = "mongodb+srv://AmandaAuer:Aimiainidiai18!@firework.qkegs.mongodb.net/Firework?retryWrites=true&w=majority";
  connectToDatabase(databaseUrl);
  console.log("Server starting on port:" + port);

  server.listen(port);
  server.addListener("request", handleRequest);
    // tslint:disable-next-line:no-any
  let response: any = {};

  let db: Mongo.Db;
  async function connectToDatabase(_url: string): Promise<void> {
      try {
          let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
          let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
          // tslint:disable-next-line: typedef
          await mongoClient.connect(function(err: Mongo.MongoError) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            db = mongoClient.db(dbName);
          });
        } catch (e) {
          console.log(e);
        }
    }
  async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {


        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        if (_request.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
            for (let key in url.query) {
              response[key] = url.query[key];
            }
        }
        switch (_request.method) {
          case "POST":
           await AddRocket(response, _response);
           break;
          case "GET":
           await GetRockets(_response);
           break;
          case "DELETE":
            await DeleteRocket(response, _response);
            break;
          default:
            console.log("default");
            _response.end();
            break;
        }
  }
  function AddRocket(response: any, _response: Http.ServerResponse): void {
        try {
          console.log(response)
          response["_id"]=uuidv4();
          const collection: Mongo.Collection<any> = db.collection("rocket");
          collection.insertMany([response]);
          console.log("add")
          _response.end();
        } catch (e) {
          console.log(e);
          }
  }
  async function DeleteRocket(response: any, _response: Http.ServerResponse): Promise<void> {
    let rockets: Mongo.Collection<any> = await db.collection("rocket");
    let rocketName: string  = response.Name;
    await rockets.deleteOne({ "Name": rocketName });
    console.log("del")
    _response.end();

  }
  async function GetRockets(_response: Http.ServerResponse): Promise<void> {
    try {
      let rockets: Mongo.Cursor = await db.collection("rocket").find({});
      let results: string[] = await rockets.toArray();
      console.log("get")
      await _response.write(JSON.stringify(results));                             
      await  _response.end();
    } catch (e) {
      console.log(e);
    }
  }
}