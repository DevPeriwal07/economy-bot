const prisma = require('./prisma');
const NodeCache = require('node-cache');

// Query caches
const userCurrencyCache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

module.exports = {
  updateUserCurrency: (id, data) => {
    userCurrencyCache.set(id, data);
  },

  getUserCurrency: async (id) => {
    if (userCurrencyCache.has(id)) return userCurrencyCache.get(id);

    const select = {
      coins: true,
      bank: true,
    };

    let user = await prisma.user.findUnique({
      where: { id },
      select,
    });

    if (!user) {
      user = await prisma.user.create({
        data: { id },
        select,
      });
    }

    userCurrencyCache.set(id, user);

    return user;
  },
};
