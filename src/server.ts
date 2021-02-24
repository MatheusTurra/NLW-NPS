import "reflect-metadata";
import express from "express";
import "./database";

const app = express();

app.get("/", (req, res) => {
    return res.json({message: "HelloWorld - TypeScript"});
});

app.post("/", (req, res) => {
    return res.json({message: "Dados enviados com sucesso"});
});

app.listen(3000,() => {
    console.log("Server running on port 3000");
});