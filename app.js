"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firework = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
const assert = require("assert");
const uuid_1 = require("uuid");
var Firework;
(function (Firework) {
    // interface RocketData  {
    //   name: string;
    //   type: string;
    //   intensity: string;
    //   lifetime: string;
    //   color: string;        
    // }
    let server = Http.createServer();
    let port = process.env.PORT;
    if (port == undefined)
        port = 5001;
    const dbName = "rockets";
    let databaseUrl = "mongodb+srv://AmandaAuer:Aimiainidiai18!@firework.qkegs.mongodb.net/Firework?retryWrites=true&w=majority";
    connectToDatabase(databaseUrl);
    console.log("Server starting on port:" + port);
    server.listen(port);
    server.addListener("request", handleRequest);
    // tslint:disable-next-line:no-any
    let response = {};
    let db;
    async function connectToDatabase(_url) {
        try {
            let options = { useNewUrlParser: true, useUnifiedTopology: true };
            let mongoClient = new Mongo.MongoClient(_url, options);
            // tslint:disable-next-line: typedef
            await mongoClient.connect(function (err) {
                assert.equal(null, err);
                console.log("Connected successfully to server");
                db = mongoClient.db(dbName);
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        if (_request.url) {
            let url = Url.parse(_request.url, true);
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
    function AddRocket(response, _response) {
        try {
            console.log(response);
            response["_id"] = uuid_1.v4();
            const collection = db.collection("rocket");
            collection.insertMany([response]);
            console.log("add");
            _response.end();
        }
        catch (e) {
            console.log(e);
        }
    }
    async function DeleteRocket(response, _response) {
        let rockets = await db.collection("rocket");
        let rocketName = response.Name;
        await rockets.deleteOne({ "Name": rocketName });
        console.log("del");
        _response.end();
    }
    async function GetRockets(_response) {
        try {
            let rockets = await db.collection("rocket").find({});
            let results = await rockets.toArray();
            console.log("get");
            await _response.write(JSON.stringify(results));
            await _response.end();
        }
        catch (e) {
            console.log(e);
        }
    }
})(Firework = exports.Firework || (exports.Firework = {}));
//# sourceMappingURL=app.js.map