import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers.js';
import { typeDefs } from './typeDefs.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;
const APOLLO_PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN_APOLLO;

// Configuración de CORS
const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

// API REST - Obtener usuarios
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        orders: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// API REST - Obtener productos
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// API REST - Obtener categorías
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// API REST - Obtener órdenes
app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: APOLLO_PORT },
  context: async ({ req }) => ({ token: req.headers.token }),
  cors: corsOptions,
});

// Iniciar servidor Express
app.listen(PORT, () => {
  console.log(`Servidor REST en funcionamiento en http://localhost:${PORT}/users`);
  console.log(`Servidor REST en funcionamiento en http://localhost:${PORT}/products`);
  console.log(`Servidor REST en funcionamiento en http://localhost:${PORT}/categories`);
  console.log(`Servidor REST en funcionamiento en http://localhost:${PORT}/orders`);
  console.log(`Apollo Server listo en ${url}`);
});
