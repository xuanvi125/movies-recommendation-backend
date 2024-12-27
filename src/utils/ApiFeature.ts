export class ApiFeature {
  query: any;
  queryObject: any;
  totalPages: number;
  page: number;

  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  search(searchField) {
    const { search } = this.queryObject;
    if (search) {
      this.query = this.query.find({
        [searchField]: { $regex: new RegExp(search), $options: 'i' },
      });
    }
    return this;
  }
  filter() {
    const queryObj = { ...this.queryObject };
    const excludeFields = ['page', 'limit', 'sort', 'search'];
    excludeFields.forEach((el) => delete queryObj[el]);
    const queryString = JSON.stringify(queryObj).replace(
      /\b(gt|gte|in|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(
      JSON.parse(queryString, (key, value) => {
        if (typeof value === 'string' && !isNaN(Number(value))) {
          return Number(value);
        }
        if (
          typeof value === 'string' &&
          value.startsWith('[') &&
          value.endsWith(']')
        ) {
          try {
            return JSON.parse(value);
          } catch (e) {}
        }
        return value;
      }),
    );

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  async paginate() {
    const totalDocs = await this.query.clone().countDocuments();
    const page =
      (this.queryObject.page * 1 <= 0 ? null : this.queryObject.page * 1) || 1;
    const limit = this.queryObject.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.totalPages = Math.ceil(totalDocs / limit);
    this.page = page;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
