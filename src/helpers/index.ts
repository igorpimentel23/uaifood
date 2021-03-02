function RestaurantCostQueryHelper(cost: number[]): string {
  let len = cost.length;
  const isLenOdd = len % 2;
  let query = '';

  if (isLenOdd) {
    len -= 1;
  }

  for (let i = 0; i < len; i += 2) {
    query = `${query}(restaurants.cost BETWEEN ${cost[i]} AND ${cost[i + 1]}) `;
    if (i < len - 2) {
      query = `${query}OR `;
    }
  }

  if (isLenOdd) {
    if (query) {
      query = `${query}OR `;
    }
    query = `${query}(restaurants.cost >= ${cost[len]}) `;
  }

  return query;
}

export default RestaurantCostQueryHelper;
