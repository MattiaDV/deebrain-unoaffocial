import { readFile } from 'node:fs/promises';
import cookie from 'cookie';
import formidable from 'formidable';
import dbLayer from './api/dbLayer.js';
import fs from 'fs';
import cache from './api/cache.js';
import express from 'express';
const app = express()
const port = 3000
import path from 'path';
import session from 'express-session';
import getPages from './api/getPages.js';
import postPages from './api/postPages.js';


app.use(session({
    secret: 'abcdefghi',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.get('/', async (req, res) => {
    getPages.getIndex(req, res);
});

app.get('/index.html', async (req, res) => {
    getPages.getIndex(req, res);
});

app.get('/login.html', async (req, res) => {
    getPages.getLogin(req,res);
});

app.get('/register.html', async (req, res) => {
    getPages.getRegister(req,res);
});

app.post('/home.html', async (req, res) => {
    postPages.postHome(req,res);
});   

app.get('/listing.html', async (req, res) => {
    getPages.getListing(req,res);
});

app.get('/mypage.html', async (req, res) => {
    getPages.getMyPage(req,res);
});

app.get('/paginaD.html', async (req, res) => {
    getPages.getDpage(req,res);
});

app.get('/edit.html', async (req, res) => {
    getPages.getEdit(req,res);
}); 

app.post('/edit.html', async (req, res) => {
    postPages.postEdit(req,res);
});

const staticPath = path.join(process.cwd(), './');

app.use(express.static(staticPath));

app.use((req, res) => {
    res.status(404).send('File non trovato');
});

app.listen(port, "127.0.0.1", () => {
    console.log("Listening to 127.0.0.1");
});