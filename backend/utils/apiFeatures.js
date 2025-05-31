class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.filterQuery = {};
  }

  search() {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword.trim();
      const isObjectId = /^[a-f\d]{24}$/i.test(keyword);

      const searchCriteria = isObjectId
        ? { _id: keyword }
        : {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { maincategory: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } },
            { subcategory: { $regex: keyword, $options: 'i' } },
            { sku: { $regex: keyword, $options: 'i' } },
            { itemModelNum: { $regex: keyword, $options: 'i' } },
            { clocreProductId: { $regex: keyword, $options: 'i' } },
            { clocreUserId: { $regex: keyword, $options: 'i' } },
            { clocreOrderId: { $regex: keyword, $options: 'i' } },
          ],
        };

      this.filterQuery = { ...this.filterQuery, ...searchCriteria };

      // console.log("🔍 Search Criteria:", JSON.stringify(searchCriteria, null, 2));
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    const filters = JSON.parse(queryStr);

    const additionalConditions = [];

    // ✅ Price filtering with $elemMatch for variants
    if (filters.price) {
      const offPriceFilter = {};
      if (filters.price.$gte) offPriceFilter.$gte = Number(filters.price.$gte);
      if (filters.price.$lte) offPriceFilter.$lte = Number(filters.price.$lte);

      additionalConditions.push({
        $or: [
          { offPrice: offPriceFilter },
          {
            variants: {
              $elemMatch: {
                offPrice: offPriceFilter
              }
            }
          }
        ]
      });

      delete filters.price;
    }

    // ✅ Add remaining filters
    if (Object.keys(filters).length > 0) {
      additionalConditions.push(filters);
    }

    // ✅ Add any existing search conditions
    if (Object.keys(this.filterQuery).length > 0) {
      additionalConditions.push(this.filterQuery);
    }

    // ✅ Final combined query
    if (additionalConditions.length > 0) {
      this.filterQuery = { $and: additionalConditions };
    }

    // console.log("🔍 Final Combined Filter Query:", JSON.stringify(this.filterQuery, null, 2));

    this.query = this.query.find(this.filterQuery);
    return this;
  }
  
  

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const limit = this.queryStr.limit ? parseInt(this.queryStr.limit) : resPerPage;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(limit).skip(skip);

    // console.log(`📄 Pagination - Page: ${currentPage}, Limit: ${limit}, Skip: ${skip}`);
    return this;
  }
}

module.exports = APIFeatures;
