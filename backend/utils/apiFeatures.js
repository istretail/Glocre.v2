class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
      this.filterQuery = {};
    }
  
    search() {
      if (this.queryStr.keyword) {
        const keyword = this.queryStr.keyword.trim();
        const isObjectId = /^[a-f\d]{24}$/i.test(keyword); // Check for ObjectId format
        const searchCriteria = isObjectId
            ? { _id: keyword }
            : { name: { $regex: keyword, $options: 'i' } };
    
        this.query = this.query.find(searchCriteria);
    }
      return this;
    }
  
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields from queryString
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    const filters = JSON.parse(queryStr);

    // Handle price filtering including variants
    if (filters.price) {
      const priceFilter = {};
      if (filters.price.$gte) priceFilter.$gte = filters.price.$gte;
      if (filters.price.$lte) priceFilter.$lte = filters.price.$lte;

      this.query = this.query.find({
        $or: [
          { price: priceFilter }, // Check product's main price
          { "variants.price": priceFilter }, // Check variant prices
        ],
      });

      delete filters.price; // Remove price filter from default processing
    }

    this.query = this.query.find(filters);

    return this;
  }

  
    paginate(resPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
      const limit = this.queryStr.limit ? parseInt(this.queryStr.limit) : resPerPage;
      const skip = resPerPage * (currentPage - 1);
  
      this.query = this.query.limit(limit).skip(skip);
      return this;
    }
  }
  
  module.exports = APIFeatures;
  