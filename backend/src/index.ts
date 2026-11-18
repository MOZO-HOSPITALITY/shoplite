import express, { type ErrorRequestHandler } from 'express';
import { getProduct, listCategories, listProducts } from './catalog.js';
import { resolveDiscount } from './discounts.js';
import { HttpError } from './errors.js';
import { getOrder, placeOrder } from './orders.js';

const app = express();
app.use(express.json({ limit: '100kb' }));

const asString = (value: unknown) => (typeof value === 'string' ? value : undefined);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', (req, res) => {
  res.json(
    listProducts({
      q: asString(req.query.q),
      category: asString(req.query.category),
      sort: asString(req.query.sort),
    }),
  );
});

app.get('/api/products/:id', (req, res) => {
  res.json(getProduct(Number(req.params.id)));
});

app.get('/api/categories', (_req, res) => {
  res.json(listCategories());
});

app.post('/api/discounts/validate', (req, res) => {
  res.json(resolveDiscount(req.body?.code));
});

app.post('/api/orders', (req, res) => {
  res.status(201).json(placeOrder(req.body ?? {}));
});

app.get('/api/orders/:id', (req, res) => {
  res.json(getOrder(req.params.id));
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
};
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`ShopLite API listening on http://localhost:${port}`);
});
