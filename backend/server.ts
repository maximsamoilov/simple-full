import express, { Request, Response } from 'express';
import cors from 'cors';
import { add, subtract, multiply, divide } from './calculator';

const app = express();
app.use(cors());
app.use(express.json());

interface CalculateRequest {
  a?: string | number;
  b?: string | number;
  operation?: string;
}

app.post('/calculate', (req: Request<{}, {}, CalculateRequest>, res: Response) => {
  const { a, b, operation } = req.body;
  
  if (a === undefined || b === undefined || !operation) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const numA = typeof a === 'string' ? parseFloat(a) : a;
  const numB = typeof b === 'string' ? parseFloat(b) : b;

  if (isNaN(numA) || isNaN(numB)) {
    res.status(400).json({ error: 'Invalid numbers' });
    return;
  }

  try {
    let result: number;
    switch (operation) {
      case 'add':
        result = add(numA, numB);
        break;
      case 'subtract':
        result = subtract(numA, numB);
        break;
      case 'multiply':
        result = multiply(numA, numB);
        break;
      case 'divide':
        result = divide(numA, numB);
        break;
      default:
        res.status(400).json({ error: 'Unknown operation' });
        return;
    }
    res.json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
// Do not start server if it's imported in tests
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
