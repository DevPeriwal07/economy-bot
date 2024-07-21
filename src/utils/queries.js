const prisma = require('./prisma');
const NodeCache = require('node-cache');

const queryCache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

class Queries {
  constructor() {}

  /**
   * Creates a new user account if it does not exists
   */
  async createUserAccount(id) {
    const prefix = `createUserAccount-${id}`;

    if (queryCache.has(prefix)) return;

    let data = await prisma.user.findUnique({
      where: { id },
    });

    if (data) {
      queryCache.set(prefix, data);
      return;
    }

    data = await prisma.user.create({ data: { id } });

    queryCache.set(prefix, data);
  }

  /**
   * Returns only currency values of the user.
   */
  async getUserCurrency(id) {
    const prefix = `getUserCurrency-${id}`;

    if (queryCache.has(prefix)) return queryCache.get(prefix);

    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        coins: true,
        bank: true,
      },
    });

    queryCache.set(prefix, data);

    return data;
  }
}

module.exports = new Queries();
