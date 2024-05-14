class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        let queryObj = { ...this.queryString };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
        excludedFields.forEach((el) => {
            delete queryObj[el]
        })

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = {};

        if (queryString) {
            query = JSON.parse(queryString);
        }
        this.mongooseQuery = this.mongooseQuery.find(query);
        return this;
    }

    paginate(documentCount) {
        const limit = this.queryString.limit * 1 || 5;
        const page = this.queryString.page * 1 || 1;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;


        const pagination = {}
        pagination.currentPage = page;
        pagination.limti = limit;
        pagination.numberOfpages = Math.ceil(documentCount / limit);

        //next - prev
        if (endIndex < documentCount) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }

        this.paginationResult = pagination
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }
        return this;
    }

    search() {
        if (this.queryString.keyword) {
            const query = {}
            query.$or = [
                { title: { $regex: this.queryString.keyword, $options: 'i' } },
                { description: { $regex: this.queryString.keyword, $options: 'i' } }
            ]
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    limitedfields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields)
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }
        return this;
    }

}

export default ApiFeatures